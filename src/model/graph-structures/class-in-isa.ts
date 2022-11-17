import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import { GrapholTypesEnum } from "../graphol-elems/node-enums";

export default class ClassInIsa {
  constructor(public superClass: GrapholEntity, public subClass: GrapholEntity, public isEquivalence = false) { }

  getIsa(): GrapholEdge {
    const newIsaEdge = new GrapholEdge(``)

    newIsaEdge.type = this.isEquivalence ? GrapholTypesEnum.EQUIVALENCE : GrapholTypesEnum.INCLUSION
    newIsaEdge.sourceId = this.subClass.iri.prefixed
    newIsaEdge.targetId = this.superClass.iri.prefixed

    return newIsaEdge
  }
}