import Lifecycle from "../lifecycle"
import GrapholscapeState from "../model/state/state"
import GrapholscapeTheme from "../model/theme"
import { filter, unfilter } from "./filtering"
import { showDiagram } from "./show-diagram"
import { addTheme, setTheme } from "./themes"

export const ZOOM_STEP_VALUE = 0.08

export default function (state: GrapholscapeState, container: Element) {
  const lifecycle = new Lifecycle()
  const themes = [GrapholscapeTheme.defaultTheme, GrapholscapeTheme.darkTheme, GrapholscapeTheme.classicTheme]
  if (!themes.includes(state.theme)) {
    addTheme(state.theme)
  }

  // Public API
  const core = {
    container: container,
    lifecycle: lifecycle,
    actualState: state,
    selectElement: null,
    selectEntity: null,
    unselect: null,
    showDiagram: showDiagram,
    centerOnEntity: null,
    centerOnNode: null,
    filter: filter,
    unfilter: unfilter,
    zoomIn: function (value = ZOOM_STEP_VALUE) { this.actualState.diagram.zoomIn(value) },
    zoomOut: function (value = ZOOM_STEP_VALUE) { this.actualState.diagram.zoomOut(value) },
    ontology: state.ontology,
    setRenderer: null,
    themes: themes,
    addTheme: addTheme,
    setTheme: setTheme,
    on: lifecycle.on
  }

  return core
}