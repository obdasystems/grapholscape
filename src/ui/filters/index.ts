import GscapeFilters from "./gscape-filters";
import init from "./controller";
import Grapholscape from '../../core';
import { WidgetEnum } from "../util/widget-enum";

export { GscapeFilters }

export default function initFilters(grapholscape: Grapholscape) {
  const filterComponent = new GscapeFilters()
  init(filterComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.FILTERS, filterComponent)
}