import { CytoscapeOptions } from "cytoscape";
import { floatyOptions } from "../../../config/cytoscape-default-config";
import { iFilterManager, BaseRenderer, RenderStatesEnum, GrapholscapeTheme, GrapholTypesEnum, DiagramRepresentation } from "../../../model";
import LiteFilterManager from "./filter-manager";
import liteStyle from "./floaty-style";
import FloatyTransformer from "./floaty-transformer";

export default class FloatyRenderState extends BaseRenderer {
  layout: cytoscape.Layouts;
  readonly id: RenderStatesEnum = RenderStatesEnum.FLOATY
  filterManager: iFilterManager = new LiteFilterManager()
  private _layout: cytoscape.Layouts

  layoutRun(): void {
    this._layout?.stop()
    this._layout = this.renderer.cy.elements().layout({
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
      handleDisconnected: true, // if true, avoids disconnected components from overlapping
      centerGraph: false,
    } as any)
    this._layout.run()
  }

  render(): void {
    let floatyRepresentation = this.renderer.diagram.representations.get(this.id)

    if (!floatyRepresentation) {
      const floatyTransformer = new FloatyTransformer()
      floatyRepresentation = floatyTransformer.transform(this.renderer.diagram)
      this.renderer.diagram.representations.set(this.id, floatyRepresentation)
    }

    this.renderer.cy = floatyRepresentation.cy
    this.renderer.mount()

    if (!floatyRepresentation.hasEverBeenRendered) {
      this.layoutRun()
    }

    floatyRepresentation.hasEverBeenRendered = true

    // const incrementalRepresentation = new DiagramRepresentation(floatyOptions)
    // this.renderer.diagram.representations.set('incremental', incrementalRepresentation)
    // this.renderer.cy = incrementalRepresentation.cy
    // this.renderer.mount()
  }

  layoutStop(): void {
    throw new Error("Method not implemented.");
  }

  getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[] {
    return liteStyle(theme)
  }
}