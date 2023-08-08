import Iri from "../iri"
import { Annotation as IAnnotation } from "../rdf-graph/swagger"

export const UNDEFINED_LANGUAGE = '_'

export default class Annotation implements IAnnotation {
  private _property: Iri
  lexicalForm: string
  language: string
  datatype: string

  constructor(property: Iri, lexicalForm: string, language?: string, datatype?: string) {
    this._property = property
    this.lexicalForm = lexicalForm
    this.language = language || UNDEFINED_LANGUAGE
    this.datatype = datatype || ''
  }

  equals(annotation: Annotation) {
    return this.datatype === annotation.datatype &&
      this.lexicalForm === annotation.lexicalForm &&
      this.language === annotation.language &&
      this._property.equals(annotation.property)
  }

  get property() {
    return this._property.fullIri
  }

  get kind() {
    return this._property.remainder
  }
}