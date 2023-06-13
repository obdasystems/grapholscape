/** @typedef {import('../model').default} Ontology */

import { Ontology } from '../model'
import Annotation from '../model/graphol-elems/annotation'
import GrapholEntity, { FunctionalityEnum } from '../model/graphol-elems/entity'
import { GrapholTypesEnum } from '../model/graphol-elems/enums'
import Iri from '../model/iri'
import Namespace from '../model/namespace'

export let warnings = new Set()

export function getOntologyInfo(xmlDocument: XMLDocument) {
  let project = getTag(xmlDocument, 'project')
  let ontology_languages = getTag(xmlDocument, 'languages')?.children
  const ontologyElem = getTag(xmlDocument, 'ontology')
  if (!ontologyElem) return

  const ontology = new Ontology(
    project?.getAttribute('name') || '',
    project?.getAttribute('version') || '',
    ontologyElem.getAttribute('iri') || '',
  )

  if (ontology_languages)
    ontology.languages.list = [...ontology_languages].map(lang => lang.textContent) || []

  ontology.languages.default = ontologyElem.getAttribute('lang') || ontology.languages.list[0]
  return ontology
}

/**
 * 
 * @param {Element} xmlDocument 
 * @returns 
 */
export function getNamespaces(xmlDocument: XMLDocument): Namespace[] {
  let result: Namespace[] = []
  let prefixes = getTag(xmlDocument, 'prefixes')?.children
  if (prefixes) {
    for (const p of prefixes) {
      const namespaceValue = getTagText(p, 'namespace')
      const prefixValue = getTagText(p, 'value')
      const namespace = result.find(n => n.toString() === namespaceValue)
      if (typeof (prefixValue) === 'string' && namespaceValue) {
        if (namespace) {
          namespace.addPrefix(prefixValue)
        }
        else {
          result.push(new Namespace([prefixValue], namespaceValue, false))
        }
      }
    }
  }
  return result
}

export function getIri(element: Element, ontology: Ontology) {
  let nodeIri = getTagText(element, 'iri')

  if (!nodeIri) return

  return new Iri(nodeIri, ontology.namespaces)
}

/**
 * Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
 * @param element 
 * @param ontology 
 * @returns 
 */
export function getFacetDisplayedName(element: Element, ontology: Ontology): string | undefined {
  // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
  if (element.getAttribute('type') === GrapholTypesEnum.FACET) {
    const constrainingFacet = getTagText(element, 'constrainingFacet')
    if (constrainingFacet) {
      const facetIri = new Iri(constrainingFacet, ontology.namespaces)
      //let constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'))
      //constraining_facet = constraining_facet.prefix + ':' + constraining_facet.remainingChars

      const lexicalForm = getTagText(element, 'lexicalForm')
      const datatype = getTagText(element, 'datatype')
      if (datatype) {
        const datatypeIri = new Iri(datatype, ontology.namespaces)

        return `${facetIri.prefixed}\n\n"${lexicalForm}"^^${datatypeIri.prefixed}`
      }

      // unused to be compliant to Graphol-V2
      //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
      //datatype = datatype.prefix + ':' + datatype.rem_chars

    }
  }
}

/**
 * Returns an object with annotations, description and the properties (functional, etc..) for DataProperties
 * @param {Element} element
 * @returns {FunctionalityEnum[]}
 */
export function getFunctionalities(element: Element): FunctionalityEnum[] {
  let result: FunctionalityEnum[] = []
  for (let property of element.children) {
    const functionality = Object.values(FunctionalityEnum).find(f => f.toString() === property.tagName)
    if (functionality) {
      result.push(functionality)
    }
  }
  return result
}

function getIriAnnotations(iriElem: Element): Annotation[] {
  let result: Annotation[] = []
  let annotations = getTag(iriElem, 'annotations')
  let language: string | null | undefined
  let annotation_kind: string
  let lexicalForm: string | null | undefined
  let annotationProperty: string | null | undefined

  if (annotations) {
    for (let annotation of annotations.children) {
      annotationProperty = getTagText(annotation, 'property')
      if (annotationProperty) {
        annotation_kind = getRemainingChars(annotationProperty)
        language = getTagText(annotation, 'language')
        lexicalForm = getTagText(annotation, 'lexicalForm')

        if (lexicalForm && language)
          result.push(new Annotation(annotation_kind, lexicalForm, language))
      }
    }
  }
  return result
}

/**
 * Retrieve the xml tag element in a xml root element
 */
export function getTag(root: Element | XMLDocument, tagName: string, n: number = 0) {
  if (root && root.getElementsByTagName(tagName[n]))
    return root.getElementsByTagName(tagName)[n]
}

/**
 * Retrieve the text inside a given tag in a xml root element
 */
export function getTagText(root: Element | XMLDocument, tagName: string, n: number = 0) {
  if (root && root.getElementsByTagName(tagName)[n])
    return root.getElementsByTagName(tagName)[n].textContent
}

function getIriElem(node: string | Element, xmlDocument: Element | XMLDocument) {
  let node_iri: string | null | undefined

  if (typeof (node) === 'string')
    node_iri = node
  else
    node_iri = getTagText(node, 'iri')

  if (!node_iri) return null
  let iris = getTag(xmlDocument, 'iris')?.children
  if (iris) {
    for (let iri of iris) {
      if (node_iri == getTagText(iri, 'value')) {
        return iri
      }
    }
  }
  return null
}

/**
 * Get the substring after separator '#' or '/' from a full IRI
 * @param iri
 */
function getRemainingChars(iri: string): string {
  let rem_chars = iri.slice(iri.lastIndexOf('#') + 1)
  // if rem_chars has no '#' then use '/' as separator
  if (rem_chars.length == iri.length) {
    rem_chars = iri.slice(iri.lastIndexOf('/') + 1)
  }

  return rem_chars
}

export function parseEntities(xmlDocument: XMLDocument, namespaces: Namespace[]): Map<string, GrapholEntity> {
  const xmlIris = getTag(xmlDocument, 'iris')?.children
  const resultMap = new Map()

  if (xmlIris) {
    let iri: Iri,
      iriString: string | null | undefined,
      entity: GrapholEntity

    for (let xmlIri of xmlIris) {
      iriString = getTagText(xmlIri, 'value')
      if (iriString) {
        iri = new Iri(iriString, namespaces)
        entity = new GrapholEntity(iri)
        entity.annotations = getIriAnnotations(xmlIri)
        entity.functionalities = getFunctionalities(xmlIri)

        resultMap.set(iriString, entity)
      }
    }
  }

  return resultMap
}