import Grapholscape from '../../core';
import { Annotation, GrapholEntity, Iri, LifecycleEvent } from "../../model";
import getEntityViewOccurrences from "../util/get-entity-view-occurrences";
import GscapeEntitySearch, { IEntityFilters } from "./entity-search-component";
import GscapeExplorer, { EntityViewData } from "./ontology-explorer";

export default function (ontologyExplorerComponent: GscapeExplorer, grapholscape: Grapholscape) {
  // let languages = grapholscape.languages
  let entities = createEntitiesList(grapholscape.ontology.entities)

  // ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this)
  ontologyExplorerComponent.entities = entities

  ontologyExplorerComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }

  ontologyExplorerComponent.searchEntityComponent.onSearch(e => {
    const inputElement = e.target as HTMLInputElement

    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur();
      inputElement.value = null
      ontologyExplorerComponent.entities = entities
      return
    }

    if (inputElement.value?.length > 2) {
      ontologyExplorerComponent.entities = search(inputElement.value)
    } else {
      ontologyExplorerComponent.entities = entities
    }
  })

  ontologyExplorerComponent.searchEntityComponent.onEntityFilterToggle(() => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape.ontology.entities)
  })

  grapholscape.on(LifecycleEvent.RendererChange, () => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape.ontology.entities)
  })


  function createEntitiesList(entities: Map<string, GrapholEntity>) {
    const result: EntityViewData[] = []
    entities.forEach(entity => {
      if (ontologyExplorerComponent.searchEntityComponent[entity.type] === true) {
        result.push({
          value: entity,
          viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
        })
      }
    })

    return result.sort((a, b) => a.value.iri.remainder.localeCompare(b.value.iri.remainder))
  }

  function search(searchValue: string) {
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
}

