import { Annotation as IAnnotation } from "../rdf-graph/swagger"

export const UNDEFINED_LANGUAGE = '_'

export default class Annotation implements IAnnotation {
  property: string
  lexicalForm: string
  language: string
  datatype: string
  
  constructor(property: string, lexicalForm: string, language?: string, datatype?: string) {
   this.property = property
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
}