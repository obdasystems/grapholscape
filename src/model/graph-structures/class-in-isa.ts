import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import { TypesEnum } from "../rdf-graph/swagger";

export default class ClassInIsa {
  constructor(public superClass: GrapholEntity, public subClass: GrapholEntity, public isEquivalence = false) { }

  getIsa(): GrapholEdge {
    const newIsaEdge = new GrapholEdge(``, this.isEquivalence ? TypesEnum.EQUIVALENCE : TypesEnum.INCLUSION)
    newIsaEdge.sourceId = this.subClass.iri.prefixed
    newIsaEdge.targetId = this.superClass.iri.prefixed

    return newIsaEdge
  }
}