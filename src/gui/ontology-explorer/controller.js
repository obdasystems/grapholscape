import { entityModelToViewData } from "../../util/model-obj-transformations";

export default function(ontologyExplorerComponent, grapholscape) {
  let languages = grapholscape.languages
  
  ontologyExplorerComponent.predicates = createEntitiesDict(grapholscape.ontology.getEntities())
  ontologyExplorerComponent.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID)


  grapholscape.onRendererChange( () => {
    ontologyExplorerComponent.predicates = createEntitiesDict(grapholscape.ontology.getEntities())
    ontologyExplorerComponent.requestUpdate()
  })


  function createEntitiesDict(entities) {
    let result = Object.keys(entities).map( iri => {
      return { 
        occurrences : entities[iri].map( entity => {
          let entityViewData = entityModelToViewData(entity, languages)
          entityViewData.diagram_name = grapholscape.ontology.getDiagram(entityViewData.diagram_id).name

          return entityViewData
        })
      }
    })

    
    return result.sort( (a,b) => a.occurrences[0].displayed_name.localeCompare(b.occurrences[0].displayed_name) )
  }
}

