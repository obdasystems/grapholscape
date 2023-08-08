import Annotation from "./graphol-elems/annotation"
import Iri from "./iri"
import Namespace from "./namespace"

export const DefaultNamespaces = {
  RDFS: new Namespace(['rdfs'], 'http://www.w3.org/2000/01/rdf-schema#'),
  OWL: new Namespace(['owl'], 'http://www.w3.org/2002/07/owl#'),
}

export const AnnotationProperty: { [x: string]: Iri } = {
  label: new Iri(`${DefaultNamespaces.RDFS.value}label`, [DefaultNamespaces.RDFS]),
  comment: new Iri(`${DefaultNamespaces.RDFS.value}comment`, [DefaultNamespaces.RDFS]),
  author: new Iri(`${DefaultNamespaces.RDFS.value}author`, [DefaultNamespaces.RDFS]),
  seeAlso: new Iri(`${DefaultNamespaces.RDFS.value}seeAlso`, [DefaultNamespaces.RDFS]),
  isDefinedBy: new Iri(`${DefaultNamespaces.RDFS.value}isDefinedBy`, [DefaultNamespaces.RDFS]),
  deprecated: new Iri(`${DefaultNamespaces.OWL.value}deprecated`, [DefaultNamespaces.OWL]),
  versionInfo: new Iri(`${DefaultNamespaces.OWL.value}versionInfo`, [DefaultNamespaces.OWL]),
  priorVersion: new Iri(`${DefaultNamespaces.OWL.value}priorVersion`, [DefaultNamespaces.OWL]),
  backCompatibleWith: new Iri(`${DefaultNamespaces.OWL.value}backCompatibleWith`, [DefaultNamespaces.OWL]),
  incompatibleWith: new Iri(`${DefaultNamespaces.OWL.value}incompatibleWith`, [DefaultNamespaces.OWL]),
}

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
    return this.getAnnotations(language, AnnotationProperty.label)
  }

  public getComments(language?: string) {
    return this.getAnnotations(language, AnnotationProperty.comment)
  }
}