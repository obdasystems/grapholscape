import { EntityViewData } from "../../ui"

export type ViewIncrementalObjectProperty = {
  objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  loading?:boolean,
  direct: boolean
}