import cytoscapeDefaultConfig from "../../../config/cytoscape-default-config"
import { BaseRenderer, iFilterManager, RenderStatesEnum } from "../../../model"
import GrapholFilterManager from "./filter-manager"

export default class GrapholRendererState extends BaseRenderer {
  id: RenderStatesEnum = RenderStatesEnum.GRAPHOL
  cyConfig: cytoscape.CytoscapeOptions = cytoscapeDefaultConfig
  filterManager: iFilterManager = new GrapholFilterManager()

  render(): void {
    const grapholRepresentation = this.renderer.diagram.representations.get(this.id)
    this.renderer.cy = grapholRepresentation.cy
    
    this.renderer.mount()
    if (!grapholRepresentation.hasEverBeenRendered) {
      this.renderer.fit()
    }
  }

  layoutRun(): void {
    throw new Error("Method not implemented.")
  }
  layoutStop(): void {
    throw new Error("Method not implemented.")
  }
}