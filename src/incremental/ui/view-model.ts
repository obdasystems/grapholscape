import { EntityViewData } from "../../ui"

export type ViewIncrementalObjectProperty = ViewIncrementalEntityData & {
  // objectProperty: EntityViewData,
  connectedClasses: ViewIncrementalEntityData[],
  direct: boolean,
}

export type ViewIncrementalEntityData = {
  entityViewData: EntityViewData,
  loading?:boolean,
  hasUnfolding?: boolean,
}