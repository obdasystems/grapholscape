const LABEL_AVAILABLE = true

const LIMIT = 500

export function getInstances(iri: string, searchText?: string, maxResults?: number) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${getOptionalLabel('?x', '?l', where)}
      ${getFilterOnIriOrLabel('?x', '?l', searchText)}
    }
    LIMIT ${maxResults || LIMIT}
  `
}

export function getInstancesByPropertyValue(classIri: string, propertyIri: string, propertyValue: string, maxResults?: number) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = [
    `?x a <${classIri}>.`,
    `?x <${propertyIri}> ?y.`
  ]

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
      ${getOptionalLabel('?x', '?l', where.join('\n'))}
      FILTER (regex(?y, "${propertyValue}", "i"))
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

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri?: string, isDirect: boolean = true, propertyIriFilter?: string, searchText?: string, maxResults?: number,) {
  const select = LABEL_AVAILABLE ? `?y ?l` : `?y`
  let where = isDirect ? `<${instanceIri}> <${objectPropertyIri}> ?y.` : `?y <${objectPropertyIri}> <${instanceIri}>.`

  if (rangeTypeClassIri)
    where += `?y a <${rangeTypeClassIri}>.`

  if (propertyIriFilter) {
    where += `?y <${propertyIriFilter}> ?z.`
  }

  // if there is a filter on a data/object property, use search text on this value
  // otherwise use searchtext to filter on iri or label
  let filter = propertyIriFilter
    ? `FILTER(regex(?z, "${searchText}", "i"))`
    : getFilterOnIriOrLabel('?y', '?l', searchText)

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ${getOptionalLabel("?y", "?l", where)}
      ${filter}
    }
    LIMIT ${maxResults || LIMIT}
  `
}

export function getInstanceLabels(instanceIri: string) {  
  return `
    SELECT DISTINCT ?l
    WHERE {
      ?x rdfs:label ?l
      FILTER(?x = <${instanceIri}>)
    }
  `
}

function getFilterOnIriOrLabel(subjectVariable: string, labelVariable: string, filterValue?: string): string {
  if (!filterValue) return ''

  let filter = `FILTER(regex(${subjectVariable}, '${filterValue}', 'i')`
  if (LABEL_AVAILABLE)
    filter += `|| (regex(${labelVariable}, '${filterValue}', 'i') && !isBlank(${labelVariable}))`

  filter += `)`

  return filter
}

function getOptionalLabel(subjectVariable: string, labelVariable: string, where: string) {
  return LABEL_AVAILABLE ? `OPTIONAL { 
    ${where}
    ${subjectVariable} rdfs:label ${labelVariable} 
  }` : ``
}
