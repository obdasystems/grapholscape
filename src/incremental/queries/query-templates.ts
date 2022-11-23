const LABEL_AVAILABLE = false

export function getInstances(iri: string, limit = 10, searchText?: string) {
  return !LABEL_AVAILABLE
    ? `
      SELECT DISTINCT ?x
      WHERE 
      { 
        ?x a <${iri}>.
        FILTER(regex(?x, 'VALORE_NEL_FILTRO_DI_RICERCA'))
      }
      LIMIT ${limit}
    `
    : `
      SELECT DISTINCT ?x ?l
      WHERE 
      { 
        ?x a <${iri}>.
        OPTIONAL {
          ?x rdf:label ?l
        }
        FILTER(regex(?x, '${searchText}') || (regex(?l, '${searchText}') && !isBlank(?l)))
      }
      LIMIT ${limit}
    `
}

export function getInstanceDataPropertyValue(instanceIri: string, dataPropertyIri: string) {
  return `
    SELECT DISTINCT ?y
    WHERE 
    { 
      <${instanceIri}> <${dataPropertyIri}> ?y. 
    }
  `
}

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri: string, limit = 10, searchText?: string) {
  return !LABEL_AVAILABLE
    ? `
      SELECT DISTINCT ?y
      WHERE 
      { 
        <${instanceIri}> <${objectPropertyIri}> ?y. 
        ?y a <${rangeTypeClassIri}>.
        FILTER(regex(?y, '${searchText}'))
      }
      LIMIT ${limit}
    `
    : `
      SELECT DISTINCT ?y ?l
      WHERE 
      { 
        <${instanceIri}> <${objectPropertyIri}> ?y. 
        ?y a <${rangeTypeClassIri}>.
        OPTIONAL {
          ?y rdf:label ?l
        }
        FILTER(regex(?y, '${searchText}') || (regex(?l, '${searchText}') && !isBlank(?l)))
      }
      LIMIT ${limit}
    `
}