import GscapeFilters from "./gscape-filters";
import init from "./controller";

export { GscapeFilters }

const filterComponent = new GscapeFilters()

export function initFilters(grapholscape) {
  init(filterComponent, grapholscape)
}

export default filterComponent