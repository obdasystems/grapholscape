import { CytoscapeOptions } from "cytoscape";
import cytoscapeDefaultConfig from "../../../config/cytoscape-default-config";
import { iFilterManager, BaseRenderer, RenderStatesEnum } from "../../../model";
import LiteFilterManager from "./filter-manager";
import LiteTransformer from "./lite-transformer";

export default class LiteRendererState extends BaseRenderer {
  readonly id: RenderStatesEnum = RenderStatesEnum.FLOATY
  filterManager: iFilterManager = new LiteFilterManager()
  cyConfig: CytoscapeOptions = cytoscapeDefaultConfig

  layoutRun(): void {
    let layout = this.renderer.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
      name: 'cola',
      randomize:false,
      fit: false,
      refresh:3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001
    } as any)
    layout.run()
  }

  render(): void {
    let liteRepresentation = this.renderer.diagram.representations.get('lite')

    if (!liteRepresentation || !liteRepresentation.hasEverBeenRendered) {
      const liteTransformer = new LiteTransformer()
      liteRepresentation = liteTransformer.transform(this.renderer.diagram)
      this.renderer.diagram.representations.set('lite', liteRepresentation)
      this.renderer.cy = liteRepresentation.cy
      this.renderer.applyTheme()
      this.renderer.mount() // mount before fitting (dimensions 0!)
      //this.renderer.fit()
    } else {
      this.renderer.mount()
    }

    liteRepresentation.hasEverBeenRendered = true
  }

  layoutStop(): void {
    throw new Error("Method not implemented.");
  }
}