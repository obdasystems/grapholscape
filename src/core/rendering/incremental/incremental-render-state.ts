import { EventObject, Stylesheet } from "cytoscape"
import { floatyOptions } from "../../../config"
import { Diagram, DiagramRepresentation, GrapholscapeTheme, Ontology, RendererStatesEnum, iFilterManager } from "../../../model"
import IncrementalDiagram from "../../../model/diagrams/incremental-diagram"
import FloatyRendererState from "../floaty/floaty-renderer-state"
import FloatyTransformer from "../floaty/floaty-transformer"
import Renderer from "../renderer"
import computeHierarchies from "./compute-hierarchies"
import IncrementalFilterManager from "./filter-manager"
import incrementalStyle from "./incremental-style"

/**
 * The incremental renderer state is a kind of floaty renderer state in which
 * ontology's diagrams are used only to compute what to show.
 * There is only a single empty diagram and any render() call just render the same diagram
 * no matter what was the input diagram.
 * 
 * This renderer state is logic agnostic, meaning that it does not control what to show and when.
 * You can decide what to show/hide outside, based on lifecycle and/or other custom developed widgets.
 */
export default class IncrementalRendererState extends FloatyRendererState {
  readonly id = RendererStatesEnum.INCREMENTAL
  filterManager: iFilterManager = new IncrementalFilterManager()

  private previousDiagram: Diagram

  onContextClickCallback: (event: EventObject) => void

  render() {
    this.overrideDiagram()

    if (this.popperContainer) {
      this.renderer.cy?.container()?.appendChild(this.popperContainer)
    }
  }

  runLayout() {
    super.runLayout()
    if (this.isLayoutInfinite) {
      this.unFreezeGraph()
    } else {
      this.layout.one('layoutstop', () => {
        if (this.diagramRepresentation?.grapholElements.size === 1)
          this.renderer.fit()
          
        this.unFreezeGraph()
      })
    }
  }

  /** lock all nodes */
  freezeGraph() {
    this.renderer.cy?.nodes().lock()
  }

  /** unlock all nodes that are not pinned (pinned can be unlocked only with unpin) */
  unFreezeGraph() {
    this.renderer.cy?.$("[!pinned]:locked").unlock()
  }

  stopRendering(): void {
    super.stopRendering()
    this.renderer.diagram = this.previousDiagram
  }

  transformOntology(ontology: Ontology): void {
    // Perform floaty transformation if it has not been done yet
    if (!ontology.diagrams[0].representations.get(RendererStatesEnum.FLOATY)) {
      ontology.diagrams.forEach(diagram => {
        const floatyTransformer = new FloatyTransformer()
        diagram.representations.set(RendererStatesEnum.FLOATY, floatyTransformer.transform(diagram))
      })

      computeHierarchies(ontology)
    }
  }

  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return incrementalStyle(theme)
  }

  protected overrideDiagram() {
    if (this.renderer.diagram && this.renderer.diagram?.id !== this.incrementalDiagram.id) {
      this.previousDiagram = this.renderer.diagram
    }

    this.renderer.stopRendering()

    this.renderer.diagram = this.incrementalDiagram
    this.renderer.cy = this.diagramRepresentation?.cy
    this.renderer.mount()
  }

  createNewDiagram() {
    this.unpinAll()
    if (!this.incrementalDiagram)
      this.renderer.renderStateData[this.id].diagram = new IncrementalDiagram()
    else {
      this.incrementalDiagram.representation?.cy.destroy()
      this.incrementalDiagram.representations.set(this.id, new DiagramRepresentation(floatyOptions))
    }
    this.overrideDiagram()

    this.diagramRepresentation?.cy.on('cxttap', `node,edge`, evt => {
      this.onContextClickCallback(evt)
    })

    if (this.renderer.diagram?.id)
      this.popperContainers.set(this.renderer.diagram?.id, document.createElement('div'))
    this.setDragAndPinEventHandlers()
    this.render()
  }

  onContextClick(callback: (event: EventObject) => void) {
    this.onContextClickCallback = callback
  }

  removeElement(elementId: string) {
    const element = this.renderer.cy?.$id(elementId)
    if (element?.nonempty() && element?.data().pinned) {
      this.unpinNode(element)
    }
    this.incrementalDiagram.removeElement(elementId)
  }

  get diagramRepresentation() {
    return this.incrementalDiagram.representations.get(this.id)
  }

  get incrementalDiagram(): IncrementalDiagram { return this.renderer.renderStateData[this.id].diagram }

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
    }

    this.floatyLayoutOptions.fit = false
    this.floatyLayoutOptions.maxSimulationTime = 1000

    if (!newRenderer.renderStateData[this.id].diagram)
      this.createNewDiagram()
  }

  get renderer(): Renderer {
    return super.renderer
  }

}