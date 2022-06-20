import Grapholscape from '../../core/grapholscape'
import { LifecycleEvent } from '../../model'
import { entityModelToViewData, cyToGrapholElem } from '../../util/model-obj-transformations'
import { ViewItemWithIri } from '../common/annotations-template'
import GscapeEntityDetails from './entity-details'

/**
 * @param {import('./index').default} entityDetailsComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (entityDetailsComponent: GscapeEntityDetails, grapholscape: Grapholscape) {
  // entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
  entityDetailsComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }
  entityDetailsComponent.language = grapholscape.language
  entityDetailsComponent.diagramNames = grapholscape.ontology.diagrams.map(d => { return { 'id': d.id, 'name': d.name } })

  grapholscape.on(LifecycleEvent.EntitySelection, entity => {
    entityDetailsComponent.grapholEntity = entity
    entityDetailsComponent.show()
  })

  grapholscape.on(LifecycleEvent.NodeSelection, _ => {
    entityDetailsComponent.hide()
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, _ => {
    entityDetailsComponent.hide()
  })

  grapholscape.on(LifecycleEvent.LanguageChange, language => {
    entityDetailsComponent.language = language
  })

//   /**
//    * 
//    * @param {import('cytoscape').CollectionReturnValue} entity
//    */
//   function entityModelToViewData(entity) {
//     let entityViewData = entityModelToViewData(entity, grapholscape.languages)

//     entityViewData.occurrences = grapholscape.ontology.getEntityOccurrences(entityViewData.iri.fullIri).map(elem => {
//       const grapholElem = cyToGrapholElem(elem)
//       return {
//         id: grapholElem.data.id,
//         id_xml: grapholElem.data.id_xml,
//         diagram_id: grapholElem.data.diagram_id,
//         diagram_name: grapholscape.ontology.getDiagram(grapholElem.data.diagram_id).name
//       }
//     })

//     entityDetailsComponent.entity = entityViewData
//     entityDetailsComponent.show()
//   }

}