import { Grapholscape } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { LifecycleEvent, RendererStatesEnum } from "../model";
import { createEntitiesList, IBaseMixin } from "../ui";
import initEntitySelector, { GscapeEntitySelector } from "../ui/entity-selector";
import { GscapeExplorer } from "../ui/ontology-explorer";
import { WidgetEnum } from "../ui/util/widget-enum";
import IncrementalController from "./controller";
import { IncrementalEvent } from "./lifecycle";
import * as IncrementalUI from './ui';

export { IncrementalController };

/** @internal */
export function initIncremental(grapholscape: Grapholscape) {

  let incrementalController: IncrementalController = new IncrementalController(grapholscape)
  grapholscape.incremental = incrementalController
  // Create and initialize UI components
  IncrementalUI.ClassInstanceDetailsFactory(incrementalController)
  IncrementalUI.VKGPreferencesFactory(incrementalController)
  IncrementalUI.InstanceExplorerFactory(incrementalController)
  IncrementalUI.CommandsWidgetFactory(incrementalController)
  IncrementalUI.NodeButtonsFactory(incrementalController)
  IncrementalUI.NavigationMenuFactory(incrementalController)

  if (!incrementalController.grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR)) {
    initEntitySelector(incrementalController.grapholscape)
    const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
    incrementalController.grapholscape.uiContainer?.appendChild(entitySelector)
    entitySelector.hide()

    entitySelector.onClassSelection(classIri => {
      incrementalController.addEntity(classIri)
      grapholscape.selectElement(classIri)
      IncrementalUI.moveUpLeft(entitySelector)
      entitySelector.closePanel()
    })
  }

  if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    onIncrementalStartup(grapholscape, incrementalController)
  } else {
    manageWidgetsOnDeactivation(grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>)
  }

  // CORE's lifecycle reactions 
  grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {

    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      onIncrementalStartup(grapholscape, incrementalController)
    } else {
      manageWidgetsOnDeactivation(grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>)
    }
  })

  incrementalController.on(IncrementalEvent.DiagramUpdated, () => {
    const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as GscapeEntitySelector | undefined
    if (grapholscape.renderer.cy?.elements().empty()) {
      (grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as unknown as IBaseMixin)?.hide();

      if (entitySelector) {
        IncrementalUI.restorePosition(entitySelector)
        entitySelector.focusInputSearch()
      }
    } else {
      if (entitySelector) {
        IncrementalUI.moveUpLeft(entitySelector)
      }
    }


    const ontologyExplorer = grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER) as GscapeExplorer | undefined
    if (ontologyExplorer) {
      ontologyExplorer.entities = createEntitiesList(grapholscape, ontologyExplorer.searchEntityComponent)
    }
  })

  incrementalController.on(IncrementalEvent.Reset, () => {
    if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      manageWidgetsOnActivation(
        grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
        grapholscape.renderer.cy?.elements().empty(),
        incrementalController.endpointController !== undefined
      )
    }
  })
}

function onIncrementalStartup(grapholscape: Grapholscape, incrementalController: IncrementalController) {
  grapholscape.renderer.unselect()

  if (!incrementalController) {
    incrementalController = new IncrementalController(grapholscape)
  }

  manageWidgetsOnActivation(
    grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
    grapholscape.renderer.cy?.elements().empty(),
    incrementalController.endpointController !== undefined
  )

  if (grapholscape.renderer.diagram)
    setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)

  incrementalController.setIncrementalEventHandlers()
}

function manageWidgetsOnActivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>, isCanvasEmpty = false, isReasonerAvailable?: boolean) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const entitySelector = widgets.get(WidgetEnum.ENTITY_SELECTOR)
  const classInstanceDetails = widgets.get(WidgetEnum.CLASS_INSTANCE_DETAILS)
  const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES)

  classInstanceDetails?.enable()
  diagramSelector?.disable()

  if (isCanvasEmpty && entitySelector) {
    entitySelector.show()
    IncrementalUI.restorePosition(entitySelector);
    (entitySelector as GscapeEntitySelector).focusInputSearch()
  }

  if (isReasonerAvailable)
    vkgPreferences?.enable()

  filtersWidget?.disable()
}

function manageWidgetsOnDeactivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const entitySelector = widgets.get(WidgetEnum.ENTITY_SELECTOR)
  const classInstanceDetails = widgets.get(WidgetEnum.CLASS_INSTANCE_DETAILS)
  const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES)

  classInstanceDetails?.disable()
  vkgPreferences?.disable()
  diagramSelector?.enable()
  entitySelector?.hide()
  filtersWidget?.enable()
}