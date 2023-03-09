import Grapholscape from "../../core"
import { AnnotatedElement, Annotation, GrapholEntity, GrapholTypesEnum, Iri, RendererStatesEnum } from "../../model"
import grapholEntityToEntityViewData from "../../util/graphol-entity-to-entity-view-data"
import getEntityViewOccurrences, { DiagramViewData, OccurrenceIdViewData } from "./get-entity-view-occurrences"


export type EntityViewData = {
  displayedName: string,
  value: { iri: Iri, type: GrapholTypesEnum } & AnnotatedElement, // GrapholEntity is a compatible type
  viewOccurrences?: Map<DiagramViewData, OccurrenceIdViewData[]>
}

export interface IEntityFilters { // use numbers to work as DOM attributes
  [GrapholTypesEnum.CLASS]?: number
  [GrapholTypesEnum.DATA_PROPERTY]?: number
  [GrapholTypesEnum.OBJECT_PROPERTY]?: number
  [GrapholTypesEnum.INDIVIDUAL]?: number
  areAllFiltersDisabled: boolean
}

export function createEntitiesList(grapholscape: Grapholscape, entityFilters?: IEntityFilters) {
  const result: EntityViewData[] = []
  grapholscape.ontology.entities.forEach(entity => {
    if (!shouldFilterEntity(entity, entityFilters)) {
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

  if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    grapholscape.incremental?.classInstanceEntities.forEach(classInstanceEntity => {
      if (grapholscape.renderer.diagram && !shouldFilterEntity(classInstanceEntity, entityFilters)) {
        const viewClassInstanceEntity = grapholEntityToEntityViewData(classInstanceEntity, grapholscape)
        viewClassInstanceEntity.viewOccurrences = new Map()
        viewClassInstanceEntity.viewOccurrences.set(
          {
            id: grapholscape.renderer.diagram?.id,
            name: grapholscape.renderer.diagram?.name
          },
          [
            {
              originalId: viewClassInstanceEntity.value.iri.prefixed,
              realId: viewClassInstanceEntity.value.iri.fullIri
            }
          ]
        )

        result.push(viewClassInstanceEntity)
      }
    })
  }

  return result.sort((a, b) => a.displayedName.localeCompare(b.displayedName))
}

function shouldFilterEntity(entity: GrapholEntity, entityFilters?: IEntityFilters) {
  if (!entityFilters) return false

  return !entityFilters.areAllFiltersDisabled && entityFilters[entity.type] !== 1 && entityFilters[entity.type] !== true
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