import { Grapholscape } from "../../core";
import { LifecycleEvent, RendererStatesEnum } from "../../model";
import { createEntitiesList } from "../util/search-entities";
import { GscapeEntitySelector } from "./entity-selector";

export default function init(entitySelectorComponent: GscapeEntitySelector, grapholscape: Grapholscape) {
  // Set class entity list
  let entities = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false } )

  entitySelectorComponent.entityList = entities

  // grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
  //   if (newRendererState === RendererStatesEnum.INCREMENTAL && grapholscape.renderer.grapholElements?.size === 0) {
  //     entitySelectorComponent.show()
  //   }
  // })

  grapholscape.on(LifecycleEvent.EntityNameTypeChange, () => {
    entities = createEntitiesList(grapholscape, { class: 1, areAllFiltersDisabled: false } )
    entitySelectorComponent.entityList = entities
  })

}