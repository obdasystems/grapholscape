import Grapholscape from '../../core';
import { LifecycleEvent } from "../../model";
import { EntityFilterEvent } from '../common/text-search/entity-type-filters';
import { createEntitiesList } from '../util/search-entities';
import { IEntityFilters } from '../view-model';
import GscapeExplorer from "./ontology-explorer";

export default function (ontologyExplorerComponent: GscapeExplorer, grapholscape: Grapholscape) {
  ontologyExplorerComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }

  ontologyExplorerComponent.addEventListener('onentityfilterchange', (e: EntityFilterEvent) => {
    ontologyExplorerComponent.entities = createEntitiesList(grapholscape, e.detail)
  })

  ontologyExplorerComponent.onTogglePanel = () => {
    if (ontologyExplorerComponent.entities.length === 0) {
      updateEntityList()
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, () => {
    updateEntityList(ontologyExplorerComponent.searchEntityComponent)
  })

  grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
    updateEntityList(ontologyExplorerComponent.searchEntityComponent)
  })

  function updateEntityList(entityFilters?: IEntityFilters) {
    ontologyExplorerComponent.loading = true
    setTimeout(() => {
      ontologyExplorerComponent.entities = createEntitiesList(grapholscape, entityFilters)
      ontologyExplorerComponent.loading = false
    }, 0)
  }
}

