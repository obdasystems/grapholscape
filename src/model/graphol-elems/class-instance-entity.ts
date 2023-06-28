import Iri from "../iri";
import GrapholEntity from "./entity";

/** @internal */
export default class ClassInstanceEntity extends GrapholEntity {

  private _parentClassIris: Iri[] = []

  constructor(iri: Iri, parentClassIris: Iri[] = []) {
    super(iri)

    this._parentClassIris = parentClassIris
  }

  /**
   * Set the instance to be instance of a particular Class.
   * If it is already instance of such a class, no changes will be made.
   * @param parentClassIri the IRI of the Class
   */
  addParentClass(parentClassIri: Iri) {
    if (!this.hasParentClassIri(parentClassIri)) {
      this._parentClassIris?.push(parentClassIri)
    }
  }

  /**
   * Check if the instance is instance of a class with such an IRI
   * @param parentClassIri 
   * @returns 
   */
  hasParentClassIri(parentClassIri: string | Iri) {
    return this._parentClassIris.find(iri => iri.equals(parentClassIri))
  }

  get isRDFTypeUnknown() { return this._parentClassIris.length === 0 }
  get parentClassIris() { return Array.from(this._parentClassIris) }
}