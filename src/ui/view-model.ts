import { DiagramViewData, OccurrenceIdViewData } from "."
import { Iri, GrapholTypesEnum, AnnotatedElement } from "../model"

export type ViewObjectPropertyUnfolding = EntityViewDataUnfolding & {
  // objectProperty: EntityViewData,
  connectedClasses: EntityViewDataUnfolding[],
  direct: boolean,
}

export type EntityViewDataUnfolding = {
  entityViewData: EntityViewData,
  loading?: boolean,
  hasUnfolding?: boolean,
}

export type EntityViewData = {
  displayedName: string,
  value: { iri: Iri, types: Set<GrapholTypesEnum> } & AnnotatedElement, // GrapholEntity is a compatible type
  viewOccurrences?: Map<DiagramViewData, OccurrenceIdViewData[]>
}

export interface IEntityFilters { // use numbers to work as DOM attributes
  [GrapholTypesEnum.CLASS]?: number
  [GrapholTypesEnum.DATA_PROPERTY]?: number
  [GrapholTypesEnum.OBJECT_PROPERTY]?: number
  [GrapholTypesEnum.INDIVIDUAL]?: number
  areAllFiltersDisabled: boolean
}