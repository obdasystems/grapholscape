import { Grapholscape } from "../core";
import { ClassInstanceEntity, Filter, LifecycleEvent, RendererStatesEnum } from "../model";
import { createEntitiesList, IBaseMixin, IncrementalInitialMenu, showMessage } from "../ui";
import { setColorList } from "../ui/entity-colors";
import GscapeEntityColorLegend from "../ui/entity-colors/entity-color-legend";
import { GscapeEntityDetails } from "../ui/entity-details";
import { GscapeEntitySelector } from "../ui/entity-selector";
import { GscapeExplorer } from "../ui/ontology-explorer";
import { ShortestPathDialog } from "../ui";
import { WidgetEnum } from "../ui/util/widget-enum";
import IncrementalController from "./controller";
import { IncrementalEvent } from "./lifecycle";
import * as IncrementalUI from './ui';

export { IncrementalController };
export * from './lifecycle'

/** @internal */
export function initIncremental(grapholscape: Grapholscape) {

  let incrementalController: IncrementalController = new IncrementalController(grapholscape)
  grapholscape.incremental = incrementalController
  // Create and initialize UI components
  IncrementalUI.ClassInstanceDetailsFactory(incrementalController)
  // IncrementalUI.VKGPreferencesFactory(incrementalController)
  IncrementalUI.InstanceExplorerFactory(incrementalController)
  IncrementalUI.CommandsWidgetFactory(incrementalController)
  IncrementalUI.NodeButtonsFactory(incrementalController)
  IncrementalUI.NavigationMenuFactory(incrementalController)

  let initialMenu = incrementalController
    .grapholscape
    .widgets
    .get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as IncrementalInitialMenu

  if (!initialMenu) {
    // initEntitySelector(incrementalController.grapholscape)
    initialMenu = new IncrementalInitialMenu(grapholscape)
    incrementalController.grapholscape.widgets.set(WidgetEnum.INCREMENTAL_INITIAL_MENU, initialMenu)
  }

  initialMenu.shortestPathEnabled = incrementalController.endpointController?.isReasonerAvailable() === true

  // entitySelector = grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as GscapeEntitySelector
  incrementalController.grapholscape.uiContainer?.appendChild(initialMenu)
  // entitySelector.hide()

  initialMenu.addEventListener('class-selection', (e: CustomEvent) => {
    incrementalController.addClass(e.detail, true)
    grapholscape.selectElement(e.detail)
    IncrementalUI.moveUpLeft(initialMenu)
    initialMenu.closePanel()
  })

  initialMenu.addEventListener('shortest-path-click', async (e: CustomEvent) => {

    const shortestPathDialog = new ShortestPathDialog(grapholscape)

    grapholscape.uiContainer?.appendChild(shortestPathDialog)
    shortestPathDialog.show()

    shortestPathDialog.onConfirm(async (sourceClassIri: string, targetClassIri: string) => {
      const path = await incrementalController.endpointController?.highlightsManager?.getShortestPath(
        sourceClassIri,
        targetClassIri
      )

      if (path && path[0].entities) {
        incrementalController.addPath(path[0].entities)
        IncrementalUI.moveUpLeft(initialMenu)
        initialMenu.closePanel()
      } else {
        showMessage('Can\'t find shortest path between selected classes', 'Info', grapholscape.uiContainer)
      }
    })
  })

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
    const initialMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as unknown as GscapeEntitySelector | undefined
    if (grapholscape.renderer.cy?.elements().empty()) {
      onEmptyDiagram(grapholscape)
    } else {
      if (initialMenu) {
        IncrementalUI.moveUpLeft(initialMenu)
      }

      const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend | undefined
      if (entityColorLegend) {
        setColorList(entityColorLegend, grapholscape)
        entityColorLegend.enable()
      }
    }


    const ontologyExplorer = grapholscape.widgets.get(WidgetEnum.ONTOLOGY_EXPLORER) as GscapeExplorer | undefined
    if (ontologyExplorer) {
      ontologyExplorer.entities = createEntitiesList(grapholscape, ontologyExplorer.searchEntityComponent)
        .filter(e => e.viewOccurrences && e.viewOccurrences.size > 0)
    }
  })

  incrementalController.on(IncrementalEvent.Reset, () => {
    if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      manageWidgetsOnActivation(
        grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
        true,
        incrementalController.endpointController !== undefined
      )
      onEmptyDiagram(grapholscape)
    }
  })
}

function onIncrementalStartup(grapholscape: Grapholscape, incrementalController: IncrementalController) {
  grapholscape.renderer.unselect()

  // if (!incrementalController) {
  //   incrementalController = new IncrementalController(grapholscape)
  // }

  manageWidgetsOnActivation(
    grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
    !grapholscape.renderer.cy || grapholscape.renderer.cy.elements().empty(),
    incrementalController.endpointController !== undefined
  )

  const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend
  entityColorLegend.onElementSelection = (elem) => {
    const filteredEntity = grapholscape.ontology.getEntity(elem.iri) || incrementalController.classInstanceEntities.get(elem.iri)
    const filter = incrementalController.classFilterMap.get(elem.iri) ||
      new Filter(elem.id, (grapholElement) => {
        const _iri = grapholElement.iri
        if (_iri) {
          const entityToCheck = grapholscape.ontology.getEntity(_iri) || incrementalController.classInstanceEntities.get(_iri)
          if (entityToCheck && filteredEntity) {
            return filteredEntity?.iri.equals(entityToCheck.iri) ||
              ((entityToCheck as ClassInstanceEntity).parentClassIris && (entityToCheck as ClassInstanceEntity).hasParentClassIri(filteredEntity.iri))
          }

        }

        return false
      })

    incrementalController.classFilterMap.set(elem.iri, filter)

    if (filter.active) {
      grapholscape.unfilter(filter)
    } else {
      grapholscape.filter(filter)
    }

    elem.filtered = filter.active
    entityColorLegend.requestUpdate()
  }

  // if (grapholscape.renderer.diagram)
  //   setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)

  // incrementalController.setIncrementalEventHandlers()
}

function manageWidgetsOnActivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>, isCanvasEmpty = false, isReasonerAvailable?: boolean) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU)
  const classInstanceDetails = widgets.get(WidgetEnum.CLASS_INSTANCE_DETAILS)
  const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES)
  const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
  const entityColorLegend = widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend

  entityColorLegend.enable()

  entityDetails.showOccurrences = false
  classInstanceDetails?.enable()
  diagramSelector?.disable()

  initialMenu?.show()

  if (isCanvasEmpty && initialMenu) {
    IncrementalUI.restorePosition(initialMenu);
    (initialMenu as IncrementalInitialMenu).focusInputSearch()
  }

  if (isReasonerAvailable)
    vkgPreferences?.enable()

  filtersWidget?.disable()
}

function manageWidgetsOnDeactivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU)
  const classInstanceDetails = widgets.get(WidgetEnum.CLASS_INSTANCE_DETAILS)
  const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES)
  const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails

  entityDetails.showOccurrences = true
  classInstanceDetails?.disable()
  vkgPreferences?.disable()
  diagramSelector?.enable()
  initialMenu?.hide()
  filtersWidget?.enable()
}

function onEmptyDiagram(grapholscape: Grapholscape) {
  const initialMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as IncrementalInitialMenu | undefined
  (grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as unknown as IBaseMixin)?.hide();

  if (initialMenu) {
    IncrementalUI.restorePosition(initialMenu)
    initialMenu.focusInputSearch()
  }

  const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend | undefined
  if (entityColorLegend) {
    entityColorLegend.elements = []
  }
}