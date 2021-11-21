import { entityModelToViewData } from "../../util/model-obj-transformations";

/**
 * 
 * @param {import('./ontology-explorer').default} ontologyExplorerComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (ontologyExplorerComponent, grapholscape) {
  let languages = grapholscape.languages
  let entities = createEntitiesList(grapholscape.ontology.entities)

  ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this)
  ontologyExplorerComponent.predicates = entities

  ontologyExplorerComponent.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID)
  ontologyExplorerComponent.search = e => {
    closeAllSubRows()
    // on ESC key press
    if (e.keyCode == 27) {
      e.target.blur()
      ontologyExplorerComponent.collapseBody()
      return
    }

    let iris = search(e.target.value)
    ontologyExplorerComponent.showBody()
    if (iris.length > 0) {
      ontologyExplorerComponent.predicates = iris
    } else {
      // if no results, show all entities
      ontologyExplorerComponent.predicates = entities
    }
  }



  grapholscape.onRendererChange(() => {
    ontologyExplorerComponent.predicates = entities
    ontologyExplorerComponent.requestUpdate()
  })

  /**
   * 
   * @param {import("cytoscape").CollectionReturnValue} entities 
   * @returns {Object[][]}
   */
  function createEntitiesList(entities) {
    let result = Object.keys(entities).map(iri => {
      return entities[iri].map( (entity, i) => {
        let entityViewData = entityModelToViewData(entity, languages)
        entityViewData.diagram_name = grapholscape.ontology.getDiagram(entityViewData.diagram_id).name

        // the first entity occurrence will have the state of subrows wrapper, open or closed
        if (i === 0) {
          entityViewData.areSubrowsOpen = false
        }

        return entityViewData
      })
    })

    return result.sort((a, b) => a[0].displayed_name.localeCompare(b[0].displayed_name))
  }

  /**
   * 
   * @param {string} searchValue
   * @returns {string[]} array of IRI strings
   */
  function search(searchValue) {

    return entities.filter(iriOccurrences => {
      let entity = iriOccurrences[0]
      for (const word of searchValue.split(' ')) {
        if (word.length <= 2) return
        return matchInIRI(entity.iri, word) ||
          matchInLabel(entity.annotations?.label, word)
      }
      return false
    })


    function matchInIRI(iri, searchValue) {
      let prefixed = iri.prefix + ':' + iri.remainingChars
      return isMatch(iri.fullIri, searchValue) || isMatch(prefixed, searchValue)
    }

    function matchInLabel(labels, searchValue) {
      // search in labels defined in annotations (only for Graphol v3)
      for (const language in labels) {
        let found = labels[language].some(label => isMatch(label, searchValue))
        // if you return [found] directly you'll skip other languages if it is false!
        if (found) return true
      }

      return false // only if no language has a match
    }

    function isMatch(value1, value2) { return value1.toLowerCase().includes(value2.toLowerCase()) }
  }

  function closeAllSubRows() {
    ontologyExplorerComponent.predicates.forEach( entityOccurr => {
      if (entityOccurr[0].areSubrowsOpen) {
        entityOccurr[0].areSubrowsOpen = false
        const entityRow = ontologyExplorerComponent.shadowRoot
          .querySelector(`.row[iri = '${entityOccurr[0].iri.fullIri}']`)
        
        entityRow.classList.remove('add-shadow')
        entityRow.parentNode
          .querySelector('.sub-rows-wrapper')
          .classList.add('hide')
      }
    })
    ontologyExplorerComponent.requestUpdate()
  }
}

