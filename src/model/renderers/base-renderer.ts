import { Stylesheet } from "cytoscape"
import Renderer from "../../core/rendering"
import { cytoscapeFilter, cytoscapeUnfilter } from "../../core/rendering/filtering"
import Ontology from "../ontology"
import GrapholscapeTheme from "../theme"
import Filter from "./filter"
import FilterManager from "./i-filter-manager"
import RenderState, { RendererStatesEnum } from "./i-render-state"

export default abstract class BaseRenderer implements RenderState {
  protected _renderer: Renderer
  abstract id: RendererStatesEnum
  abstract filterManager: FilterManager
  abstract layout: cytoscape.Layouts
  abstract render(): void
  abstract stopRendering(): void
  abstract runLayout(): void
  abstract stopLayout(): void
  abstract getGraphStyle(theme: GrapholscapeTheme): Stylesheet[]
  abstract transformOntology(ontology: Ontology): void;

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
    if (this.renderer.cy)
      cytoscapeFilter(elementId, filter.filterTag, this.renderer.cy)
  }

  unfilter(elementId: string, filter: Filter) {
    if (this.renderer.cy)
      cytoscapeUnfilter(elementId, filter.filterTag, this.renderer.cy)
  }
}