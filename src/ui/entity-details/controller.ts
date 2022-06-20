import Grapholscape from '../../core/grapholscape'
import { GrapholEntity, LifecycleEvent } from '../../model'
import { entityModelToViewData, cyToGrapholElem } from '../../util/model-obj-transformations'
import { ViewItemWithIri } from '../common/annotations-template'
import GscapeEntityDetails, { DiagramViewData, OccurrenceIdViewData } from './entity-details'

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

  grapholscape.on(LifecycleEvent.EntitySelection, entity => {
    entityDetailsComponent.grapholEntity = entity
    entityDetailsComponent.occurrences = getEntityViewOccurrences(entity)
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

  grapholscape.on(LifecycleEvent.RendererChange, _ => {
    if (entityDetailsComponent.grapholEntity)
      entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity)
  })

  function getEntityViewOccurrences(grapholEntity: GrapholEntity): Map<DiagramViewData, OccurrenceIdViewData[]> {
    const result = new Map<DiagramViewData, OccurrenceIdViewData[]>()

    grapholEntity.occurrences.forEach((occurrencesInDiagramRepresentation, rendererState) => {
      occurrencesInDiagramRepresentation.forEach(occurrence => {
        const diagram = grapholscape.ontology.getDiagram(occurrence.diagramId)
        const cyElement = diagram.representations.get(grapholscape.renderState)?.cy.$id(occurrence.elementId)

        if (diagram && cyElement && !cyElement.empty()) {
          if (!Array.from(result.keys()).find(d => d.id === diagram.id)) {
            result.set({ id: diagram.id, name: diagram.name }, [])
          }

          /**
           * In case of repositioned or transformed elements, show the original id
           */
          const occurrenceIdViewData: OccurrenceIdViewData = {
            realId: occurrence.elementId,
            originalId: cyElement.data().originalId,
          }

          for (let [diagramViewData, occurrencesIdViewData] of result.entries()) {
            if (diagramViewData.id === diagram.id) {
              occurrencesIdViewData.push(occurrenceIdViewData)
              break
            }
          }
        }
      })
    })
    return result
  }

}