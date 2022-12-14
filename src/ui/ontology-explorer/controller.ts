import Grapholscape from '../../core';
import { LifecycleEvent } from "../../model";
import { SearchEvent } from '../common/text-search/entity-text-search';
import { EntityFilterEvent } from '../common/text-search/entity-type-filters';
import { createEntitiesList, EntityViewData, search } from '../util/search-entities';
import GscapeExplorer from "./ontology-explorer";

export default function (ontologyExplorerComponent: GscapeExplorer, grapholscape: Grapholscape) {
  let entities: EntityViewData[] = []
  // let languages = grapholscape.languages
  ontologyExplorerComponent.entities = createEntitiesList(grapholscape)

  // ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this)
  ontologyExplorerComponent.entities = entities

  ontologyExplorerComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }

  ontologyExplorerComponent.addEventListener('onentityfilterchange', (e: EntityFilterEvent) => {
    ontologyExplorerComponent.entities = createEntitiesList(grapholscape, e.detail)
  })

  grapholscape.on(LifecycleEvent.RendererChange, () => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape, ontologyExplorerComponent.searchEntityComponent)
  })
}

