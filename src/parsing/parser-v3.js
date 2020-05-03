import Iri from '../model/iri'

export function getOntologyInfo(xmlDocument) {
  let project = xmlDocument.getElementsByTagName('project')[0]
  let ontology_name = project.getAttribute('name')
  let ontology_version = project.getAttribute('version')

  return {
    name : ontology_name,
    version : ontology_version
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
  if (annotations) {      
    annotations = annotations.children
    for (let annotation of annotations) {
      if (annotation.getElementsByTagName('property')[0].textContent == label_property_iri) {
        return annotation.getElementsByTagName('lexicalForm')[0].textContent
      }
    }
  }
  
  // No label annotation, then use prefixed label
  return prefix + ':' + name
}

function getIriElem(node, xmlDocument) {
  // search label in iris
  let node_iri = node.getElementsByTagName('iri')[0]
  if (!node_iri) return null
  let iris = xmlDocument.getElementsByTagName('iris')[0].children
  node_iri = node_iri.textContent
  for (let iri of iris) {
    if(node_iri == iri.getElementsByTagName('value')[0].textContent) {
      return iri
    }
  }

  return null
}

export function getPredicateInfo(element, xmlDocument, ontology) {
  let result = {}
  let description_iri = ontology.getIriFromPrefix('rdfs').value + 'comment'
  let actual_iri_elem = getIriElem(element, xmlDocument)
  let annotations = actual_iri_elem.getElementsByTagName('annotations')[0]
  if (annotations) {
    annotations = annotations.children
    for(let annotation of annotations) {
      if (annotation.getElementsByTagName('property')[0].textContent == description_iri) {
        result.description = annotation.getElementsByTagName('lexicalForm')[0].textContent
        break
      }
    }
  }

  for(let property of actual_iri_elem.children) {
    if (property.tagName != 'value' && property.tagName != 'annotations') {
      result[property.tagName] = parseInt(property.textContent) || 0
    }
  }

  return result
}