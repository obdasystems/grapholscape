import GscapeEntityDetails from "./entity-details"
import init from './controller'

export { GscapeEntityDetails }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initEntityDetails(grapholscape) {
  const entityDetailsComponent = new GscapeEntityDetails()
  init(entityDetailsComponent, grapholscape)
  grapholscape.widgets.ENTITY_DETAILS = entityDetailsComponent
}