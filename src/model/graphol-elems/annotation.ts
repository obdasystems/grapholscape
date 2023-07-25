import { AnnotationsKind } from "../annotated-element"
import Iri from "../iri"
import Namespace from "../namespace"
import { Annotation as IAnnotation } from "../rdf-graph/swagger"

export const UNDEFINED_LANGUAGE = '_'

export default class Annotation implements IAnnotation {
  private _property: Iri
  lexicalForm: string
  language: string
  datatype: string

  constructor(property: Iri | AnnotationsKind, lexicalForm: string, language?: string, datatype?: string) {
    if (property['fullIri']) {
      this._property = property as Iri
    } else {
      this._property = new Iri(
        property as string,
        [new Namespace(['rdfs'], 'http://www.w3.org/2000/01/rdf-schema#')]
      )
    }
    this.lexicalForm = lexicalForm
    this.language = language || UNDEFINED_LANGUAGE
    this.datatype = datatype || ''
  }

  equals(annotation: Annotation) {
    return this.datatype === annotation.datatype &&
      this.lexicalForm === annotation.lexicalForm &&
      this.language === annotation.language &&
      this.property === annotation.property
  }

  get property() {
    return this._property.fullIri
  }

  get kind() {
    return this._property.remainder
  }
}