import Ontology from '../model'
import { AnnotationsKind } from '../model/annotated-element'
import Annotation from '../model/graphol-elems/annotation'
import { Functionalities } from '../model/graphol-elems/entity'
import Iri from '../model/iri'
import Namespace from '../model/namespace'
import { Type } from '../model/node-enums'
import * as ParserUtil from './parser_util'

export let warnings = new Set()

export function getOntologyInfo(xmlDocument: XMLDocument) {
  let xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0]
  let ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent
  let ontology_version = ''

  if (xml_ontology_tag.getElementsByTagName('version')[0]) {
    ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent
  } else {
    ontology_version = 'Undefined'
  }

  return new Ontology(ontology_name, ontology_version)
}

export function getNamespaces(xmlDocument: XMLDocument) {
  let result: Namespace[] = []

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
    // for old graphol files
    result.push(new Namespace([''], xmlDocument.getElementsByTagName('iri')[0].textContent, false))
  } else {
    let iri_prefixes
    let iri_value, is_standard, prefixes, properties
    let iris = xmlDocument.getElementsByTagName('iri')
    // Foreach iri create a Iri object
    for (let iri of iris) {
      iri_value = iri.getAttribute('iri_value')
      is_standard = false
      prefixes = iri.getElementsByTagName('prefix')
      iri_prefixes = []
      for (let prefix of prefixes) {
        iri_prefixes.push(prefix.getAttribute('prefix_value'))
      }

      if(iri_prefixes.length == 0)
        iri_prefixes.push('')

      // check if it's a standard iri
      properties = iri.getElementsByTagName('property')
      for (let property of properties) {
        is_standard = property.getAttribute('property_value') == 'Standard_IRI'
      }

      result.push(iri_prefixes, iri_value, is_standard)
    }
  }

  return result
}

export function getIri(element: Element, ontology: Ontology) {
  let labelElement = element.getElementsByTagName('label')[0]
  if (!labelElement)
    return undefined

  let label = labelElement.textContent.replace(/\n/g, '')
  let splitted_label = label.split(':')
  // if no ':' in label, then use empty prefix
  let node_prefix_iri = splitted_label.length > 1 ? splitted_label[0] : ''
  let namespace, rem_chars
  // facets
  if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
    rem_chars = label
    namespace = ''
    node_prefix_iri = node_prefix_iri.slice(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1)
  } else {
    rem_chars = splitted_label.length > 1 ? label.slice(label.indexOf(':')+1) : label
    namespace = ontology.getNamespaceFromPrefix(node_prefix_iri)

    if (!namespace && ParserUtil.isPredicate(element)) {
      this.warnings.add(`The prefix "${node_prefix_iri}" is not associated to any namespace`)
    }

    namespace = namespace ? namespace.value : ''
  }

  return new Iri(namespace+rem_chars, ontology.namespaces)

  // iri_infos.remainingChars = rem_chars
  // iri_infos.prefix = node_prefix_iri
  // iri_infos.fullIri = namespace + rem_chars
  // iri_infos.namespace = namespace
  // iri_infos.prefixed = node_prefix_iri + ':' + rem_chars
  // return iri_infos
}

export function getFacetDisplayedName(element:Element) {
  if (element.getElementsByTagName('label')[0])
    // language undefined for v2 = ''
    return element.getElementsByTagName('label')[0].textContent
  else return undefined
}

export function getFunctionalities(element: Element, xmlDocument: XMLDocument) {
  let result: Functionalities[] = []
  const labelNoBreak = element.getElementsByTagName('label')[0].textContent.replace(/\n/g, '')

  // for searching predicates' functionalities in graphol v2
  const xmlPredicates = xmlDocument.getElementsByTagName('predicate')
  const type = element.getAttribute('type')

  for (let predicateXml of xmlPredicates) {
    if (labelNoBreak === predicateXml.getAttribute('name') && type === predicateXml.getAttribute('type')) {

      Object.values(Functionalities).forEach(functionalityKind => {
        const value = parseInt(predicateXml.getElementsByTagName(functionalityKind)[0].textContent)

        if (value !== 0)
          result.push(functionalityKind)
      })

      break
    }
  }

  return result
}

export function getEntityAnnotations(element: Element, xmlDocument: XMLDocument) {
  let result: Annotation[] = []

  const label = element.getElementsByTagName('label')[0].textContent
  const labelNoBreak = label.replace(/\n/g, '')
  // push label annotation
  result.push(new Annotation(AnnotationsKind.label, label))

  // for searching predicates' description in graphol v2
  const xmlPredicates = xmlDocument.getElementsByTagName('predicate')

  for (let predicateXml of xmlPredicates) {
    if (labelNoBreak === predicateXml.getAttribute('name') && element.getAttribute('type') === predicateXml.getAttribute('type')) {
      let description = predicateXml.getElementsByTagName('description')[0]?.textContent?.replace(/font-size:0pt/g, '')
      if (description) {
        let bodyStartIndex = description.indexOf('<p')
        let bodyEndIndex = description.indexOf('</body')
        description = description.slice(bodyStartIndex, bodyEndIndex)

        result.push(new Annotation(AnnotationsKind.comment, description))
      }
      break
    }
  }

  return result
}
