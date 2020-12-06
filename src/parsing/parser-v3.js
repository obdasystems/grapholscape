export let warnings = new Set()

export function getOntologyInfo(xmlDocument) {
  let project = xmlDocument.getElementsByTagName('project')[0]
  let ontology_languages = xmlDocument.getElementsByTagName('languages')[0].children
  let iri = getTag(xmlDocument, 'ontology').getAttribute('iri')
  let iri_elem = getIriElem(iri, xmlDocument)

  return {
    name : project.getAttribute('name'),
    version : project.getAttribute('version'),
    iri : iri,
    languages : [...ontology_languages].map(lang => lang.textContent),
    default_language : getTag(xmlDocument, 'ontology').getAttribute('lang'),
    other_infos : getIriAnnotations(iri_elem)
  }
}

export function getIriPrefixesDictionary(xmlDocument) {
  let result = []
  let prefixes = getTag(xmlDocument, 'prefixes').children
  for (const p of prefixes) {
    result.push({
      prefixes : [getTagText(p, 'value')],
      value : getTagText(p, 'namespace'),
      standard : false,
    })
  }
  return result
}

export function getIri(element, ontology) {
  let iri_infos = {}

  let node_iri = getTagText(element, 'iri') || ''
  if (node_iri) {
    iri_infos.full_iri = node_iri
    // prefix
    let destructured_iri = ontology.destructureIri(node_iri)
    if (destructured_iri.namespace) {
      iri_infos.prefix = destructured_iri.prefix.length > 0 ? destructured_iri.prefix+':' : destructured_iri.prefix
      iri_infos.remaining_chars = destructured_iri.rem_chars
    } else {
      this.warnings.add(`Namespace not found for [${node_iri}]. The prefix "undefined" has been assigned`)
      iri_infos.prefix = 'undefined:'
      iri_infos.remaining_chars = node_iri
    }
  }
  return iri_infos
}

export function getLabel(element, ontology, xmlDocument) {
  let constructors_labels = {
    'union' : 'or',
    'intersection' : 'and',
    'role-chain' : 'chain',
    'role-inverse' : 'inv',
    'complement' : 'not',
    'datatype-restriction' : 'data',
    'enumeration' : 'oneOf',
    'has-key' : 'key',
  }

  // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
  if (element.getAttribute('type') === 'facet' ) {
    let constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'))
    constraining_facet = constraining_facet.prefix + ':' + constraining_facet.rem_chars

    let value = getTagText(element, 'lexicalForm')

    // unused to be compliant to Graphol-V2
    //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
    //datatype = datatype.prefix + ':' + datatype.rem_chars

    return constraining_facet + '^^"' + value +'"'
  }

  let label = getTagText(element, 'label')
  if (label) return label

  let iri = getTagText(element, 'iri')
  // constructors node do not have any iri
  if (!iri) {
    return constructors_labels[element.getAttribute('type')]
  }

  // build prefixed iri to be used in some cases
  let destructured_iri = ontology.destructureIri(iri)
  let name = destructured_iri.rem_chars || iri
  let prefix = destructured_iri.prefix || 'undefined'
  let prefixed_iri = prefix + ':' + name
  // datatypes always have prefixed iri as label
  if (element.getAttribute('type') == 'value-domain') {
    return prefixed_iri
  }
  let iri_xml_elem = getIriElem(element, xmlDocument)
  if (!iri_xml_elem) {
    return iri == name ? iri : prefixed_iri
  }

  let label_property_iri = ontology.getIriFromPrefix('rdfs').value + 'label'
  let annotations = getTag(iri_xml_elem, 'annotations')
  let labels = {}
  if (annotations) {
    for (let annotation of annotations.children) {
      if (getTagText(annotation, 'property') == label_property_iri) {
        // add label for a given language only if it doesn't already exist
        labels[getTagText(annotation, 'language')] =
          labels[getTagText(annotation, 'language')] || getTagText(annotation, 'lexicalForm')
      }
    }
  }

  // if no label annotation, then use prefixed label
  return Object.keys(labels).length ? labels : prefixed_iri
}

export function getPredicateInfo(element, xmlDocument) {
  let result = {}
  let actual_iri_elem = getIriElem(element, xmlDocument)
  result = getIriAnnotations(actual_iri_elem)

  if (actual_iri_elem && actual_iri_elem.children) {
    for(let property of actual_iri_elem.children) {
      if (property.tagName != 'value' && property.tagName != 'annotations' &&
          property.textContent != '0') {
        result[property.tagName] =  1
      }
    }
  }

  return result
}

function getIriAnnotations(iri) {
  let result = {}
  result.description = {}
  result.annotations = {}

  let annotations = getTag(iri, 'annotations')
  let language, annotation_kind, lexicalForm
  if (annotations) {
    for(let annotation of annotations.children) {
      annotation_kind = getRemainingChars(getTagText(annotation,'property'))
      language = getTagText(annotation, 'language')
      lexicalForm = getTagText(annotation, 'lexicalForm')
      if (annotation_kind == 'comment') {
        if (!result.description[language])
          result.description[language] = []

        // for comments allow multiple comments for same language
        result.description[language].push(lexicalForm)
      } else {
        if (!result.annotations[annotation_kind])
          result.annotations[annotation_kind] = {}

        // take only one annotation for each language
        if (!result.annotations[annotation_kind][language])
          result.annotations[annotation_kind][language] = lexicalForm
      }
    }
  }

  return result
}

/**
 * Retrieve the xml tag element in a xml root element
 * @param {*} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {*} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 */
export function getTag(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName[n]))
    return root.getElementsByTagName(tagName)[n]
}

/**
 * Retrieve the text inside a given tag in a xml root element
 * @param {*} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {*} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 */
export function getTagText(root, tagName, n = 0) {
  if (root && root.getElementsByTagName(tagName)[n])
    return root.getElementsByTagName(tagName)[n].textContent
}

function getIriElem(node, xmlDocument) {
  let node_iri = null

  if (typeof(node) === 'string')
    node_iri = node
  else
    node_iri = getTagText(node, 'iri')

  if (!node_iri) return null
  let iris = xmlDocument.getElementsByTagName('iris')[0].children
  for (let iri of iris) {
    if(node_iri == getTagText(iri, 'value')) {
      return iri
    }
  }

  return null
}

function getRemainingChars(iri) {
  let rem_chars = iri.slice(iri.lastIndexOf('#') + 1)
  // if rem_chars has no '#' then use '/' as separator
  if (rem_chars.length == iri.length) {
    rem_chars = iri.slice(iri.lastIndexOf('/') + 1)
  }

  return rem_chars
}