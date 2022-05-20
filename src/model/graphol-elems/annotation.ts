export default class Annotation {
  property: string
  lexicalForm: string
  language: string
  datatype: string
  
  constructor(property: string, lexicalForm: string, language?: string, datatype?: string) {
   this.property = property
   this.lexicalForm = lexicalForm
  }
}