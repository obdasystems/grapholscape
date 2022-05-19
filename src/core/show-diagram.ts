import Lifecycle, { LifecycleEvent } from "../lifecycle";
import { GrapholscapeState } from "../model";

export const showDiagram = function (diagramId: number, container?: Element, viewportState = null) {
  const actualState: GrapholscapeState = this.actualState
  const lifecyle: Lifecycle = this.lifecycle

  const diagram = actualState.ontology.getDiagram(diagramId)

  if (diagram && diagram !== actualState.diagram) {
    diagram.render(container || this.container)
    actualState.diagram = diagram
    lifecyle.trigger(LifecycleEvent.DiagramChange, diagram)
  }
}