import { Grapholscape } from "../core";
import { GscapeDiagramSelector } from "../ui/diagram-selector";
import { GscapeEntityDetails } from "../ui/entity-details";
import initEntitySelector, { GscapeEntitySelector } from "../ui/entity-selector";
import initIncrementalMenu from "../ui/incremental-ui";
import GscapeIncrementalDetails from "../ui/incremental-ui/incremental-details";
import { WidgetEnum } from "../ui/util/widget-enum";
import IncrementalController from "./controller";

export { IncrementalController };

export function startIncremental(grapholscape: Grapholscape, incrementalController: IncrementalController) {

  grapholscape.renderer.unselect()

  if (!grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR)) {
    initEntitySelector(grapholscape)
  }
  const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector

  if (!grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU)) {
    initIncrementalMenu(grapholscape)
  }

  // const incrementalController = new IncrementalController(
  //   grapholscape,
  //   grapholscape.renderer.renderState as IncrementalRendererState,
  //   grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails,
  //   entitySelector
  // )
  incrementalController.init();

  (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as GscapeDiagramSelector).hide()
  const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
  entityDetailsWidget.incrementalSection = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails
  entityDetailsWidget.hide()

  if (grapholscape.renderer.grapholElements?.size === 0) {
    entitySelector.show()
  }

  // // TODO: when it will be available, remember to clear previous callbacks if startIncremental is called multiple times
  // grapholscape.on(LifecycleEvent.RendererChange, rendererState => {
  //   if (rendererState !== RendererStatesEnum.INCREMENTAL && grapholscape.mastroRequestOptions) {
  //     incrementalController.clearState()
  //   }
  // })

}