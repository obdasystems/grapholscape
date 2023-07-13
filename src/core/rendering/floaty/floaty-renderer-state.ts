import cytoscape, { NodeSingular } from "cytoscape";
import automove from 'cytoscape-automove';
import { Renderer } from "..";
import { BaseRenderer, GrapholscapeTheme, GrapholTypesEnum, iFilterManager, Ontology, RendererStatesEnum } from "../../../model";
import { lock_open } from "../../../ui/assets/icons";
import FloatyFilterManager from "./filter-manager";
import floatyStyle from "./floaty-style";
import FloatyTransformer from "./floaty-transformer";
import computeHierarchies from "../incremental/compute-hierarchies";

cytoscape.use(automove)

export default class FloatyRendererState extends BaseRenderer {
  readonly id: RendererStatesEnum = RendererStatesEnum.FLOATY
  filterManager: iFilterManager = new FloatyFilterManager()
  protected _layout: cytoscape.Layouts

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
      newRenderer.renderStateData[this.id].popperContainers = new Map<number, HTMLDivElement>()
      this.floatyLayoutOptions = this.defaultLayoutOptions
    }
  }

  get renderer() { return super.renderer }

  transformOntology(ontology: Ontology): void {
    ontology.diagrams.forEach(diagram => {
      const floatyTransformer = new FloatyTransformer()
      diagram.representations.set(this.id, floatyTransformer.transform(diagram))
    })
    computeHierarchies(ontology)
  }

  runLayout(): void {
    if (!this.renderer.cy) return
    this._layout?.stop()
    this._layout = this.renderer.cy.elements().layout(this.floatyLayoutOptions)
    this._layout.one('layoutstop', (e) => {
      if (e.layout === this._layout) // only if layout has not changed
        this.layoutRunning = false
    })
    this._layout.run()
    this.layoutRunning = true
  }

  render(): void {
    if (!this.renderer.diagram) return

    let floatyRepresentation = this.renderer.diagram.representations.get(this.id)

    if (!floatyRepresentation) {
      const floatyTransformer = new FloatyTransformer()
      floatyRepresentation = floatyTransformer.transform(this.renderer.diagram)
      this.renderer.diagram.representations.set(this.id, floatyRepresentation)
    }

    this.renderer.cy = floatyRepresentation.cy
    this.renderer.mount()

    if (!floatyRepresentation.hasEverBeenRendered) {
      this.floatyLayoutOptions.fit = true
      this.runLayout()
      if (this.isLayoutInfinite) {
        setTimeout(() => this.renderer.fit(), 1000)
      }
      this.popperContainers.set(this.renderer.diagram.id, document.createElement('div'))
      this.setDragAndPinEventHandlers();

      (this.renderer.cy as any).automove(this.automoveOptions)
    }

    if (this.popperContainer)
      this.renderer.cy.container()?.appendChild(this.popperContainer)

    if (!this.dragAndPin)
      this.unpinAll()

    if (this.isLayoutInfinite) {
      this.floatyLayoutOptions.fit = false
      this.runLayout()
    }

    floatyRepresentation.hasEverBeenRendered = true
  }

  stopRendering(): void {
    this._layout?.stop()
  }

  getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[] {
    return floatyStyle(theme)
  }

  stopLayout(): void {
    this._layout?.stop()
    this.floatyLayoutOptions.infinite = false
  }

  runLayoutInfinitely() {
    this.floatyLayoutOptions.infinite = true
    this.floatyLayoutOptions.fit = false
    this.runLayout()
  }

  pinNode(nodeOrId: NodeSingular | string) {
    if (!nodeOrId || !this.renderer.cy) return
    let node: NodeSingular

    if (typeof (nodeOrId) === 'string') {
      node = this.renderer.cy.$id(nodeOrId)
    } else {
      node = nodeOrId
    }

    if (node.data().pinner)
      return

    node.lock()
    node.data("pinned", true);
    let n = node as any
    n.unlockButton = (node as any).popper({
      content: () => {
        if (!this.renderer.cy) return
        let dimension = node.data('width') / 9 * this.renderer.cy.zoom()
        let div = document.createElement('div')
        div.style.background = node.style('border-color')
        div.style.borderRadius = '100%'
        div.style.padding = '5px'
        div.style.cursor = 'pointer'
        div.style.boxSizing = 'content-box'
        div.setAttribute('title', 'Unlock Node')

        div.innerHTML = `<span class="popper-icon">${lock_open}</span>`
        this.setPopperStyle(dimension, div)

        div.onclick = () => this.unpinNode(node)
        this.popperContainer?.appendChild(div)

        return div
      },
    })

    node.on('position', () => this.updatePopper(node))
    this.renderer.cy.on('pan zoom resize', () => this.updatePopper(node))
  }

  unpinAll() {
    this.renderer.cy?.$('[?pinned]').each(node => this.unpinNode(node))
  }

  private setPopperStyle(dim, popper) {
    let icon = popper.querySelector('.popper-icon > svg')
    icon.style.display = 'inherit'
    icon.style.color = 'var(--gscape-color-fg-on-emphasis)'
    if (dim > 2) {
      popper.style.width = dim + 'px'
      popper.style.height = dim + 'px'
      popper.style.display = 'flex'
      if (dim > 8) {
        icon.setAttribute('width', dim + 'px')
        icon.setAttribute('height', dim + 'px')
      } else if (dim - 10 > 0) {
        icon.setAttribute('width', (dim - 10) + 'px')
        icon.setAttribute('height', (dim - 10) + 'px')
      } else {
        icon.style.display = 'none'
      }
    } else {
      icon.style.display = 'none'
      popper.style.display = 'none'
    }
  }

  private updatePopper(node) {
    if (!node.unlockButton || !this.renderer.cy) return

    let unlockButton = node.unlockButton
    let dimension = node.data('width') / 9 * this.renderer.cy.zoom()
    this.setPopperStyle(dimension, unlockButton.state.elements.popper)
    unlockButton.update()
  }

  unpinNode(nodeOrId: string | NodeSingular) {
    if (!nodeOrId || !this.renderer.cy) return

    let node: NodeSingular
    if (typeof (nodeOrId) === 'string') {
      node = this.renderer.cy.$id(nodeOrId)
    } else {
      node = nodeOrId
    }

    this.removeUnlockButton(node)
    node.unlock()
    node.data("pinned", false)
  }

  private removeUnlockButton(node) {
    if (node.unlockButton) {
      node.unlockButton.state.elements.popper.remove()
      node.unlockButton.destroy()
      node.unlockButton = null
    }
  }

  protected setDragAndPinEventHandlers() {
    this.renderer.cy?.on('grab', this.grabHandler)

    this.renderer.cy?.on('free', this.freeHandler)

    // this.renderer.cy.$('[?pinned]').each(n => {
    //   //n.on('position', () => this.updatePopper(n))
    //   this.renderer.cy.on('pan zoom resize', () => this.updatePopper(n))
    // })
  }

  private grabHandler = (e: cytoscape.EventObject) => {
    if (this.dragAndPin)
      e.target.data('old_pos', JSON.stringify(e.target.position()))
  }

  private freeHandler = (e: cytoscape.EventObject) => {
    if (this.dragAndPin) {
      let current_pos = JSON.stringify(e.target.position())
      if (e.target.data('old_pos') !== current_pos) {
        this.pinNode(e.target)
      }

      e.target.removeData('old_pos')
    }
  }

  protected defaultLayoutOptions = {
    name: 'cola',
    avoidOverlap: false,
    edgeLength: function (edge) {
      let crowdnessFactor =
        edge.target().neighborhood(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`).length +
        edge.source().neighborhood(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`).length

      crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 10 : 0
      if (edge.hasClass('role')) {
        return 250 + edge.data('displayedName').length * 4 + crowdnessFactor
      }
      else if (edge.target().data('type') == GrapholTypesEnum.DATA_PROPERTY ||
        edge.source().data('type') == GrapholTypesEnum.DATA_PROPERTY)
        return 150
      else {
        return 200 + crowdnessFactor
      }
    },
    fit: true,
    maxSimulationTime: 4000,
    infinite: false,
    handleDisconnected: true, // if true, avoids disconnected components from overlapping
    centerGraph: false,
  }

  centerOnElementById(elementId: string, zoom?: number, select?: boolean): void {
    const cy = this.renderer.cy
    if (!cy || (!zoom && zoom !== 0)) return
    
    const cyElement = cy.$id(elementId).first()
    zoom = zoom > cy.maxZoom() ? cy.maxZoom() : zoom
    if (cyElement.empty()) {
      console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`)
    } else {
      const previousFitValue = this.defaultLayoutOptions.fit

      if (this.layoutRunning) {

        // run layout not fitting it, avoid conflict with fitting view on element
        this.floatyLayoutOptions.fit = false
        this.runLayout()
        // keep element centered while layout runs
        cyElement.isNode() ? cyElement.lock() : cyElement.connectedNodes().lock()

        if (this.isLayoutInfinite) {
          // if layout is infinite, do not wait for it to stop
          // just wait 5 seconds and restore previous conditions
          setTimeout(() => {
            cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock()
            if (this.floatyLayoutOptions.fit !== previousFitValue && this.layoutRunning) {
              this.floatyLayoutOptions.fit = previousFitValue
              this.runLayout()
            }
          }, 5000)
        } else {
          // if layout is finite, wait for it to stop and restore previous conditions
          this.layout.one('layoutstop', (layoutEvent) => {
            if (layoutEvent.layout === this.layout) {
              cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock()
              this.floatyLayoutOptions.fit = previousFitValue
            } else {
              this.centerOnElementById(elementId, zoom, select)
            }
          })
        }
      }

      cy.animate({
        center: {
          eles: cyElement
        },
        zoom: zoom,
        queue: false,
      })

      if (select && cy.$(':selected') !== cyElement) {
        this.renderer.unselect()
        cyElement.select()
      }
    }
  }

  get floatyLayoutOptions() {
    return this.renderer.renderStateData[this.id].layoutOptions
  }

  set floatyLayoutOptions(newOptions) {
    this.renderer.renderStateData[this.id].layoutOptions = newOptions
  }

  protected automoveOptions = {
    nodesMatching: (node: NodeSingular) => this.renderer.cy?.$(':grabbed').neighborhood(`[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).has(node),
    reposition: 'drag',
    dragWith: `[type ="${GrapholTypesEnum.CLASS}"][iri]`
  }

  get isLayoutInfinite() {
    return this.floatyLayoutOptions.infinite ? true : false
  }

  get dragAndPin() { return this.renderer.renderStateData[this.id].dragAndPing }

  set dragAndPin(isActive: boolean) {
    this.renderer.renderStateData[this.id].dragAndPing = isActive

    if (!isActive) this.unpinAll()
  }

  protected get popperContainer() {
    if (this.renderer.diagram)
      return this.popperContainers.get(this.renderer.diagram.id)
  }

  protected get popperContainers(): Map<number, HTMLDivElement> {
    return this.renderer.renderStateData[this.id].popperContainers
  }

  get layout() {
    return this._layout
  }
}