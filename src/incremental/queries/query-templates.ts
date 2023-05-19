import escapeRegex from "../../util/escape-regex"

const LIMIT = 1000

const getLimit = (customLimit?: number | 'unlimited') => customLimit !== 'unlimited' ? `LIMIT ${customLimit || LIMIT}` : ''

/**
 * 1-2
 * Fetch instances of a given type
 * @param classIRI class type of the instances
 * @param includeLabels retrieve labels or not, default: true
 * @param maxResults if 'unlimited', no limit is set. default: 1000
 * @returns 
 */
export function getInstances(classIRI: string, includeLabels = true, maxResults?: number | 'unlimited') {
  return `
  SELECT DISTINCT ${includeLabels ? '?x ?lx' : '?x'}
  WHERE {
    ?x a <${encodeURI(classIRI)}>;
       ${includeLabels ? `rdfs:label ?lx` : ``}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 3
 * 
 * Fetch instances of a given type, filtering by their label
 * @param classIRI class type of the instances
 * @param searchText the text to search in labels
 * @param maxResults if 'unlimited', no limit is set. default: 1000
 * @returns 
 */
export function getInstancesByLabel(classIRI: string, searchText: string, maxResults?: number | 'unlimited') {
  return `
  SELECT DISTINCT ?x ?lx
  WHERE {
    ?x a <${encodeURI(classIRI)}>;
       rdfs:label ?lx.
    ${getSearchFilters('?lx', searchText)}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 4
 * 
 * Fetch instances of a given type, filtering by their IRI
 * @param classIRI class type of the instances
 * @param searchText the text to search in IRIs
 * @param maxResults if 'unlimited', no limit is set. default: 1000
 * @returns  
 */
export function getInstancesByIRI(classIRI: string, searchText: string, maxResults?: number | 'unlimited') {
  return `
  SELECT DISTINCT ?x
  WHERE {
    ?x a <${encodeURI(classIRI)}>.
    ${getSearchFilters('?x', searchText)}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 5-6
 * 
 * Fetch instances of a given type and filter by the value of a given data property.
 * @param classIRI class type of the instances
 * @param dataPropertyIRI the data property on which the filter must be done
 * @param searchText the text to search in the values of the data property
 * @param includeLabels retrieve labels or not, default: true
 * @param maxResults if 'unlimited', no limit is set. default: 1000
 * @returns 
 */
export function getInstancesByDataProperty(classIRI: string, dataPropertyIRI: string, searchText: string, includeLabels = true, maxResults?: number | 'unlimited') {
  return `
  SELECT DISTINCT ${includeLabels ? '?x ?lx ?y' : '?x ?y'}
  WHERE {
    ?x a <${encodeURI(classIRI)}>;
       <${encodeURI(dataPropertyIRI)}> ?y;
       ${includeLabels ? `rdfs:label ?lx` : ``}
    ${getSearchFilters('?y', searchText)}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 7-8
 * 
 * Fetch instances of a given type such that they participate in a object property with
 * another instance whose label contains a given search text.
 * 
 * @param classIri class type of the instances
 * @param objectPropertyIRI the object property on which the filter must be done
 * @param searchText the text to search in the label of the instances participating in the object property
 * @param isDirect whether the object property is direct or inverse default: true (direct)
 * @param includeLabels retrieve labels or not, default: true
 * @param maxResults if 'unlimited', no limit is set. default: 1000
 * @returns 
 */
export function getInstancesByObjectProperty(classIri: string, objectPropertyIRI: string, searchText: string, isDirect = true, includeLabels = true, maxResults?: number) {
  return `
  SELECT DISTINCT ${includeLabels ? '?x ?lx ?y ?ly' : '?x ?y ?ly'}
  WHERE {
    ?x a <${encodeURI(classIri)}>;
       ${includeLabels ? 'rdfs:label ?lx' : ''}.
       
    ${!isDirect
      ? `?y <${encodeURI(objectPropertyIRI)}> ?x.`
      : `?x <${encodeURI(objectPropertyIRI)}> ?y.`
    }
       
    ?y rdfs:label ?ly.
    ${getSearchFilters('?ly', searchText)}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 9
 * 
 * Get values of a data property for a given instance
 * @param instanceIRI
 * @param dataPropertyIRI
 * @returns 
 */
export function getInstanceDataPropertyValues(instanceIRI: string, dataPropertyIRI: string) {
  return `
  SELECT DISTINCT ?y
  WHERE {
    <${encodeURI(instanceIRI)}> <${encodeURI(dataPropertyIRI)}> ?y
  }
  LIMIT 10
  `
}

/**
 * 10-11
 * 
 * Get instances of a given type participating to an object property with a given instance
 * @param instanceIRI the starting instance
 * @param objectPropertyIRI the object property connecting the instances
 * @param rangeTypeClassesIri the type of instances to retrieve 
 * @param isDirect whether the object property is direct or inverse default: true (direct)
 * @param includeLabels retrieve labels or not, default: true
 * @param maxResults default: 1000
 * @returns 
 */
export function getInstancesThroughObjectProperty(instanceIRI: string, objectPropertyIRI: string, rangeTypeClassesIri?: string[], isDirect = true, includeLabels = true, maxResults?: number) {
  return `
  SELECT DISTINCT ?y ${includeLabels ? '?ly' : ''}
  WHERE {
    ${!isDirect
      ? `?y <${encodeURI(objectPropertyIRI)}> <${encodeURI(instanceIRI)}>.`
      : `<${encodeURI(instanceIRI)}> <${encodeURI(objectPropertyIRI)}> ?y.`
    }
    
    ${rangeTypeClassesIri && rangeTypeClassesIri.length === 1 ? `?y a <${encodeURI(rangeTypeClassesIri[0])}>.` : ''}
    ${includeLabels ? '?y rdfs:label ?ly' : ''}
    ${rangeTypeClassesIri && rangeTypeClassesIri.length > 1 ? getTypeListFilter('?y', rangeTypeClassesIri) : ''}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 12
 * 
 * Get instances of a given type participating to an object property with a given instance,
 * filtering by their label
 * @param instanceIRI the starting instance
 * @param objectPropertyIRI the object property connecting the instances
 * @param searchText the text to search in the label of results
 * @param rangeTypeClassesIri the type of instances to retrieve
 * @param isDirect whether the object property is direct or inverse default: true (direct)
 * @param maxResults default: 1000
 * @returns 
 */
export function getInstancesThroughObjectPropertyByLabel(instanceIRI: string, objectPropertyIRI: string, searchText: string, rangeTypeClassesIri?: string[], isDirect = true, maxResults?: number) {
  return `
  SELECT DISTINCT ?y ?ly
  WHERE {
    ${!isDirect
      ? `?y <${encodeURI(objectPropertyIRI)}> <${encodeURI(instanceIRI)}>.`
      : `<${encodeURI(instanceIRI)}> <${encodeURI(objectPropertyIRI)}> ?y.`
    }
    
    ${rangeTypeClassesIri && rangeTypeClassesIri.length === 1 ? `?y a <${encodeURI(rangeTypeClassesIri[0])}>.` : ''}
    ?y rdfs:label ?ly.
    ${getSearchFilters('?ly', searchText)}
    ${rangeTypeClassesIri && rangeTypeClassesIri.length > 1 ? getTypeListFilter('?y', rangeTypeClassesIri) : ''}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 13
 * 
 * Get instances of a given type participating to an object property with a given instance,
 * filtering by their IRI
 * @param instanceIRI the starting instance
 * @param objectPropertyIRI the object property connecting the instances
 * @param searchText the text to search in the IRIs of results
 * @param rangeTypeClassesIri the type of instances to retrieve
 * @param isDirect whether the object property is direct or inverse default: true (direct)
 * @param maxResults default: 1000
 * @returns 
 */
export function getInstancesThroughObjectPropertyByIRI(instanceIRI: string, objectPropertyIRI: string, searchText: string, rangeTypeClassesIri?: string[], isDirect = true, maxResults?: number) {
  return `
  SELECT DISTINCT ?y
  WHERE {
    ${!isDirect
      ? `?y <${encodeURI(objectPropertyIRI)}> <${encodeURI(instanceIRI)}>.`
      : `<${encodeURI(instanceIRI)}> <${encodeURI(objectPropertyIRI)}> ?y.`
    }
    
    ${rangeTypeClassesIri && rangeTypeClassesIri.length === 1 ? `?y a <${encodeURI(rangeTypeClassesIri[0])}>.` : ''}
    ${getSearchFilters('?y', searchText)}
    ${rangeTypeClassesIri && rangeTypeClassesIri.length > 1 ? getTypeListFilter('?y', rangeTypeClassesIri) : ''}
  }
  ${getLimit(maxResults)}
  `
}

/**
 * 14-15
 * Get instances of a given type, participating in the object property (domain/range)
 * with a given instance and participating in a data property with a value matching
 * the searchText.
 * 
 * @param instanceIRI starting instance
 * @param objectPropertyIRI object properties connecting the instances
 * @param rangeTypeClassesIRI the type of instances to search
 * @param dataPropertyFilterIRI the data property on which the filter must be done
 * @param searchText the value to search in the data property range (attribute value)
 * @param isDirect whether the object property is direct or inverse default: true (direct)
 * @param includeLabels whether to include the label of retrieved instances or not, default: true
 * @param maxResults max number of results, default: 1000
 * @returns the SPARQL query code
 */
export function getInstancesThroughOPByDP(
  instanceIRI: string,
  objectPropertyIRI: string,
  rangeTypeClassesIRI: string[],
  dataPropertyFilterIRI: string,
  searchText: string,
  isDirect = true,
  includeLabels = true,
  maxResults?: number) {

  return `
  SELECT DISTINCT ${includeLabels ? '?y ?ly ?dp' : '?y ?dp'}
  WHERE {
    ${!isDirect
      ? `?y <${encodeURI(objectPropertyIRI)}> <${encodeURI(instanceIRI)}>.`
      : `<${encodeURI(instanceIRI)}> <${encodeURI(objectPropertyIRI)}> ?y.`
    }
    
    ?y ${rangeTypeClassesIRI.length === 1 ? `a <${encodeURI(rangeTypeClassesIRI[0])}>;` : ''}
       ${includeLabels ? 'rdfs:label ?ly;' : ''}
       <${encodeURI(dataPropertyFilterIRI)}> ?dp.
    ${getSearchFilters('?dp', searchText)}
    ${rangeTypeClassesIRI.length > 1 ? getTypeListFilter('?y', rangeTypeClassesIRI) : ''
  }
  ${getLimit(maxResults)}
  `
}

function getSearchFilters(variable: string, searchText: string) {
  const searchTexts = searchText.split(' ')
  const results: string[] = []
  searchTexts.forEach(text => {
    results.push(`regex(${variable}, '${escapeRegex(text.trim())}', 'i')`)
  })

  return `FILTER(${results.join('\n &&')})`
}

/**
 * Get all the labels defined on a instance
 * @param instanceIri 
 * @returns 
 */
export function getInstanceLabels(instanceIri: string) {
  return `
    SELECT DISTINCT ?l
    WHERE {
      <${encodeURI(instanceIri)}> rdfs:label ?l
    }
  `
}

function getTypeListFilter(variable: string, typesIRI: string[]) {
  return `FILTER(${variable} IN (${typesIRI.map(r => `<${r}>`).join(', ')}) )`
}
