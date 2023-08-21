import Iri from "./iri"


export default class AnnotationProperty {
  private _iri: Iri
  

  constructor(iri: Iri) {
    this._iri = iri
  }

  equals(annotationProperty: AnnotationProperty) {
    return this._iri.equals(annotationProperty.iri)
  }

  get iri() {
    return this._iri
  }

}