import { Grapholscape } from "../core";
import { EntityViewDataUnfolding } from "../ui/view-model";
import { GrapholEntity, GrapholTypesEnum } from "../model";
import { EntityViewData } from "../ui";

export function grapholEntityToEntityViewData(grapholEntity: GrapholEntity, grapholscape: Grapholscape): EntityViewData {
  return {
    displayedName: grapholEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
    value: grapholEntity
  }
}

export function getEntityViewDataUnfolding(entity: GrapholEntity, grapholscape: Grapholscape, hasUnfoldings?: (iri: string, type: GrapholTypesEnum) => boolean ) {
  let hasAnyUnfolding = true

  if (hasUnfoldings) {
    entity.types.forEach(type => {
      hasAnyUnfolding = hasAnyUnfolding && hasUnfoldings(entity.iri.fullIri, type)
    })
  } else {
    hasAnyUnfolding = false
  }
  

  return {
    entityViewData: grapholEntityToEntityViewData(entity, grapholscape),
    hasUnfolding:hasAnyUnfolding
  } as EntityViewDataUnfolding
}