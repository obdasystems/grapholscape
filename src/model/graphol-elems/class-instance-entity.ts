import Iri from "../iri";
import GrapholEntity from "./entity";
import { GrapholTypesEnum } from "./enums";

export default class ClassInstanceEntity extends GrapholEntity {

  parentClassIris = new Set<Iri>

  constructor(iri: Iri, parentClassIri?: Iri) {
    super(iri, GrapholTypesEnum.CLASS_INSTANCE)

    if (parentClassIri)
      this.parentClassIris.add(parentClassIri)
  }
}