import { Grapholscape } from "../../core"
import { Filter } from "../../model"
import { WidgetEnum, IBaseMixin, GscapeEntityColorLegend, IncrementalInitialMenu } from "../../ui"
import { GscapeEntityDetails } from "../../ui/entity-details"
import IncrementalBase from "../i-incremental"
import { restorePosition } from "./move-widget"

export function onIncrementalStartup(ic: IncrementalBase) {
  const grapholscape = ic.grapholscape
  grapholscape.renderer.unselect()

  manageWidgetsOnActivation(
    grapholscape.widgets as Map<WidgetEnum, IBaseMixin & HTMLElement>,
    !grapholscape.renderer.cy || grapholscape.renderer.cy.elements().empty()
  )

  const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend
  entityColorLegend.onElementSelection = (elem) => {
    const filteredEntity = grapholscape.ontology.getEntity(elem.iri)
    const filter = ic.classFilterMap.get(elem.iri) ||
      new Filter(elem.id, (grapholElement) => {
        const _iri = grapholElement.iri
        if (_iri) {
          const entityToCheck = grapholscape.ontology.getEntity(_iri)
          if (entityToCheck && filteredEntity) {
            return filteredEntity?.iri.equals(entityToCheck.iri)
          }

        }

        return false
      })

    ic.classFilterMap.set(elem.iri, filter)

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

export function manageWidgetsOnActivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>, isCanvasEmpty = false) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU)
  const classInstanceDetails = widgets.get(WidgetEnum.INCREMENTAL_ENTITY_DETAILS)
  const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
  const entityColorLegend = widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend

  entityColorLegend.enable()

  entityDetails.showOccurrences = false
  classInstanceDetails?.enable()
  diagramSelector?.hide()

  initialMenu?.show()

  if (isCanvasEmpty && initialMenu) {
    restorePosition(initialMenu);
    (initialMenu as IncrementalInitialMenu).focusInputSearch()
  }

  filtersWidget?.hide()
}

export function manageWidgetsOnDeactivation(widgets: Map<WidgetEnum, IBaseMixin & HTMLElement>) {
  const filtersWidget = widgets.get(WidgetEnum.FILTERS)
  const diagramSelector = widgets.get(WidgetEnum.DIAGRAM_SELECTOR)
  const initialMenu = widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU)
  const classInstanceDetails = widgets.get(WidgetEnum.INCREMENTAL_ENTITY_DETAILS)
  const vkgPreferences = widgets.get(WidgetEnum.VKG_PREFERENCES)
  const entityDetails = widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails

  entityDetails.showOccurrences = true
  classInstanceDetails?.disable()
  vkgPreferences?.disable()
  diagramSelector?.show()
  initialMenu?.hide()
  filtersWidget?.show()
}

export function onEmptyDiagram(grapholscape: Grapholscape) {
  const initialMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_INITIAL_MENU) as IncrementalInitialMenu | undefined
  (grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as unknown as IBaseMixin)?.hide();

  if (initialMenu) {
    restorePosition(initialMenu)
    initialMenu.focusInputSearch()
  }

  const entityColorLegend = grapholscape.widgets.get(WidgetEnum.ENTITY_COLOR_LEGEND) as GscapeEntityColorLegend | undefined
  if (entityColorLegend) {
    entityColorLegend.elements = []
  }
}