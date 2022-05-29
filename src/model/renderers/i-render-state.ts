import Renderer from "../../core/rendering"
import Diagram from '../diagrams/diagram'
import Filter from './filter'
import { GrapholTypesEnum } from "../graphol-elems/node-enums"
import FilterManager from "./i-filter-manager"
import { cytoscapeFilter, cytoscapeUnfilter } from "../../core/rendering/filtering"

export enum RenderStatesEnum {
  GRAPHOL = 'graphol',
  GRAPHOL_LITE = 'lite',
  FLOATY = 'floaty'
}

export default interface RenderState {
  id: RenderStatesEnum
  renderer: Renderer
  filterManager: FilterManager
  cyConfig: cytoscape.CytoscapeOptions
  render(): void
  filter(elementId: string, filter: Filter): void
  unfilter(elementId: string, filter: Filter): void
  layoutRun(): void
  layoutStop(): void
}