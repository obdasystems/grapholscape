import Iri from "../iri";
import GrapholEntity from "./entity";
import { GrapholTypesEnum } from "./enums";

/** @internal */
export default class ClassInstanceEntity extends GrapholEntity {

  parentClassIris?: Iri[]

  constructor(iri: Iri, parentClassIri: Iri[] = []) {
    super(iri, GrapholTypesEnum.CLASS_INSTANCE)

    this.parentClassIris = parentClassIri
  }

  /**
   * Set the instance to be instance of a particular Class.
   * If it is already instance of such a class, no changes will be made.
   * @param parentClassIri the IRI of the Class
   */
  addParentClass(parentClassIri: Iri) {
    if (!this.hasParentClassIri(parentClassIri)) {
      this.parentClassIris?.push(parentClassIri)
    }
  }

  /**
   * Check if the instance is instance of a class with such an IRI
   * @param parentClassIri 
   * @returns 
   */
  hasParentClassIri(parentClassIri: string | Iri) {
    return this.parentClassIris?.find(iri => iri.equals(parentClassIri))
  }
}