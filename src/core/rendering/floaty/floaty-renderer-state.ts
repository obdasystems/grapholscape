import { AnimatedLayoutOptions, LayoutOptions } from "cytoscape";
import { BaseRenderer, GrapholscapeTheme, GrapholTypesEnum, iFilterManager, RenderStatesEnum } from "../../../model";
import LiteFilterManager from "./filter-manager";
import liteStyle from "./floaty-style";
import FloatyTransformer from "./floaty-transformer";

export default class FloatyRenderState extends BaseRenderer {
  layout: cytoscape.Layouts;
  readonly id: RenderStatesEnum = RenderStatesEnum.FLOATY
  filterManager: iFilterManager = new LiteFilterManager()
  private _layout: cytoscape.Layouts

  runLayout(): void {
    this.stopLayout()
    this._layout = this.renderer.cy.elements().layout(this.floatyLayoutOptions)
    this._layout.run()

    if (this.isLayoutInfinite) {
      setTimeout(() => this.renderer.fit(), 1000)
    }
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
      this.runLayout()
    }

    floatyRepresentation.hasEverBeenRendered = true

    // const incrementalRepresentation = new DiagramRepresentation(floatyOptions)
    // this.renderer.diagram.representations.set('incremental', incrementalRepresentation)
    // this.renderer.cy = incrementalRepresentation.cy
    // this.renderer.mount()
  }

  getGraphStyle(theme: GrapholscapeTheme): cytoscape.Stylesheet[] {
    return liteStyle(theme)
  }

  stopLayout(): void {
    this._layout?.stop()
  }

  runLayoutInfinitely() {
    this.floatyLayoutOptions.infinite = true
    this.floatyLayoutOptions.fit = false
    this.runLayout()
  }

  private floatyLayoutOptions = {
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
    infinite: false,
    handleDisconnected: true, // if true, avoids disconnected components from overlapping
    centerGraph: false,
  }

  get isLayoutInfinite() {
    return this.floatyLayoutOptions.infinite ? true : false
  }
}