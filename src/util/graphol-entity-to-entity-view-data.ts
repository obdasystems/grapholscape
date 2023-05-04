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
  return {
    entityViewData: grapholEntityToEntityViewData(entity, grapholscape),
    hasUnfolding: hasUnfoldings && hasUnfoldings(entity.iri.fullIri, entity.type)
  } as EntityViewDataUnfolding
}