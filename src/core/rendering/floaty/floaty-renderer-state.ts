import cytoscape, { NodeSingular, SingularElementReturnValue, StylesheetJson } from "cytoscape";
import automove from 'cytoscape-automove';
import { Renderer } from "..";
import { BaseRenderer, GrapholscapeTheme, iFilterManager, Ontology, RendererStatesEnum, TypesEnum } from "../../../model";
import FloatyFilterManager from "./filter-manager";
import floatyStyle from "./floaty-style";
import FloatyTransformer from "./floaty-transformer";
import computeHierarchies from "../../compute-hierarchies";
import { DiagramColorManager } from "../../colors-manager";
import Grapholscape from "../../grapholscape";
import * as Layouts from "../layouts";
import { GscapeLayout } from "../../../model/renderers/layout";

cytoscape.use(automove)

const lock_open = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>'


export default class FloatyRendererState extends BaseRenderer {
  readonly id: RendererStatesEnum = RendererStatesEnum.FLOATY
  filterManager: iFilterManager = new FloatyFilterManager()
  availableLayouts: GscapeLayout[]
  protected _layout: cytoscape.Layouts
  protected _gscapeLayout: GscapeLayout
  private centeringOnElem = false
  protected edgeLength = (edge: SingularElementReturnValue, crowdness: boolean, edgeLengthFactor: number) => {
    if (crowdness) {
      let crowdnessFactor = edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length
        + edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length

      crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 10 : 0
      if (edge.hasClass('role')) {
        return (5 * edgeLengthFactor) + edge.data('displayedName').length * 4 + crowdnessFactor
      } else if (edge.target().data('type') == TypesEnum.DATA_PROPERTY
        || edge.source().data('type') == TypesEnum.DATA_PROPERTY) {
        return 3 * edgeLengthFactor
      } else {
        return (4 * edgeLengthFactor) + crowdnessFactor
      }
    } else {
      return edgeLengthFactor * 2.5
    }
  }

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
      newRenderer.renderStateData[this.id].popperContainers = new Map<number, HTMLDivElement>()
      // this.floatyLayoutOptions = this.defaultLayoutOptions
    }
  }

  get renderer() { return super.renderer }

  set gscapeLayout(layout: GscapeLayout) {
    layout.customEdgeLength = this.edgeLength
    this._gscapeLayout = layout
  }
  get gscapeLayout() { return this._gscapeLayout }

  constructor() {
    super()
    this.availableLayouts = [
      new Layouts.ColaLayout(),
      new Layouts.ClustersLayout(),
      new Layouts.FcoseLayout(),
      new Layouts.GridLayout(),
      new Layouts.DagreLayout(),
    ]

    this.gscapeLayout = this.availableLayouts[0]
  }

  transformOntology(ontology: Ontology): void {
    ontology.diagrams.forEach(diagram => {
      const floatyTransformer = new FloatyTransformer()
      diagram.representations.set(this.id, floatyTransformer.transform(diagram))
    })
    computeHierarchies(ontology)
  }

  postOntologyTransform(grapholscape: Grapholscape) {
    FloatyTransformer.addAnnotationPropertyEdges(grapholscape)
  }

  runLayout(customOptions?: any): Promise<void> {
    return new Promise((resolve) => {
      if (!this.renderer.cy) {
        resolve()
        return
      }
      this.stopLayout()
      this._layout = this.renderer.cy.elements().layout(customOptions || this.gscapeLayout.getCyOptions(this.renderer.cy.elements()))
      this._layout.one('layoutstop', (e) => {
        if (e.layout === this._layout) { // only if layout has not changed
          this.layoutRunning = false
          resolve()
        }
      })
      this._layout.run()
      this.layoutRunning = true
    })
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

    new DiagramColorManager(
      this.renderer.diagram.representations.get(this.id)!
    ).colorDiagram()

    if (!floatyRepresentation.hasEverBeenRendered) {
      // this.floatyLayoutOptions.fit = true
      this.renderer.fit()
      const areAllNodesOnCenter = this.renderer.diagram.representations.get(RendererStatesEnum.GRAPHOL)?.isEmpty()
      const previousLayoutOptions = this.gscapeLayout.highLevelSettings
      if (areAllNodesOnCenter) {
        this.gscapeLayout.randomize = true
        // this.floatyLayoutOptions = {
        //   ...this.floatyLayoutOptions,
        //   centerGraph: true,
        //   randomize: true,
        // }
      }
      this.runLayout()
      if (areAllNodesOnCenter) {
        this.gscapeLayout.highLevelSettings = previousLayoutOptions
      }
      this.popperContainers.set(this.renderer.diagram.id, document.createElement('div'))
      this.setDragAndPinEventHandlers();

      (this.renderer.cy as any).automove(this.automoveOptions)
    }

    if (floatyRepresentation.lastViewportState) {
      this.renderer.cy?.viewport(floatyRepresentation.lastViewportState)
    }

    if (this.popperContainer)
      this.renderer.cy.container()?.appendChild(this.popperContainer)

    if (!this.dragAndPin)
      this.unpinAll()

    if (this.isLayoutInfinite) {
      this.gscapeLayout.fit = false
      this.runLayout()
    }

    floatyRepresentation.hasEverBeenRendered = true
  }

  stopRendering(): void {
    this._layout?.stop()
    if (this.renderer.diagram) {
      const floaty = this.renderer.diagram.representations.get(this.id)

      if (floaty) {
        floaty.lastViewportState = this.renderer.viewportState
      }
    }
  }

  getGraphStyle(theme: GrapholscapeTheme): StylesheetJson {
    return floatyStyle(theme)
  }

  stopLayout(): void {
    this._layout?.stop()
    this.layoutRunning = false
  }

  runLayoutInfinitely() {
    if (this.gscapeLayout.canBeInfinite) {
      this.gscapeLayout.infinite = true
      this.gscapeLayout.fit = false
    }

    return this.runLayout()
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

  randomizeLayout() {
    this.gscapeLayout.randomize = true
    const previouslyInfinite = this.gscapeLayout.infinite
    this.stopLayout()
    const promise = previouslyInfinite ? this.runLayoutInfinitely() : this.runLayout()
    this.gscapeLayout.randomize = false
    return promise
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
    let dimension = node.width() / 9 * this.renderer.cy.zoom()
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

  centerOnElementById(elementId: string, zoom?: number, select?: boolean): void {
    const cy = this.renderer.cy
    if (!cy || (!zoom && zoom !== 0)) return

    const cyElement = cy.$id(elementId).first()
    zoom = zoom > cy.maxZoom() ? cy.maxZoom() : zoom
    if (cyElement.empty()) {
      console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`)
    } else {
      const performAnimation = () => {
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

      if (this.layoutRunning) {
        if (!cyElement.data().pinned) {
          // keep element centered while layout runs
          cyElement.isNode() ? cyElement.lock() : cyElement.connectedNodes().lock()
        }

        performAnimation()
        if (this.isLayoutInfinite) {
          // run layout not fitting it, avoid conflict with fitting view on element
          this.gscapeLayout.infinite = false
          this.runLayout()
          this.layout.one('layoutstop', (layoutEvent) => {
            if (layoutEvent.layout === this.layout) {
              if (!cyElement.data().pinned) {
                cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock()
              }

              // wait for layout to stop and restore previous conditions
              this.runLayoutInfinitely()
            } else {
              this.centerOnElementById(elementId, zoom, select)
            }
          })
        } else {
          this.layout.one('layoutstop', (layoutEvent) => {
            if (layoutEvent.layout === this.layout) {
              if (!cyElement.data().pinned) {
                cyElement.isNode() ? cyElement.unlock() : cyElement.connectedNodes().unlock()
              }
            } else {
              this.centerOnElementById(elementId, zoom, select)
            }
          })
        }
      } else {
        performAnimation()
      }
    }
  }

  setFixedEdgeLength(numberOrFoo: number | ((elem: SingularElementReturnValue) => number)) {
    if (typeof numberOrFoo === 'number') {
      this.edgeLength = () => numberOrFoo
    } else {
      this.edgeLength = numberOrFoo
    }
  }

  // get floatyLayoutOptions() {
  //   return this.renderer.renderStateData[this.id].layoutOptions
  // }

  // set floatyLayoutOptions(newOptions) {
  //   this.renderer.renderStateData[this.id].layoutOptions = newOptions
  // }

  protected automoveOptions = {
    nodesMatching: (node: NodeSingular) => !this.layoutRunning &&
      this.renderer.cy?.$(':grabbed').neighborhood(`[type = "${TypesEnum.DATA_PROPERTY}"],[[degree = 1]]`).has(node),
    reposition: 'drag',
    dragWith: `[type ="${TypesEnum.CLASS}"][iri]`
  }

  get isLayoutInfinite() {
    return this.gscapeLayout.infinite
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