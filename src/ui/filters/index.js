import GscapeFilters from "./gscape-filters";
import init from "./controller";

export { GscapeFilters }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initFilters(grapholscape) {
  const filterComponent = new GscapeFilters()
  init(filterComponent, grapholscape)
  grapholscape.widgets.FILTERS = filterComponent
}