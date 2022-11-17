import { Grapholscape } from "../../core";
import { addFirstClassInIncremental } from "../../incremental";
import { GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../model";
import { createEntitiesList, search } from "../util/search-entities";
import GscapeEntitySelector from "./entity-selector";

export default function init(entitySelectorComponent: GscapeEntitySelector, grapholscape: Grapholscape) {
  entitySelectorComponent.searchEntityComponent["object-property"] = undefined
  entitySelectorComponent.searchEntityComponent["data-property"] = undefined
  entitySelectorComponent.searchEntityComponent["individual"] = undefined

  // Set class entity list
  // const entities = Array
  //   .from(grapholscape.ontology.entities)
  //   .filter(elem => elem[1].type === GrapholTypesEnum.CLASS)
  //   .sort((a, b) => a[1].iri.remainder.localeCompare(b[1].iri.remainder))
  //   .map(elem => elem[1].iri.prefixed)
  const entities = createEntitiesList(grapholscape, entitySelectorComponent.searchEntityComponent)

  entitySelectorComponent.entityList = entities

  if (grapholscape.renderState !== RendererStatesEnum.INCREMENTAL) {
    entitySelectorComponent.hide()
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    if (newRendererState === RendererStatesEnum.INCREMENTAL && grapholscape.renderer.grapholElements.size === 0) {
      entitySelectorComponent.show()
    }
  })

  entitySelectorComponent.onClassSelection(selectedClassIri => {
    addFirstClassInIncremental(selectedClassIri, grapholscape)

    entitySelectorComponent.hide()
  })

}