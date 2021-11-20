import GscapeEntityDetails from "./entity-details";
import init from './controller'

export default GscapeEntityDetails

export const entityDetails = (grapholscape) => {
  const entityDetailsComponent = new GscapeEntityDetails()
  init(entityDetailsComponent, grapholscape)
  return entityDetailsComponent
}