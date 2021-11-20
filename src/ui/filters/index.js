import GscapeFilters from "./gscape-filters";
import init from "./controller";

export default GscapeFilters

export const filterComponent = new GscapeFilters()

export const filters = (grapholscape) => {
  init(filterComponent, grapholscape)
  return filterComponent
}