import { Stylesheet } from "cytoscape"
import cytoscapeDefaultConfig from "../../../config/cytoscape-default-config"
import Ontology, { BaseRenderer, iFilterManager, RenderStatesEnum, GrapholscapeTheme } from "../../../model"
import GrapholFilterManager from "./filter-manager"
import grapholStyle from "./graphol-style"

export default class GrapholRendererState extends BaseRenderer {
  layout: cytoscape.Layouts
  id: RenderStatesEnum = RenderStatesEnum.GRAPHOL
  cyConfig: cytoscape.CytoscapeOptions = cytoscapeDefaultConfig
  filterManager: iFilterManager = new GrapholFilterManager()

  render(): void {
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