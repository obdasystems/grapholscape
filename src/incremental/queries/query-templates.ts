const LABEL_AVAILABLE = true

const LIMIT = 500

export function getInstances(iri: string, searchText?: string, maxResults?: number) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?x, '${searchText}', 'i')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}', 'i') && !isBlank(?l))`

    filter += `)`
  }
  const optional = LABEL_AVAILABLE ? `OPTIONAL { ?x rdfs:label ?l }` : ``

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    LIMIT ${maxResults || LIMIT}
  `
}

export function getInstancesByPropertyValue(classIri: string, propertyIri: string, propertyValue: string, maxResults?: number) {
  const select = `?x`
  const where = [
    `?x a <${classIri}>.`,
    `?x <${propertyIri}> ?y.`
  ]
  let filter = `FILTER(regex(?y, '${propertyValue}', 'i'))`
  const optional = LABEL_AVAILABLE ? `OPTIONAL { ?y rdfss:label ?l }` : ``

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
      ${optional}
      ${filter}
    }
    LIMIT ${maxResults || LIMIT}
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

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri?: string, isDirect: boolean = true, searchText?: string, maxResults?: number,) {
  const select = LABEL_AVAILABLE ? `?y ?l` : `?y`
  let where = isDirect ? `<${instanceIri}> <${objectPropertyIri}> ?y.` : `?y <${objectPropertyIri}> <${instanceIri}>.`

  if (rangeTypeClassIri)
    where += `?y a <${rangeTypeClassIri}>.`

  const optional = LABEL_AVAILABLE ? `OPTIONAL { ?y rdfs:label ?l }` : ``
  let filter: string = ``
  if (searchText) {
    filter = `FILTER(regex(?y, '${searchText}', 'i')`
    if (LABEL_AVAILABLE)
      filter += `|| (regex(?l, '${searchText}', 'i') && !isBlank(?l))`

    filter += `)`
  }

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${optional}
      ${filter}
    }
    LIMIT ${maxResults || LIMIT}
  `
}