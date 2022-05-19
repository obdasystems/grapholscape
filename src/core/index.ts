import Lifecycle from "../lifecycle"
import GrapholscapeState from "../model/state/state"
import { filter, unfilter } from "./filtering"
import { showDiagram } from "./show-diagram"

export default function (state: GrapholscapeState) {
  const actualState = state
  const lifecycle = new Lifecycle()
  // Public API
  const core = {
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
    zoomIn: null,
    zoomOut: null,
    ontology: null,
    setRenderer: null,
    setTheme: null,
    on: lifecycle.on
  }

  return core
}