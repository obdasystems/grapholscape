import { Grapholscape } from "../core";
import { GrapholEntity, TypesEnum } from "../model";
import { EntityViewData } from "../ui";
import { EntityViewDataUnfolding } from "../ui/view-model";

export function grapholEntityToEntityViewData(grapholEntity: GrapholEntity, grapholscape: Grapholscape): EntityViewData {
  return {
    displayedName: grapholEntity.getDisplayedName(grapholscape.entityNameType, grapholscape.language),
    value: grapholEntity
  }
}

export function getEntityViewDataUnfolding(entity: GrapholEntity, grapholscape: Grapholscape, hasUnfoldings?: (iri: string, type: TypesEnum) => boolean ) {
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