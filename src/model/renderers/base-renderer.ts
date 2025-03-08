import { StylesheetJson } from "cytoscape"
import { Renderer } from "../../core/rendering"
import Ontology from "../ontology"
import GrapholscapeTheme from "../themes/theme"
import Filter from "./filter"
import FilterManager from "./i-filter-manager"
import RenderState, { RendererStatesEnum } from "./i-render-state"
import { Grapholscape } from "../../core"
import { GscapeLayout } from "./layout"

export default abstract class BaseRenderer implements RenderState {
  protected _renderer: Renderer
  abstract id: RendererStatesEnum
  abstract filterManager?: FilterManager
  abstract layout: cytoscape.Layouts
  abstract gscapeLayout?: GscapeLayout
  abstract availableLayouts?: GscapeLayout[]
  abstract render(): void
  abstract stopRendering(): void
  abstract runLayout(): void
  abstract stopLayout(): void
  abstract getGraphStyle(theme: GrapholscapeTheme): StylesheetJson
  abstract transformOntology(ontology: Ontology): void
  abstract postOntologyTransform(ontology: Grapholscape): void

  layoutRunning: boolean = false

  constructor(renderer?: Renderer) {
    if (renderer) this.renderer = renderer
  }

  centerOnElementById(elementId: string, zoom?: number, select?: boolean): void {
    const cy = this.renderer.cy
    if (!cy || (!zoom && zoom !== 0)) return
    
    const cyElement = cy.$id(elementId)
    zoom = zoom > cy.maxZoom() ? cy.maxZoom() : zoom
    if (cyElement.empty()) {
      console.warn(`Element id (${elementId}) not found. Please check that this is the correct diagram`)
    } else {
      cy.animate({
        center: {
          eles: cyElement
        },
        zoom: zoom,
        queue: false,
      })

      if (select && cy.$(':selected') !== cyElement) {
        this.renderer.unselect()
        cyElement.select()
      }
    }
  }
  

  set renderer(newRenderer: Renderer) {
    this._renderer = newRenderer
    if (this.filterManager)
      this.filterManager.filters = newRenderer.filters
  }

  get renderer() {
    return this._renderer
  }

  filter(elementId: string, filter: Filter) {
    if (this.renderer.diagram)
      this.renderer.diagram.representations.get(this.id)?.filter(elementId, filter.filterTag)
  }

  unfilter(elementId: string, filter: Filter) {
    if (this.renderer.diagram)
      this.renderer.diagram.representations.get(this.id)?.unfilter(elementId, filter.filterTag)
  }
}