import Grapholscape from "../../core/grapholscape";
import { Annotation, GrapholEntity, Iri } from "../../model";
import { entityModelToViewData } from "../../util/model-obj-transformations";
import getEntityViewOccurrences, { DiagramViewData, OccurrenceIdViewData } from "../util/get-entity-view-occurrences";
import GscapeExplorer, { EntityViewData } from "./ontology-explorer";

export default function (ontologyExplorerComponent: GscapeExplorer, grapholscape: Grapholscape) {
  // let languages = grapholscape.languages
  const entities = createEntitiesList(grapholscape.ontology.entities)

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



  // grapholscape.onRendererChange(() => {
  //   closeAllSubRows()
  //   entities = ontologyExplorerComponent.predicates = createEntitiesList(grapholscape.ontology.entities)
  // })


  function createEntitiesList(entities: Map<string, GrapholEntity>) {
    const result: EntityViewData[] = []
    entities.forEach(entity => result.push({
      value: entity,
      viewOccurrences: getEntityViewOccurrences(entity, grapholscape)
    }))

    return result.sort((a, b) => a.value.iri.remainder.localeCompare(b.value.iri.remainder))

    // let result = Object.keys(entities).map(iri => {
    //   return entities[iri].map( (entity, i) => {
    //     let entityViewData = entityModelToViewData(entity, languages)
    //     entityViewData.diagram_name = grapholscape.ontology.getDiagram(entityViewData.diagram_id).name

    //     // the first entity occurrence will have the state of subrows wrapper, open or closed
    //     if (i === 0) {
    //       entityViewData.areSubrowsOpen = false
    //     }

    //     return entityViewData
    //   })
    // })

    //   return result.sort((a, b) => a[0].displayed_name.localeCompare(b[0].displayed_name))
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

  // function closeAllSubRows() {
  //   ontologyExplorerComponent.predicates.forEach( entityOccurr => {
  //     if (entityOccurr[0].areSubrowsOpen) {
  //       entityOccurr[0].areSubrowsOpen = false
  //       const entityRow = ontologyExplorerComponent.shadowRoot
  //         .querySelector(`.row[iri = '${entityOccurr[0].iri.fullIri}']`)

  //       entityRow.classList.remove('add-shadow')
  //       entityRow.parentNode
  //         .querySelector('.sub-rows-wrapper')
  //         .classList.add('hide')
  //     }
  //   })
  //   ontologyExplorerComponent.requestUpdate()
  // }
}

