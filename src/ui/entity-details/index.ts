import GscapeEntityDetails from "./entity-details"
import init from './controller'
import Grapholscape from "../../core/grapholscape"
import { WidgetEnum } from "../util/widget-enum"

export { GscapeEntityDetails }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initEntityDetails(grapholscape: Grapholscape) {
  const entityDetailsComponent = new GscapeEntityDetails()
  init(entityDetailsComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.ENTITY_DETAILS, entityDetailsComponent)
}