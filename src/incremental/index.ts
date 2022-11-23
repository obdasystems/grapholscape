import { Grapholscape } from "../core";
import IncrementalRendererState from "../core/rendering/incremental/incremental-render-state";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { RendererStatesEnum } from "../model";
import { GscapeEntitySelector, WidgetEnum } from "../ui";
import { GscapeDiagramSelector } from "../ui/diagram-selector";
import GscapeIncrementalMenu from "../ui/incremental-menu/incremental-menu";
import IncrementalController from "./controller";

export { IncrementalController }

export function startIncremental(grapholscape: Grapholscape) {
  const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  const incrementalController = new IncrementalController(
    grapholscape,
    grapholscape.renderer.renderState as IncrementalRendererState,
    grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalMenu,
    entitySelector
  )
  incrementalController.init();

  (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as GscapeDiagramSelector).hide()

  if (grapholscape.renderer.grapholElements?.size === 0) {
    entitySelector.show()
  }
}

export function resetIncremental(grapholscape: Grapholscape) {
  if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    (grapholscape.renderer.renderState as IncrementalRendererState).createNewDiagram();
    (grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector).show()
    if (grapholscape.renderer.diagram)
      setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)
  }
}