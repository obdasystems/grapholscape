import GscapeEntityDetails from "./entity-details";
import init from './controller'

export { GscapeEntityDetails }

const entityDetailsComponent = new GscapeEntityDetails()

export function initEntityDetails(grapholscape) {
  init(entityDetailsComponent, grapholscape)
}

export default entityDetailsComponent