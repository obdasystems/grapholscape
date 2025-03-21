import { DefaultNamespaces } from "./namespace"
import Iri from "./iri"

export const DefaultAnnotationProperties: { [x: string]: Iri } = {
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
  latitude: new Iri(`${DefaultNamespaces.OBDA.value}latitude`, [DefaultNamespaces.OBDA]),
  longitude: new Iri(`${DefaultNamespaces.OBDA.value}longitude`, [DefaultNamespaces.OBDA]),
  location: new Iri(`${DefaultNamespaces.OBDA.value}location`, [DefaultNamespaces.OBDA]),
}

export default class AnnotationProperty extends Iri {

}