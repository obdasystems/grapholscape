import Grapholscape from '../../core';
import { LifecycleEvent } from "../../model";
import { createEntitiesList, search } from '../util/search-entities';
import GscapeExplorer from "./ontology-explorer";

export default function (ontologyExplorerComponent: GscapeExplorer, grapholscape: Grapholscape) {
  // let languages = grapholscape.languages
  let entities = createEntitiesList(grapholscape, ontologyExplorerComponent.searchEntityComponent)

  // ontologyExplorerComponent.onToggleBody = closeAllSubRows.bind(this)
  ontologyExplorerComponent.entities = entities

  ontologyExplorerComponent.onNodeNavigation = (entityOccurrence) => {
    grapholscape.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, 1.2)
    grapholscape.selectElement(entityOccurrence.elementId)
  }

  ontologyExplorerComponent.searchEntityComponent.onSearch(e => {
    const inputElement = e.target as HTMLInputElement

    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur();
      inputElement.value = ''
      ontologyExplorerComponent.entities = entities
      return
    }

    if (inputElement.value?.length > 2) {
      ontologyExplorerComponent.entities = search(inputElement.value, entities)
    } else {
      ontologyExplorerComponent.entities = entities
    }
  })

  ontologyExplorerComponent.searchEntityComponent.onEntityFilterToggle(() => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape, ontologyExplorerComponent.searchEntityComponent)
  })

  grapholscape.on(LifecycleEvent.RendererChange, () => {
    entities = ontologyExplorerComponent.entities = createEntitiesList(grapholscape, ontologyExplorerComponent.searchEntityComponent)
  })
}

