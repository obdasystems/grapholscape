import { DefaultAnnotationProperties } from "./annotation-property"
import Annotation from "./annotation"
import Iri from "./iri"


export default class AnnotatedElement {

  private _annotations: Annotation[] = []

  constructor() { }

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

  public getAnnotations(language?: string, annotationProperty?: Iri) {
    return this._annotations.filter(ann => {
      let shouldAdd = true
      if (language && ann.language !== language) {
        shouldAdd = false
      }

      if (annotationProperty && !annotationProperty.equals(ann.property)) {
        shouldAdd = false
      }

      return shouldAdd
    })
  }

  public getLabels(language?: string) {
    return this.getAnnotations(language, DefaultAnnotationProperties.label)
  }

  public getComments(language?: string) {
    return this.getAnnotations(language, DefaultAnnotationProperties.comment)
  }
}