const LABEL_AVAILABLE = true

const LIMIT = 500

export function getInstances(iri: string, searchText?: string, maxResults?: number | 'unlimited', includeLabels = true) {
  const select = LABEL_AVAILABLE && includeLabels ? `?x ?l` : `?x`
  const where = `?x a <${iri}>.`

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ?x rdfs:label ?l.
      ${searchText ? `FILTER(regex(?l, '${searchText}', 'i'))` : ''}
    }
    ${maxResults !== 'unlimited' ? `LIMIT ${maxResults || LIMIT}` : ''}
  `
}

export function getInstancesByObjectProperty(classIri: string, propertyIri: string, propertyValue: string, maxResults?: number) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = [
    `?x a <${classIri}>.`,
    `?x <${propertyIri}> ?y.`
  ]

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
      ?x rdfs:label ?l.
      ?y rdfs:label ?ly.
      FILTER (regex(?ly, "${propertyValue}", "i"))
    }
    LIMIT ${maxResults || LIMIT}
  `
}

export function getInstancesByDataPropertyValue(classIri: string, propertyIri: string, propertyValue: string, maxResults?: number) {
  const select = LABEL_AVAILABLE ? `?x ?l` : `?x`
  const where = [
    `?x a <${classIri}>.`,
    `?x <${propertyIri}> ?y.`
  ]

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where.join('\n')}
      ?x rdfs:label ?l.
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

export function getInstancesObjectPropertyRanges(instanceIri: string, objectPropertyIri: string, rangeTypeClassIri?: string, isDirect: boolean = true, dataPropertyIriFilter?: string, searchText?: string, maxResults?: number,) {
  const select = LABEL_AVAILABLE ? `?y ?l` : `?y`
  let where = isDirect ? `<${instanceIri}> <${objectPropertyIri}> ?y.` : `?y <${objectPropertyIri}> <${instanceIri}>.`

  if (rangeTypeClassIri)
    where += `?y a <${rangeTypeClassIri}>.`

  if (dataPropertyIriFilter) {
    where += `?y <${dataPropertyIriFilter}> ?z.`
  }

  // if there is a filter on a data property, use search text on this value
  // otherwise use searchtext to filter on label
  let filter = dataPropertyIriFilter
    ? `FILTER(regex(?z, "${searchText}", "i"))`
    : `FILTER(regex(?l, "${searchText}", "i"))`

  return `
    SELECT DISTINCT ${select}
    WHERE {
      ${where}
      ?y rdfs:label ?l.
      ${filter}
    }
    LIMIT ${maxResults || LIMIT}
  `
}

export function getInstanceLabels(instanceIri: string) {  
  return `
    SELECT DISTINCT ?l
    WHERE {
      <${instanceIri}> rdfs:label ?l
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
