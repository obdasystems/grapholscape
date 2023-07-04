import { GrapholEntity, GrapholTypesEnum, RendererStatesEnum } from "../model"

export default function getIdFromEntity(entity: GrapholEntity, diagramId: number, type: GrapholTypesEnum, rendererState = RendererStatesEnum.GRAPHOL) {
  let entityOccurrences = entity.getOccurrencesByType(type, rendererState)

  if (!entityOccurrences || entityOccurrences.length === 0)
    entityOccurrences =  entity.getOccurrencesByType(type, RendererStatesEnum.GRAPHOL)
  
  if (!entityOccurrences)
    return

  return entityOccurrences.find(o => o.diagramId === diagramId)?.id
}