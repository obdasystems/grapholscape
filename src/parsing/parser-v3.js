import Iri from '../model/iri'

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
  let prefixes = xmlDocument.getElementsByTagName('prefixes')[0].children
  prefixes.forEach( p => {
    result.push({
      prefixes : [p.getElementsByTagName('value')[0].textContent],
      value : p.getElementsByTagName('namespace')[0].textContent,
      standard : false,
    })
  })
  return result
}

export function getIri(element, ontology) {
  let iri_infos = {}
  if(!element.getElementsByTagName('iri')[0])
    return iri_infos

  let node_iri = element.getElementsByTagName('iri')[0].textContent

  let iri = ontology.getIriFromValue(Iri.getNamespace(node_iri))
  iri_infos.full_iri = node_iri
  iri_infos.prefix = iri.prefixes[0].length > 0 ? iri.prefixes[0]+':' : iri.prefixes[0]
  iri_infos.remaining_chars = Iri.getRemainingChars(node_iri)
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
    'enumeration' : 'oneOf'
  }

  let label = element.getElementsByTagName('label')[0]
  if (!label) return undefined
  if (label.textContent) return label.textContent

  // constructors node do not have any iri
  if (!element.getElementsByTagName('iri')[0]) {
    return constructors_labels[element.getAttribute('type')]
  }

  // build prefixed iri to be used in some cases
  let iri = element.getElementsByTagName('iri')[0].textContent
  let namespace = Iri.getNamespace(iri)
  let name = iri.slice(namespace.length)
  let prefix = ontology.getIriFromValue(namespace).prefixes[0]

  // datatypes always have prefixed iri as label
  if (element.getAttribute('type') == 'value-domain') {
    return prefix + ':' + name
  }
  let iri_elem = getIriElem(element, xmlDocument)
  if (!iri_elem) return undefined

  let label_property_iri = ontology.getIriFromPrefix('rdfs').value + 'label'
  let annotations = iri_elem.getElementsByTagName('annotations')[0]
  let labels = {}
  let language
  if (annotations) {
    annotations = annotations.children
    for (let annotation of annotations) {
      if (annotation.getElementsByTagName('property')[0].textContent == label_property_iri) {
        language = annotation.getElementsByTagName('language')[0].textContent
        labels[language] = annotation.getElementsByTagName('lexicalForm')[0].textContent
      }
    }
  }

  // if no label annotation, then use prefixed label
  return Object.keys(labels).length ? labels : prefix + ':' + name
}

export function getPredicateInfo(element, xmlDocument, ontology) {
  let result = {}
  let actual_iri_elem = getIriElem(element, xmlDocument)
  result = getIriAnnotations(actual_iri_elem)

  for(let property of actual_iri_elem.children) {
    if (property.tagName != 'value' && property.tagName != 'annotations') {
      result[property.tagName] = parseInt(property.textContent) || 0
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
      annotation_kind = Iri.getRemainingChars(getTagText(annotation,'property'))
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

        // take only one annotation for language
        if (!result.annotations[annotation_kind][language])
          result.annotations[annotation_kind][language] = lexicalForm
      }
    }
  }

  return result
}

function getTag(root, tagName, n = 0) {
  return root.getElementsByTagName(tagName)[n]
}

function getTagText(root, tagName, n = 0) {
  if (root.getElementsByTagName(tagName)[n])
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