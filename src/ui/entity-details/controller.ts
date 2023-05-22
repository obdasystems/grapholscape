import Grapholscape from '../../core'
import { GrapholEntity, LifecycleEvent, RendererStatesEnum } from '../../model'
import getEntityViewOccurrences from '../util/get-entity-view-occurrences'
import GscapeEntityDetails from './entity-details'

export default function (entityDetailsComponent: GscapeEntityDetails, grapholscape: Grapholscape) {
  // entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
  entityDetailsComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }
  entityDetailsComponent.language = grapholscape.language

  entityDetailsComponent.setGrapholEntity = setGrapholEntity

  grapholscape.on(LifecycleEvent.EntitySelection, setGrapholEntity)

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
    if (entityDetailsComponent.grapholEntity && grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity, grapholscape)

    entityDetailsComponent.showOccurrences = grapholscape.renderState !== RendererStatesEnum.INCREMENTAL
  })


  function setGrapholEntity(entity: GrapholEntity) {
    entityDetailsComponent.grapholEntity = entity
    entityDetailsComponent.occurrences = getEntityViewOccurrences(entity, grapholscape)
    entityDetailsComponent.language = grapholscape.language
    entityDetailsComponent.show()

    if (grapholscape.lifecycle.entityWikiLinkClick.length > 0 && !entityDetailsComponent.onWikiLinkClick) {
      entityDetailsComponent.onWikiLinkClick = (iri: string) => {
        grapholscape.lifecycle.trigger(LifecycleEvent.EntityWikiLinkClick, iri)
      }
    }
  }

}