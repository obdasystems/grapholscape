import { Grapholscape } from "../core";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { Lifecycle, LifecycleEvent, RendererStatesEnum } from "../model";
import { BaseMixin, createEntitiesList, IBaseMixin } from "../ui";
import { GscapeDiagramSelector } from "../ui/diagram-selector";
import { GscapeEntityDetails } from "../ui/entity-details";
import initEntitySelector, { GscapeEntitySelector } from "../ui/entity-selector";
import { GscapeFilters } from "../ui/filters";
import initIncrementalMenu from "../ui/incremental-ui";
import GscapeIncrementalDetails from "../ui/incremental-ui/incremental-details";
import { GscapeExplorer } from "../ui/ontology-explorer";
import { WidgetEnum } from "../ui/util/widget-enum";
import IncrementalController from "./controller";
import { IncrementalEvent } from "./lifecycle";
import * as IncrementalUI from './ui'

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
    if (grapholscape.renderer.cy?.elements().empty()) {
      (grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as unknown as IBaseMixin)?.hide();

      const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as HTMLElement & IBaseMixin | undefined
      if (entitySelector) {
        entitySelector.show()
        IncrementalUI.restorePosition(entitySelector)
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
    // (incrementalController.grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector)?.show();
    // (incrementalController.grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails)?.hide();
  })

  // grapholscape.renderer.unselect()

  // if (!grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR)) {
  //   initEntitySelector(grapholscape)
  // }
  // const entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  // grapholscape.uiContainer?.appendChild(entitySelector)

  // if (!grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU)) {
  //   initIncrementalMenu(grapholscape)
  // }

  // const incrementalController = new IncrementalController(
  //   grapholscape,
  //   grapholscape.renderer.renderState as IncrementalRendererState,
  //   grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails,
  //   entitySelector
  // )
  // incrementalController.init();

  // (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as GscapeDiagramSelector).hide()
  // const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
  // entityDetailsWidget.incrementalSection = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalDetails
  // entityDetailsWidget.hide()

  // if (grapholscape.renderer.cy?.elements().empty()) {
  //   entitySelector.show()
  // }

  // // TODO: when it will be available, remember to clear previous callbacks if startIncremental is called multiple times
  // grapholscape.on(LifecycleEvent.RendererChange, rendererState => {
  //   if (rendererState !== RendererStatesEnum.INCREMENTAL && grapholscape.mastroRequestOptions) {
  //     incrementalController.clearState()
  //   }
  // })

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
    IncrementalUI.restorePosition(entitySelector)
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