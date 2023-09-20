import { DiagramViewData, OccurrenceIdViewData } from "."
import { AnnotatedElement, Iri, TypesEnum } from "../model"

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
  value: { iri: Iri, types: Set<TypesEnum> } & AnnotatedElement, // GrapholEntity is a compatible type
  viewOccurrences?: Map<DiagramViewData, OccurrenceIdViewData[]>,
  disabled?: boolean,
}

export interface IEntityFilters { // use numbers to work as DOM attributes
  [TypesEnum.CLASS]?: number
  [TypesEnum.DATA_PROPERTY]?: number
  [TypesEnum.OBJECT_PROPERTY]?: number
  [TypesEnum.INDIVIDUAL]?: number
  areAllFiltersDisabled: boolean
}