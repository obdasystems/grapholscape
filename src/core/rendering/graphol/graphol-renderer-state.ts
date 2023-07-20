import { Stylesheet } from "cytoscape"
import { grapholOptions } from "../../../config"
import { Ontology, BaseRenderer, iFilterManager, RendererStatesEnum, GrapholscapeTheme } from "../../../model"
import GrapholFilterManager from "./filter-manager"
import grapholStyle from "./graphol-style"

export default class GrapholRendererState extends BaseRenderer {
  layout: cytoscape.Layouts
  id: RendererStatesEnum = RendererStatesEnum.GRAPHOL
  cyConfig: cytoscape.CytoscapeOptions = grapholOptions
  filterManager: iFilterManager = new GrapholFilterManager()

  render(): void {
    if (!this.renderer.diagram) return

    const grapholRepresentation = this.renderer.diagram.representations.get(this.id)
    if (!grapholRepresentation) return

    this.renderer.cy = grapholRepresentation.cy

    this.renderer.mount()
    if (!grapholRepresentation.hasEverBeenRendered) {
      this.renderer.fit()
    }

    if (this.renderer.diagram.lastViewportState) {
      this.renderer.cy?.viewport(this.renderer.diagram.lastViewportState)
    }

    grapholRepresentation.hasEverBeenRendered = true
  }

  stopRendering(): void {
    if (this.renderer.viewportState && this.renderer.diagram) {
      this.renderer.diagram.lastViewportState = this.renderer.viewportState
    }
  }

  runLayout(): void {
    throw new Error("Method not implemented.")
  }
  stopLayout(): void {
    throw new Error("Method not implemented.")
  }

  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[] {
    return grapholStyle(theme)
  }

  transformOntology(ontology: Ontology): void { }
}