import { DiagramViewData, OccurrenceIdViewData } from "."
import { AnnotatedElement, Iri, TypesEnum } from "../model"

export type ViewObjectProperty = EntityViewData & {
  // objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  direct: boolean,
}

// export type EntityViewDataUnfolding = {
//   entityViewData: EntityViewData,
//   loading?: boolean,
// }

export type EntityViewData = {
  displayedName: string,
  value: { iri: Iri, types: TypesEnum[] } & AnnotatedElement, // GrapholEntity is a compatible type
  viewOccurrences?: Map<DiagramViewData, OccurrenceIdViewData[]>,
  disabled?: boolean,
  loading?: boolean,
}

export interface IEntityFilters { // use numbers to work as DOM attributes
  [TypesEnum.CLASS]?: number
  [TypesEnum.DATA_PROPERTY]?: number
  [TypesEnum.OBJECT_PROPERTY]?: number
  [TypesEnum.INDIVIDUAL]?: number
  areAllFiltersDisabled: boolean
}