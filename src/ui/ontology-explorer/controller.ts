import Grapholscape from "../../core/grapholscape";
import { Annotation, GrapholEntity, Iri, LifecycleEvent } from "../../model";
import getEntityViewOccurrences from "../util/get-entity-view-occurrences";
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

  ontologyExplorerComponent.search = e => {
    // on ESC key press
    if (e.keyCode == 27) {
      e.target.blur()
      e.target.value = null
      ontologyExplorerComponent.entities = entities
      return
    }

    if (e.target.value?.length > 2) {
      ontologyExplorerComponent.entities = search(e.target.value)
    } else {
      ontologyExplorerComponent.entities = entities
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, () => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape.ontology.entities)
  })


  function createEntitiesList(entities: Map<string, GrapholEntity>) {
    const result: EntityViewData[] = []
    entities.forEach(entity => result.push({
      value: entity,
      viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
    }))

    return result.sort((a, b) => a.value.iri.remainder.localeCompare(b.value.iri.remainder))
  }

  /**
   * 
   * @param {string} searchValue
   * @returns {string[]} array of IRI strings
   */
  function search(searchValue: string) {

    return entities.filter(entity => {
      for (const word of searchValue.split(' ')) {
        if (word.length <= 2) return false
        return matchInIRI(entity.value.iri, word) ||
          matchInAnnotations(entity.value.getAnnotations(), word)
      }
      return false
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

