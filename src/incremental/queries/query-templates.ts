const LABEL_AVAILABLE = false

export function getInstances(iri: string, limit: number, searchText?: string) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`
  const filter = searchText ? `regex(?x, '${searchText}')` : ``
  const optional = LABEL_AVAILABLE ? `?x rdf:label ?l` : ``

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
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