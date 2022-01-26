import { entityModelToViewData, cyToGrapholElem } from '../../util/model-obj-transformations'

/**
 * @param {import('./index').default} entityDetailsComponent
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(entityDetailsComponent, grapholscape) {
  entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
  entityDetailsComponent.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID)
  entityDetailsComponent.languageSelected = grapholscape.languages.selected

  grapholscape.onEntitySelection(entity => {
    let entityViewData = entityModelToViewData(entity, grapholscape.languages)

    entityViewData.occurrences = grapholscape.ontology.getEntityOccurrences(entityViewData.iri.fullIri).map(elem => {
      const grapholElem = cyToGrapholElem(elem)
      return {
        id: grapholElem.data.id,
        id_xml: grapholElem.data.id_xml,
        diagram_id: grapholElem.data.diagram_id,
        diagram_name: grapholscape.ontology.getDiagram(grapholElem.data.diagram_id).name
      }
    })

    entityDetailsComponent.entity = entityViewData
    entityDetailsComponent.show()
  })

  grapholscape.onNodeSelection(node => {
    let grapholNode = cyToGrapholElem(node)
    if (!grapholNode.isEntity()) entityDetailsComponent.hide()
  })

  grapholscape.onEdgeSelection(edge => {
    let grapholEdge = cyToGrapholElem(edge)
    if (!grapholEdge.isEntity()) entityDetailsComponent.hide()
  })

  grapholscape.onLanguageChange(language => {
    entityDetailsComponent.languageSelected = language
  })
}