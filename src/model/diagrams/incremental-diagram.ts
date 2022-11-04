import { floatyOptions } from "../../config";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";
import { RendererStatesEnum } from "../renderers/i-render-state";
import Diagram from "./diagram";
import DiagramRepresentation from "./diagram-representation";

export default class IncrementalDiagram extends Diagram {

  constructor() {
    super('Incremental', -1)
    this.representations = new Map([[RendererStatesEnum.INCREMENTAL, new DiagramRepresentation(floatyOptions)]])
  }

  addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity): void {
    this.representation?.addElement(newElement, grapholEntity)
  }

  removeElement(elementId: string) {
    this.representation?.removeElement(elementId)
  }

  get representation() {
    return this.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}