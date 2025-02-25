import { DiagramViewData, OccurrenceIdViewData } from "."
import { GrapholEntity, TypesEnum } from "../model"
import { SHACLShapeTypeEnum } from "../model/rdf-graph/swagger"

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
  value: GrapholEntity,
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

export type SHACLShapeViewData = {
  type: SHACLShapeTypeEnum,
  constraintValue?: string[],
  path: string,
  targetClass?: GrapholEntity,
  property?: GrapholEntity,
}