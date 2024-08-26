import AnnotationProperty from "./annotation-property"
import Iri from "./iri"
import { Annotation as IAnnotation } from "./rdf-graph/swagger"

export default class Annotation implements IAnnotation {
  private _property: AnnotationProperty
  private _range: string | Iri
  language?: string
  datatype?: string

  constructor(property: Iri, range: string | Iri, language?: string, datatype?: string) {
    this._property = property
    this._range = range
    this.language = language
    this.datatype = datatype
  }

  equals(annotation: Annotation) {
    return this.datatype === annotation.datatype &&
      this.value === annotation.value &&
      this.language === annotation.language &&
      this._property.equals(annotation.property)
  }

  get hasIriValue() {
    return this.rangeIri !== undefined
  }

  get property() {
    return this._property.fullIri
  }

  get propertyIri() {
    return this._property
  }

  get kind() {
    return this._property.remainder
  }

  get value() {
    return this._range.toString()
  }

  /**
   * If the range is a Iri, return such a Iri, undefined otherwise
  */
  get rangeIri() {
    return (this._range as Iri).fullIri ? this._range as Iri : undefined
  }
}