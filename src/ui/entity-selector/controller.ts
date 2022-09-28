import { Grapholscape } from "../../core";
import { addFirstClassInIncremental } from "../../incremental";
import { GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../model";
import GscapeEntitySelector from "./entity-selector";

export default function init(entitySelectorComponent: GscapeEntitySelector, grapholscape: Grapholscape) {
  entitySelectorComponent.searchEntityComponent["object-property"] = false
  entitySelectorComponent.searchEntityComponent["data-property"] = false
  entitySelectorComponent.searchEntityComponent["individual"] = false

  // Set class entity list
  entitySelectorComponent.entityList = Array
    .from(grapholscape.ontology.entities)
    .filter(elem => elem[1].type === GrapholTypesEnum.CLASS)
    .sort((a, b) => a[1].iri.remainder.localeCompare(b[1].iri.remainder))
    .map(elem => elem[1].iri.prefixed)

  if (grapholscape.renderState !== RendererStatesEnum.INCREMENTAL) {
    entitySelectorComponent.hide()
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    if (newRendererState === RendererStatesEnum.INCREMENTAL && grapholscape.renderer.grapholElements.size === 0) {
      entitySelectorComponent.show()
    }
  })

  entitySelectorComponent.onClassSelection(selectedClassIri => {
    addFirstClassInIncremental(
      selectedClassIri,
      grapholscape,
      grapholscape.renderer.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
    )

    entitySelectorComponent.hide()
  })
}