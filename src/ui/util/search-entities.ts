import Grapholscape from "../../core"
import { AnnotatedElement, Annotation, GrapholEntity, GrapholTypesEnum, Iri } from "../../model"
import getEntityViewOccurrences, { DiagramViewData, OccurrenceIdViewData } from "./get-entity-view-occurrences"


export type EntityViewData = {
  displayedName: string,
  value: { iri: Iri, type: GrapholTypesEnum } & AnnotatedElement, // GrapholEntity is a compatible type
  viewOccurrences?:  Map<DiagramViewData, OccurrenceIdViewData[]>
}

export interface IEntityFilters {
  [GrapholTypesEnum.CLASS]?: Boolean
  [GrapholTypesEnum.DATA_PROPERTY]?: Boolean
  [GrapholTypesEnum.OBJECT_PROPERTY]?: Boolean
  [GrapholTypesEnum.INDIVIDUAL]?: Boolean,
  areAllFiltersDisabled: boolean,
}

export function createEntitiesList(grapholscape: Grapholscape, entityFilters: IEntityFilters) {
  const result: EntityViewData[] = []
  grapholscape.ontology.entities.forEach(entity => {
    if (entityFilters[entity.type] !== undefined && (entityFilters[entity.type] || entityFilters.areAllFiltersDisabled)) {     
      result.push({
        displayedName: entity.getDisplayedName(
          grapholscape.entityNameType,
          grapholscape.language, 
          grapholscape.ontology.languages.default
          ),
        value: entity,
        viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
      })
    }
  })

  return result.sort( (a,b) => a.displayedName.localeCompare(b.displayedName))
}

export function search(searchValue: string, entities: EntityViewData[]) {
  const searchWords = searchValue.split(' ')

  return entities.filter(entity => {
    let isAmatch = true
    for (const word of searchWords) {
      if (word.length <= 2) continue
      isAmatch = isAmatch && (matchInIRI(entity.value.iri, word) ||
        matchInAnnotations(entity.value.getAnnotations(), word))
    }
    return isAmatch
  })


  function matchInIRI(iri: Iri, searchValue: string) {
    return isMatch(iri.fullIri, searchValue) || isMatch(iri.prefixed, searchValue)
  }

  function matchInAnnotations(annotations: Annotation[], searchValue: string) {
    // search in labels defined in annotations (only for Graphol v3)
    for (const annotation of annotations) {
      return isMatch(annotation.lexicalForm, searchValue)
    }

    return false // only if no language has a match
  }

  function isMatch(value1: string, value2: string) { return value1.toLowerCase().includes(value2.toLowerCase()) }
}