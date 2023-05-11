import { floatyOptions } from "../../config";
import ClassInstanceEntity from "../graphol-elems/class-instance-entity";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";
import Iri from "../iri";
import { RendererStatesEnum } from "../renderers/i-render-state";
import Diagram from "./diagram";
import DiagramRepresentation from "./diagram-representation";

export default class IncrementalDiagram extends Diagram {
  public static ID = -1
  /** @internal */
  public classInstances?: Map<string, ClassInstanceEntity>

  constructor() {
    super('Incremental', IncrementalDiagram.ID)
    this.representations = new Map([[RendererStatesEnum.INCREMENTAL, new DiagramRepresentation(floatyOptions)]])
  }

  addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity): void {
    this.representation?.addElement(newElement, grapholEntity)
  }

  removeElement(elementId: string) {
    this.representation?.removeElement(elementId)
  }

  containsEntity(iriOrGrapholEntity: Iri | GrapholEntity) {
    return this.representation?.containsEntity(iriOrGrapholEntity)
  }

  get representation() {
    return this.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}