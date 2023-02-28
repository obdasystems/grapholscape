import Iri from "../iri";
import GrapholEntity from "./entity";
import { GrapholTypesEnum } from "./enums";

/** @internal */
export default class ClassInstanceEntity extends GrapholEntity {

  parentClassIri: Iri

  constructor(iri: Iri, parentClassIri: Iri) {
    super(iri, GrapholTypesEnum.CLASS_INSTANCE)

    this.parentClassIri = parentClassIri
  }
}