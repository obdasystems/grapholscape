import { entityModelToViewData } from "../../util/model-obj-transformations";

/**
 * 
 * @param {import('./ontology-explorer').default} ontologyExplorerComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(ontologyExplorerComponent, grapholscape) {
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

  

  grapholscape.onRendererChange( () => {
    ontologyExplorerComponent.predicates = entities
    ontologyExplorerComponent.requestUpdate()
  })

  /**
   * 
   * @param {import("cytoscape").CollectionReturnValue} entities 
   * @returns {Object[][]}
   */
  function createEntitiesList(entities) {
    let result = Object.keys(entities).map( iri => {
      return entities[iri].map( entity => {
        let entityViewData = entityModelToViewData(entity, languages)
        entityViewData.diagram_name = grapholscape.ontology.getDiagram(entityViewData.diagram_id).name

        return entityViewData
      })
    })

    return result.sort( (a,b) => a[0].displayed_name.localeCompare(b[0].displayed_name) )
  }

  /**
   * 
   * @param {string} searchValue
   * @returns {string[]} array of IRI strings
   */
  function search(searchValue) {
    
    return entities.filter( iriOccurrences => {
      let entity = iriOccurrences[0]
      for (const word of searchValue.split(' ')) {
        if (word.length <= 2) return
        return matchInIRI(entity.iri, word) ||
          matchInLabelV2(entity.label, word) ||
          matchInLabelV3(entity.annotations?.label, word)
      }
      return false
    })


    function matchInIRI(iri, searchValue) {
      let prefixed = iri.prefix + ':' + iri.remainingChars
      return isMatch(iri.fullIri, searchValue) || isMatch(prefixed, searchValue)
    }

    function matchInLabelV2(label, searchValue) {
      return isMatch(label, searchValue)
    }

    function matchInLabelV3(labels, searchValue) {
      // search in labels defined in annotations (only for Graphol v3)
      for (const language in labels ) {
        let found = labels[language].some(label => isMatch(label, searchValue))
        // if you return [found] directly you'll skip other languages if it is false!
        if (found) return true
      }

      return false // only if no language has a match
    }

    function isMatch(value1, value2) { return value1.toLowerCase().includes(value2.toLowerCase()) }
  }

  function closeAllSubRows() {
    ontologyExplorerComponent.shadowRoot.querySelectorAll('.sub-rows-wrapper.open').forEach(subrow => {
      let entityRow = subrow.parentElement
      entityRow.querySelector('.row').classList.remove('add-shadow')
      entityRow.querySelector('mwc-icon').innerHTML = 'keyboard_arrow_right'
      subrow.classList.add('hide')
      subrow.classList.remove('open')
    })
  }
}

