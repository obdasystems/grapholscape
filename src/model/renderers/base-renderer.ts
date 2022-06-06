import { Stylesheet } from "cytoscape"
import Renderer from "../../core/rendering"
import { cytoscapeFilter, cytoscapeUnfilter } from "../../core/rendering/filtering"
import GrapholscapeTheme from "../theme"
import Filter from "./filter"
import FilterManager from "./i-filter-manager"
import RenderState, { RenderStatesEnum } from "./i-render-state"

export default abstract class BaseRenderer implements RenderState {
  protected _renderer: Renderer
  abstract id: RenderStatesEnum
  abstract filterManager: FilterManager
  abstract layout: cytoscape.Layouts
  abstract render(): void
  abstract runLayout(): void
  abstract stopLayout(): void
  abstract getGraphStyle(theme: GrapholscapeTheme): Stylesheet[]

  constructor(renderer?: Renderer) {
    if (renderer) this.renderer = renderer
  }

  set renderer(newRenderer: Renderer) {
    this._renderer = newRenderer
    this.filterManager.filters = newRenderer.filters
  }

  get renderer() {
    return this._renderer
  }
  
  filter(elementId: string, filter: Filter) {
    cytoscapeFilter(elementId, filter.filterTag, this.renderer.cy)
  }

  unfilter(elementId: string, filter: Filter) {
    cytoscapeUnfilter(elementId, filter.filterTag, this.renderer.cy)
  }
}