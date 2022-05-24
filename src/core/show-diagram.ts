import Lifecycle, { LifecycleEvent } from "../lifecycle";
import { GrapholscapeState } from "../model";

export const showDiagram = function (diagramId: number, container = this.container, viewportState = null) {
  const actualState: GrapholscapeState = this.actualState
  const lifecyle: Lifecycle = this.lifecycle

  const diagram = actualState.ontology.getDiagram(diagramId)

  if (!diagram) {
    console.warn(`Can't find any diagram with id="${diagramId}"`)
    return
  }

  if (diagram !== actualState.diagram) {
    actualState.diagram?.stopRendering()
    diagram.setTheme(actualState.theme)
    diagram.render(container || this.container)
    actualState.diagram = diagram
    lifecyle.trigger(LifecycleEvent.DiagramChange, diagram)
  }
}