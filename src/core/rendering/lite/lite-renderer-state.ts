import { CytoscapeOptions } from "cytoscape";
import cytoscapeDefaultConfig from "../../../config/cytoscape-default-config";
import { Ontology, iFilterManager, BaseRenderer, RendererStatesEnum, GrapholscapeTheme } from "../../../model";
import LiteFilterManager from "./filter-manager";
import liteStyle from "./lite-style";
import LiteTransformer from "./lite-transformer";
import Grapholscape from "../../grapholscape";

export default class LiteRendererState extends BaseRenderer {
  readonly id: RendererStatesEnum = RendererStatesEnum.GRAPHOL_LITE
  filterManager: iFilterManager = new LiteFilterManager()
  cyConfig: CytoscapeOptions = cytoscapeDefaultConfig
  private _layout: cytoscape.Layouts

  runLayout(): void {
    if (!this.renderer.cy) return
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
    if (!this.renderer.diagram) return

    let liteRepresentation = this.renderer.diagram.representations.get(this.id)

    if (!liteRepresentation) return

    this.renderer.cy = liteRepresentation.cy
    this.renderer.mount()

    if (!liteRepresentation.hasEverBeenRendered) {
      this.renderer.fit()
      this.runLayout()
    }

    if (this.renderer.diagram.lastViewportState) {
      this.renderer.cy?.viewport(this.renderer.diagram.lastViewportState)
    }

    liteRepresentation.hasEverBeenRendered = true
  }

  stopRendering(): void {
    if (this.renderer.viewportState && this.renderer.diagram) {
      this.renderer.diagram.lastViewportState = this.renderer.viewportState
    }
  }

  stopLayout(): void { }

  getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[] {
    return liteStyle(theme)
  }

  transformOntology(ontology: Ontology): void {
    ontology.diagrams.forEach(diagram => {
      const liteTransformer = new LiteTransformer()
      diagram.representations.set(this.id, liteTransformer.transform(diagram))
    })
  }

  postOntologyTransform(grapholscape: Grapholscape): void { }

  get layout() { return this._layout }
  set layout(newLayout) { this._layout = newLayout }
}