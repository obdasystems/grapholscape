import Grapholscape from '../../core/grapholscape'
import { LifecycleEvent } from '../../model'
import getEntityViewOccurrences from '../util/get-entity-view-occurrences'
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

  grapholscape.on(LifecycleEvent.EntitySelection, entity => {
    entityDetailsComponent.grapholEntity = entity
    entityDetailsComponent.occurrences = getEntityViewOccurrences(entity, grapholscape)
    entityDetailsComponent.language = grapholscape.language
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
      entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity, grapholscape)
  })
}