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

    if (grapholscape.lifecycle.entityWikiLinkClick.length > 0 && !entityDetailsComponent.onWikiLinkClick) {
      entityDetailsComponent.onWikiLinkClick = (iri: string) => {
        grapholscape.lifecycle.trigger(LifecycleEvent.EntityWikiLinkClick, iri)
      }
    }
  })

  grapholscape.on(LifecycleEvent.NodeSelection, node => {
    if (!node.isEntity())
      entityDetailsComponent.hide()
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, edge => {
    if (!edge.isEntity())
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