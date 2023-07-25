import { EdgeSingular, Stylesheet } from "cytoscape"
import { Diagram, GrapholscapeTheme, iFilterManager, Ontology, RendererStatesEnum, TypesEnum } from "../../../model"
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

  render() {
    if (this.renderer.diagram && this.renderer.diagram?.id !== IncrementalDiagram.ID) {
      this.previousDiagram = this.renderer.diagram
    }

    if (!this.renderer.diagram) return

    const incrementalRepresentation = this.renderer.diagram.representations.get(this.id)
    if (!incrementalRepresentation) return

    this.renderer.cy = incrementalRepresentation.cy
    this.renderer.mount()

    if (this.renderer.diagram.lastViewportState) {
      this.renderer.cy?.viewport(this.renderer.diagram.lastViewportState)
    }

    if (!incrementalRepresentation.hasEverBeenRendered) {
      if (this.popperContainer) {
        this.renderer.cy?.container()?.appendChild(this.popperContainer)
      }
    }

    incrementalRepresentation.hasEverBeenRendered = true
  }

  runLayout() {
    super.runLayout()
    if (this.isLayoutInfinite) {
      this.unFreezeGraph()
    } else {
      this.layout.one('layoutstop', (e) => {
        if (this.renderer.diagram?.representations.get(this.id)?.grapholElements.size === 1)
          this.renderer.fit()

        if (e.layout === this._layout)
          this.unFreezeGraph()
      })
    }
  }

  /** lock all nodes */
  freezeGraph() {
    if (!this.layoutRunning)
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
    if (!ontology.diagrams[0]?.representations.get(RendererStatesEnum.FLOATY)) {
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

  reset() {
    if (this.renderer.diagram?.id) {
      this.popperContainers.get(this.renderer.diagram.id)?.childNodes.forEach(c => c.remove())
    }
    this.render()
  }

  set renderer(newRenderer: Renderer) {
    super.renderer = newRenderer
    if (!newRenderer.renderStateData[this.id]) {
      newRenderer.renderStateData[this.id] = {}
    }

    this.floatyLayoutOptions = this.defaultLayoutOptions
    this.floatyLayoutOptions.fit = false
    this.floatyLayoutOptions.maxSimulationTime = 1000
    this.floatyLayoutOptions.edgeLength = function (edge: EdgeSingular) {
      let crowdnessFactor =
        edge.target().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length +
        edge.source().neighborhood(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`).length

      crowdnessFactor = crowdnessFactor > 5 ? crowdnessFactor * 2 : 0
      const nameLength = edge.data('displayedName')?.length * 5 || 0
      return 140 + crowdnessFactor + nameLength
    }
  }

  get renderer(): Renderer {
    return super.renderer
  }

}