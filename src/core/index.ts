import Lifecycle from "../lifecycle"
import GrapholscapeState from "../model/state/state"
import { filter, unfilter } from "./filtering"
import { showDiagram } from "./show-diagram"

export const ZOOM_STEP_VALUE = 0.08

export default function (state: GrapholscapeState, container: Element) {
  const actualState = state
  const lifecycle = new Lifecycle()
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
    zoomIn: (value = ZOOM_STEP_VALUE) => actualState.diagram.zoomIn(value),
    zoomOut: (value = ZOOM_STEP_VALUE) => actualState.diagram.zoomOut(value),
    ontology: null,
    setRenderer: null,
    setTheme: null,
    on: lifecycle.on
  }

  return core
}