import { Grapholscape } from "../core";
import IncrementalRendererState from "../core/rendering/incremental/incremental-render-state";
import { WidgetEnum } from "../ui/util/widget-enum";
import { GscapeDiagramSelector } from "../ui/diagram-selector";
import { GscapeEntityDetails } from "../ui/entity-details";
import initIncrementalMenu from "../ui/incremental-menu";
import GscapeIncrementalDetails from "../ui/incremental-menu/incremental-menu";
import { GscapeRenderSelector } from "../ui/renderer-selector";
import IncrementalController from "./controller";
import { GscapeEntitySelector } from "../ui/entity-selector";

export { IncrementalController }

export function startIncremental(grapholscape: Grapholscape) {

  grapholscape.renderer.unselect()

  const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  if (!grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU)) {
    initIncrementalMenu(grapholscape)
  }

  const incrementalController = new IncrementalController(
    grapholscape,
    grapholscape.renderer.renderState as IncrementalRendererState,
    grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails,
    entitySelector
  )
  incrementalController.init();

  (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as GscapeDiagramSelector).hide()
  const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
  entityDetailsWidget.incrementalSection = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails
  entityDetailsWidget.hide()

  if (grapholscape.renderer.grapholElements?.size === 0) {
    entitySelector.show()
  }

  const rendererSelector = grapholscape.widgets.get(WidgetEnum.RENDERER_SELECTOR) as GscapeRenderSelector
  rendererSelector.onIncrementalReset = () => {
    incrementalController.reset()
  }

}