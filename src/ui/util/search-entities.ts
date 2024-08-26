import Grapholscape from "../../core"
import { Annotation, GrapholEntity, Iri } from "../../model"
import { EntityViewData, IEntityFilters } from "../view-model"
import getEntityViewOccurrences from "./get-entity-view-occurrences"

export function createEntitiesList(grapholscape: Grapholscape, entityFilters?: IEntityFilters) {
  const result: EntityViewData[] = []
  grapholscape.ontology.entities.forEach(entity => {
    if (!shouldFilterEntity(entity, entityFilters)) {
      result.push({
        displayedName: entity.getDisplayedName(
          grapholscape.entityNameType,
          grapholscape.language
        ),
        value: entity,
        viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
      })
    }
  })

  return result.sort((a, b) => a.displayedName.localeCompare(b.displayedName))
}

function shouldFilterEntity(entity: GrapholEntity, entityFilters?: IEntityFilters) {
  if (!entityFilters) return false

  let typeFilterEnabled = true
  entity.types.forEach(type => {
    typeFilterEnabled = typeFilterEnabled && entityFilters[type] !== 1 && entityFilters[type] !== true
  })

  return !entityFilters.areAllFiltersDisabled && typeFilterEnabled
}

export function search(searchValue: string, entities: EntityViewData[], includeLabels = false, includeComments = false, includeIri = false) {
  const searchWords = searchValue.split(' ')

  return new Promise<EntityViewData[]>((resolve) => {
    const result = entities.filter(entity => {
      let isAmatch = true
      let isCurrentAMatch = false
      for (const word of searchWords) {
        if (word.length <= 2) continue
        isCurrentAMatch = 
          isMatch(entity.displayedName, word) ||
          (includeLabels && matchInAnnotations(entity.value.getLabels(), word)) ||
          (includeComments && matchInAnnotations(entity.value.getComments(), word)) ||
          (includeIri && matchInIRI(entity.value.iri, word))
        isAmatch = isAmatch && isCurrentAMatch
      }
      return isAmatch
    })

    resolve(result)
  })

  function matchInIRI(iri: Iri, searchValue: string) {
    return isMatch(iri.fullIri, searchValue) || isMatch(iri.prefixed, searchValue)
  }

  function matchInAnnotations(annotations: Annotation[], searchValue: string) {
    // search in labels defined in annotations (only for Graphol v3)
    for (const annotation of annotations) {
      if (isMatch(annotation.value, searchValue))
        return true
    }

    return false // only if no language has a match
  }

  function isMatch(value1: string, value2: string) { return value1.toLowerCase().includes(value2.toLowerCase()) }
}