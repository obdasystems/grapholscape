import * as ParserUtil from './parser_util'

export let warnings = new Set()

export function getOntologyInfo(xmlDocument) {
  let xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0]
  let ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent
  let ontology_version = ''

  if (xml_ontology_tag.getElementsByTagName('version')[0]) {
    ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent
  } else {
    ontology_version = 'Undefined'
  }

  return {
    name : ontology_name,
    version: ontology_version,
    languages: [''],
  }
}

export function getIriPrefixesDictionary(xmlDocument) {
  let result = []

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
    // for old graphol files
    result.push({
      prefix : [''],
      value : xmlDocument.getElementsByTagName('iri')[0].textContent,
      standard: false
    })
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

      result.push({
        prefixes : iri_prefixes,
        value : iri_value,
        standard : is_standard
      })
    }
  }

  return result
}

export function getIri(element, ontology) {
  let iri_infos = {}
  let label = element.getElementsByTagName('label')[0]
  if (!label)
    return undefined

  label = label.textContent.replace(/\n/g, '')
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
    namespace = ontology.getIriFromPrefix(node_prefix_iri)

    if (!namespace && ParserUtil.isPredicate(element)) {
      this.warnings.add(`The prefix "${node_prefix_iri}" is not associated to any namespace`)
    }

    namespace = namespace ? namespace.value : ''
  }

  iri_infos.remaining_chars = rem_chars
  iri_infos.prefix = node_prefix_iri.length > 0 ? node_prefix_iri + ':' : node_prefix_iri
  iri_infos.full_iri = namespace + rem_chars
  return iri_infos
}

export function getLabel(element) {
  if (element.getElementsByTagName('label')[0])
    // language undefined for v2 = ''
    return { '' : element.getElementsByTagName('label')[0].textContent }
  else return undefined
}

export function getPredicateInfo(element, xmlDocument) {
  let result = {}
  let label_no_break = element.getElementsByTagName('label')[0].textContent.replace(/\n/g, '')
  let type = element.getAttribute('type')
  let description, start_body_index, end_body_index
  // for searching predicates' description in graphol v2
  let xmlPredicates = xmlDocument.getElementsByTagName('predicate')

  for (let predicateXml of xmlPredicates) {
    if (label_no_break === predicateXml.getAttribute('name') && type === predicateXml.getAttribute('type')) {
      description = predicateXml.getElementsByTagName('description')[0].textContent
      description = description.replace(/font-size:0pt/g, '')
      start_body_index = description.indexOf('<p')
      end_body_index = description.indexOf('</body')

      if (description)
        result.description = { '' : [description.slice(start_body_index, end_body_index)] }

      // Impostazione delle funzionalità dei nodi di tipo role o attribute
      if (type === 'attribute' || type === 'role') {
        result.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent)
      }

      if (type === 'role') {
        result.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent)
        result.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent)
        result.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent)
        result.reflexive = parseInt(predicateXml.getElementsByTagName('reflexive')[0].textContent)
        result.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent)
        result.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent)
      }
      break
    }
  }
  return result
}
