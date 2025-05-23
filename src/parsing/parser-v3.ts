import { FunctionalityEnum, Ontology, TypesEnum, Annotation, Iri } from '../model'
import Namespace from '../model/namespace'
export let warnings = new Set()

export function getOntologyInfo(xmlDocument: XMLDocument) {
  let project = getTag(xmlDocument, 'project')
  let ontology_languages = getTag(xmlDocument, 'languages')?.children
  let iri = getTag(xmlDocument, 'ontology')?.getAttribute('iri')

  const ontology = new Ontology(project?.getAttribute('name') || '', project?.getAttribute('version') || '', iri || undefined)

  if (ontology_languages)
    ontology.languages = [...ontology_languages].map(lang => lang.textContent).filter(l => l !== null) as string[] || []

  ontology.defaultLanguage = getTag(xmlDocument, 'ontology')?.getAttribute('lang') || ontology.languages[0]
  if (iri) {
    ontology.annotations = getIriAnnotations(iri, xmlDocument, getNamespaces(xmlDocument))
  }
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
      if (typeof(prefixValue) === 'string' && namespaceValue) {
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
 * 
 * @param {Element} element 
 * @param {Ontology} ontology
 * @returns {string}
 */
export function getFacetDisplayedName(element: Element, ontology: Ontology) {
  // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2
  if (element.getAttribute('type') === TypesEnum.FACET) {
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
 * @param {Element} xmlDocument 
 * @returns {FunctionalityEnum[]}
 */
export function getFunctionalities(element: Element, xmlDocument: XMLDocument): FunctionalityEnum[] {
  let result: FunctionalityEnum[] = []
  let current_iri_elem = getIriElem(element, xmlDocument)

  let elementType: TypesEnum | undefined
  switch (element.getAttribute('type')) {
    case 'concept':
      elementType = TypesEnum.CLASS
      break

    case 'role':
      elementType = TypesEnum.OBJECT_PROPERTY
      break

    case 'attribute':
      elementType = TypesEnum.DATA_PROPERTY
      break
  }

  if (elementType === TypesEnum.OBJECT_PROPERTY || elementType === TypesEnum.DATA_PROPERTY) {
    if (current_iri_elem && current_iri_elem.children) {
      for (let property of current_iri_elem.children) {

        const functionality = Object.values(FunctionalityEnum).find(f => f.toString() === property.tagName)
        if (functionality) {
          result.push(functionality)
        }
      }
    }
  }
  return result
}

export function getEntityAnnotations(element: Element, xmlDocument: XMLDocument, namespaces: Namespace[]) {
  const entityIri = getTagText(element, 'iri')
  if (entityIri)
    return getIriAnnotations(entityIri, xmlDocument, namespaces)
  else
    return []
}

function getIriAnnotations(iri: string, xmlDocument: XMLDocument, namespaces: Namespace[]): Annotation[] {
  let result: Annotation[] = []
  const iriElem = getIriElem(iri, xmlDocument)

  if (iriElem) {
    let annotations = getTag(iriElem, 'annotations')
    let language: string | null | undefined
    let property: string | null | undefined
    let lexicalForm: string | null | undefined
    let iri: string | null | undefined

    if (annotations) {
      for (let annotation of annotations.children) {
        property = getTagText(annotation, 'property')
        language = getTagText(annotation, 'language') || undefined
        lexicalForm = getTagText(annotation, 'lexicalForm') || undefined
        iri = getTagText(annotation, 'iri') || undefined

        if (property && (lexicalForm || iri))
          if (lexicalForm)
            result.push(new Annotation(new Iri(property, namespaces), lexicalForm, language))
          else if (iri)
            result.push(new Annotation(new Iri(property, namespaces), new Iri(iri, namespaces), language))
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