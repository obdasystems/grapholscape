import Annotation from "./graphol-elems/annotation"

export enum AnnotationsKind {
  label = 'http://www.w3.org/2000/01/rdf-schema#label',
  comment = 'http://www.w3.org/2000/01/rdf-schema#comment',
  author = 'http://www.w3.org/2000/01/rdf-schema#author',
  deprecated = 'http://www.w3.org/2002/07/owl#deprecated',
  versionInfo = 'http://www.w3.org/2002/07/owl#versionInfo',
  incompatibleWith = 'http://www.w3.org/2002/07/owl#incompatibleWith',
  backwardCompatibleWith = 'http://www.w3.org/2000/01/rdf-schema#backwardCompatibleWith',
  priorVersion = 'http://www.w3.org/2002/07/owl#priorVersion',
  backwardCompatible = 'http://www.w3.org/2002/07/owl#backwardCompatibleWith',
  isDefinedBy = 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy'
}

export default class AnnotatedElement {

  private _annotations: Annotation[] = []

  constructor() {}

  set annotations(annotations: Annotation[]) {
    this._annotations = annotations
  }

  public addAnnotation(newAnnotation: Annotation) {
    for (let annotation of this._annotations) {
      if (annotation.equals(newAnnotation)) {
        return
      }
    }
    this._annotations.push(newAnnotation)
  }

  public removeAnnotation(annotation: Annotation) {
    this._annotations = this._annotations.filter(a => !a.equals(annotation))
  }

  public getAnnotations(language?: string, kind?: AnnotationsKind) {
    return this._annotations.filter(ann => {
      let shouldAdd = true
      if (language && ann.language !== language) {
        shouldAdd = false
      }

      if (kind && ann.property !== kind) {
        shouldAdd = false
      }

      return shouldAdd
    })
  }

  public getLabels(language?: string) {
    return this.getAnnotations(language, AnnotationsKind.label)
  }

  public getComments(language?: string) {
    return this.getAnnotations(language, AnnotationsKind.comment)
  }
}