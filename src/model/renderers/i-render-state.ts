import { StylesheetJson } from "cytoscape"
import { Renderer } from "../../core/rendering"
import Ontology from "../ontology"
import GrapholscapeTheme from "../themes/theme"
import Filter from './filter'
import FilterManager from "./i-filter-manager"
import { Grapholscape } from "../../core"
import { GscapeLayout } from "./layout"

export enum RendererStatesEnum {
  GRAPHOL = 'graphol',
  GRAPHOL_LITE = 'lite',
  FLOATY = 'floaty',
  INCREMENTAL = 'incremental',
}

export default interface RenderState {
  id: RendererStatesEnum
  renderer: Renderer
  filterManager?: FilterManager
  layout: cytoscape.Layouts
  gscapeLayout?: GscapeLayout
  availableLayouts?: GscapeLayout[]
  layoutRunning: boolean
  render(): void
  stopRendering(): void,
  filter(elementId: string, filter: Filter): void
  unfilter(elementId: string, filter: Filter): void
  runLayout(): void
  stopLayout(): void
  getGraphStyle(theme: GrapholscapeTheme): StylesheetJson
  transformOntology(ontology: Ontology): void
  postOntologyTransform(ontology: Grapholscape): void
  centerOnElementById(elementId: string, zoom?: number, select?: boolean): void
}