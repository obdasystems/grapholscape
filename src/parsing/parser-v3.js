/** @typedef {import('../model').default} Ontology */

import { Type } from '../model/node-enums'

export let warnings = new Set()

/**
 * 
 * @param {Document | XMLDocument} xmlDocument 
 */
export function getOntologyInfo(xmlDocument) {
  let project = getTag(xmlDocument, 'project')
  let ontology_languages = getTag(xmlDocument, 'languages').children
  let iri = getTag(xmlDocument, 'ontology').getAttribute('iri')
  let iri_elem = getIriElem(iri, xmlDocument)

  return {
    /** @type {string} */
    name: project.getAttribute('name'),
    /** @type {string} */
    version: project.getAttribute('version'),
    /** @type {string} */
    iri: iri,
    /** @type {string[]} */
    languages: [...ontology_languages].map(lang => lang.textContent),
    /** @type {string} */
    default_language: getTag(xmlDocument, 'ontology').getAttribute('lang'),
    other_infos: getIriAnnotations(iri_elem)
  }
}

/**
 * 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns 
 */
export function getIriPrefixesDictionary(xmlDocument) {
  let result = []
  let prefixes = getTag(xmlDocument, 'prefixes').children
  for (const p of prefixes) {
    const namespaceValue = getTagText(p, 'namespace')
    const namespace = result.find( n => n.value === namespaceValue)
    if (namespace) 
      namespace.prefixes.push(getTagText(p, 'value'))
    else {
      result.push({
        prefixes: [getTagText(p, 'value')],
        value: namespaceValue,
        standard: false,
      })
    }
  }
  return result
}

/**
 * 
 * @param {HTMLElment} element an xml element
 * @param {import('../model/').default} ontology 
 * @returns {import('../model/ontology').Iri}
 */
export function getIri(element, ontology) {
  let nodeIri = getTagText(element, 'iri')
  
  if (!nodeIri) return {}

  let destructuredIri = ontology.destructureIri(nodeIri)
  if (destructuredIri) {
    return destructuredIri
  } else {
    this.warnings.add(`Namespace not found for [${nodeIri}]. The prefix "undefined" has been assigned`)
    /** @type {import('../model/ontology').Iri} */
    return {
      prefix: 'undefined',
      remainingChars: nodeIri,
      namespace: 'undefined',
      fullIri: nodeIri,
      prefixed: nodeIri
    }
  }
}
/**
 * 
 * @param {HTMLElement} element 
 * @param {Ontology} ontology
 * @returns {string}
 */
export function getFacetDisplayedName(element, ontology) {
  // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
  if (element.getAttribute('type') === Type.FACET) {
    let constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'))
    constraining_facet = constraining_facet.prefix + ':' + constraining_facet.remainingChars

    let value = getTagText(element, 'lexicalForm')

    // unused to be compliant to Graphol-V2
    //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
    //datatype = datatype.prefix + ':' + datatype.rem_chars

    return constraining_facet + '^^"' + value + '"'
  }
}

/**
 * Returns an object with annotations, description and the properties (functional, etc..) for DataProperties
 * @param {HTMLElement} element 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns {Object.<string, Object.<string, string[]> | boolean>}
 */
export function getPredicateInfo(element, xmlDocument) {
  let result = {}
  let actual_iri_elem = getIriElem(element, xmlDocument)
  result = getIriAnnotations(actual_iri_elem)

  const elementType = element.getAttribute('type')
  if (elementType === Type.OBJECT_PROPERTY || elementType === Type.DATA_PROPERTY) {
    if (actual_iri_elem && actual_iri_elem.children) {
      for (let property of actual_iri_elem.children) {
        if (property.tagName != 'value' && property.tagName != 'annotations' &&
          property.textContent != '0') {
          result[property.tagName] = 1
        }
      }
    }
  }
  return result
}

/** @param {HTMLElement} iri */
function getIriAnnotations(iri) {
  let result = {}
  /** @type {Object.<string, string[]} */
  result.annotations = {}

  let annotations = getTag(iri, 'annotations')
  let language, annotation_kind, lexicalForm
  if (annotations) {
    for (let annotation of annotations.children) {
      annotation_kind = getRemainingChars(getTagText(annotation, 'property'))
      language = getTagText(annotation, 'language')
      lexicalForm = getTagText(annotation, 'lexicalForm')

      if (!result.annotations[annotation_kind])
        result.annotations[annotation_kind] = {}

      if (!result.annotations[annotation_kind][language])
        result.annotations[annotation_kind][language] = []

      result.annotations[annotation_kind][language].push(lexicalForm)
    }
  }

  return result
}

/**
 * Retrieve the xml tag element in a xml root element
 * @param {HTMLElement} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {number} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 * @returns {HTMLElement}
 */
export function getTag(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName[n]))
    return root.getElementsByTagName(tagName)[n]
}

/**
 * Retrieve the text inside a given tag in a xml root element
 * @param {HTMLElement} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {number} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 * @returns {string}
 */
export function getTagText(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName)[n])
    return root.getElementsByTagName(tagName)[n].textContent
}

/**
 * 
 * @param {string | HTMLElement} node 
 * @param {Document | XMLDocument} xmlDocument 
 * @returns {HTMLElement}
 */
function getIriElem(node, xmlDocument) {
  let node_iri = null

  if (typeof (node) === 'string')
    node_iri = node
  else
    node_iri = getTagText(node, 'iri')

  if (!node_iri) return null
  let iris = getTag(xmlDocument, 'iris').children
  for (let iri of iris) {
    if (node_iri == getTagText(iri, 'value')) {
      return iri
    }
  }

  return null
}

/**
 * Get the substring after separator '#' or '/' from a full IRI
 * @param {string} iri 
 * @returns {string}
 */
function getRemainingChars(iri) {
  let rem_chars = iri.slice(iri.lastIndexOf('#') + 1)
  // if rem_chars has no '#' then use '/' as separator
  if (rem_chars.length == iri.length) {
    rem_chars = iri.slice(iri.lastIndexOf('/') + 1)
  }

  return rem_chars
}