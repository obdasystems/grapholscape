const LABEL_AVAILABLE = false

export function getInstances(iri: string, maxResults?: number, searchText?: string) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?x, '${searchText}')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}') && !isBlank(?l))`

    filter += `)`
  }
  const optional = LABEL_AVAILABLE ? `OPTIONAL { ?x rdf:label ?l }` : ``
  const limit = maxResults ? `LIMIT ${maxResults}` : ``

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    ${limit}
  `
}

export function getInstanceDataPropertyValue(instanceIri: string, dataPropertyIri: string) {
  return `
    SELECT DISTINCT ?y
    WHERE {
      <${instanceIri}> <${dataPropertyIri}> ?y.
    }
  `
}

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri: string, maxResults?: number, searchText?: string) {
  const select = LABEL_AVAILABLE ? `?y ?l` : `?y`
  const where = `<${instanceIri}> <${objectPropertyIri}> ?y.
    ?y a <${rangeTypeClassIri}>.`

  const optional = LABEL_AVAILABLE ? `?y rdf:label ?l` : ``
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?y, '${searchText}')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}') && !isBlank(?l))`

    filter += `)`
  }
  const limit = maxResults ? `LIMIT ${maxResults}` : ``

  return `
    SELECT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    ${limit}
  `

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