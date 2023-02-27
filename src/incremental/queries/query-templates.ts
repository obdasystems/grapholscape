const LABEL_AVAILABLE = false

export function getInstances(iri: string, maxResults?: number, searchText?: string) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?x, '${searchText}', 'i')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}', 'i') && !isBlank(?l))`

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

export function getInstancesByPropertyValue(classIri: string, propertyIri: string, propertyValue: string, maxResults?:number) {
  const select = `?x`
  const where = [
    `?x a <${classIri}>.`,
    `?x <${propertyIri}> ?y.`
  ]
  let filter = `FILTER(regex(?y, '${propertyValue}', 'i'))`
  const limit = maxResults ? `LIMIT ${maxResults}` : ``

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
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

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri: string, isDirect: boolean, maxResults?: number, searchText?: string) {
  const select = LABEL_AVAILABLE ? `?y ?l` : `?y`
  let where = isDirect ? `<${instanceIri}> <${objectPropertyIri}> ?y.` : `?y <${objectPropertyIri}> <${instanceIri}>.`
    where += `?y a <${rangeTypeClassIri}>.`

  const optional = LABEL_AVAILABLE ? `?y rdf:label ?l` : ``
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?y, '${searchText}', 'i')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}', 'i') && !isBlank(?l))`

    filter += `)`
  }
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