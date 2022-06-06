import { CytoscapeOptions } from "cytoscape";
import cytoscapeDefaultConfig from "../../../config/cytoscape-default-config";
import { iFilterManager, BaseRenderer, RenderStatesEnum, GrapholscapeTheme } from "../../../model";
import LiteFilterManager from "./filter-manager";
import liteStyle from "./lite-style";
import LiteTransformer from "./lite-transformer";

export default class LiteRendererState extends BaseRenderer {
  readonly id: RenderStatesEnum = RenderStatesEnum.GRAPHOL_LITE
  filterManager: iFilterManager = new LiteFilterManager()
  cyConfig: CytoscapeOptions = cytoscapeDefaultConfig
  private _layout: cytoscape.Layouts

  runLayout(): void {
    this._layout?.stop()
    this.renderer.cy.nodes().lock()
    this._layout = this.renderer.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
      name: 'cola',
      centerGraph: false,
      refresh: 3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001,
      fit: false,
    } as any)
    this.renderer.cy.$('.repositioned').unlock()
    this._layout.run()
  }

  render(): void {
    let liteRepresentation = this.renderer.diagram.representations.get(this.id)

    if (!liteRepresentation) {
      const liteTransformer = new LiteTransformer()
      liteRepresentation = liteTransformer.transform(this.renderer.diagram)
      this.renderer.diagram.representations.set(this.id, liteRepresentation)
    }

    this.renderer.cy = liteRepresentation.cy
    this.renderer.mount()

    if (!liteRepresentation.hasEverBeenRendered) {
      this.renderer.fit()
      this.runLayout()
    }

    liteRepresentation.hasEverBeenRendered = true
  }

  stopLayout(): void {}

  getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[] {
    return liteStyle(theme)
  }

  get layout() { return this._layout }
  set layout(newLayout) { this._layout = newLayout }
}