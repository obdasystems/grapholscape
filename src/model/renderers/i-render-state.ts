import { Stylesheet } from "cytoscape"
import Renderer from "../../core/rendering"
import GrapholscapeTheme from "../theme"
import Filter from './filter'
import FilterManager from "./i-filter-manager"

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
  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[]
}