import { Stylesheet } from "cytoscape"
import { Renderer } from "../../core/rendering"
import Ontology from "../ontology"
import GrapholscapeTheme from "../themes/theme"
import Filter from './filter'
import FilterManager from "./i-filter-manager"

export enum RendererStatesEnum {
  GRAPHOL = 'graphol',
  GRAPHOL_LITE = 'lite',
  FLOATY = 'floaty',
  INCREMENTAL = 'incremental',
}

export default interface RenderState {
  id: RendererStatesEnum
  renderer: Renderer
  filterManager: FilterManager
  layout: cytoscape.Layouts
  layoutRunning: boolean
  render(): void
  stopRendering(): void,
  filter(elementId: string, filter: Filter): void
  unfilter(elementId: string, filter: Filter): void
  runLayout(): void
  stopLayout(): void
  getGraphStyle(theme: GrapholscapeTheme): Stylesheet[]
  transformOntology(ontology: Ontology): void
}