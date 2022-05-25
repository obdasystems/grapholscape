import Lifecycle from "../lifecycle"
import GrapholscapeState from "../model/state"
import GrapholscapeTheme from "../model/theme"
import { centerOnElement, centerOnEntity, selectElement, selectEntity, unselect } from "./center-select"
import { addFilter, filter, getDefaultFilters, unfilter } from "./filtering"
import { setEntityNameType } from "./set-entity-name-type"
import { setLanguage } from "./set-language"
import { showDiagram } from "./show-diagram"
import { addTheme, setTheme } from "./themes"

export const ZOOM_STEP_VALUE = 0.08

export default function (state: GrapholscapeState, container: Element) {
  const lifecycle = new Lifecycle()
  const themes = [GrapholscapeTheme.defaultTheme, GrapholscapeTheme.darkTheme, GrapholscapeTheme.classicTheme]
  const filters = new Map(Object.values(getDefaultFilters()).map(filter => [filter.key, filter]))

  if (!themes.includes(state.theme)) {
    addTheme(state.theme)
  }

  // Public API
  const core = {
    container: container,
    lifecycle: lifecycle,
    actualState: state,
    centerOnElement: centerOnElement,
    selectElement: selectElement,
    centerOnEntity: centerOnEntity,
    selectEntity: selectEntity,
    unselect: unselect,
    showDiagram: showDiagram,
    fit: function () { this.actualState.diagram.fit() },
    filter: filter,
    unfilter: unfilter,
    addFilter: addFilter, // TODO: test adding completely new filters
    zoomIn: function (value = ZOOM_STEP_VALUE) { this.actualState.diagram.zoomIn(value) },
    zoomOut: function (value = ZOOM_STEP_VALUE) { this.actualState.diagram.zoomOut(value) },
    ontology: state.ontology,
    setRenderer: null,
    addRenderer: null,
    addTheme: addTheme,
    setTheme: setTheme,
    setLanguage: setLanguage,
    setEntityNameType: setEntityNameType,
    on: lifecycle.on.bind(lifecycle),
    // Lists for extendable functionalities, user can create and add more of these objects
    filters: filters,
    renderers: null,
    themes: themes,
  }

  return core
}