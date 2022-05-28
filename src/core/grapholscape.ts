import Ontology from "../model"
import Lifecycle, { LifecycleEvent } from "../model/lifecycle"
import RenderState from "../model/renderers/i-render-state"
import GrapholscapeTheme from "../model/theme"
import DisplayedNamesManager from "./displayedNamesManager"
import EntityNavigator from "./entity-navigator"
import Renderer from "./rendering"
import GrapholRendererState from "./rendering/graphol/graphol-renderer-state"
import LiteRendererState from "./rendering/lite/lite-renderer-state"


export default class Grapholscape {
  renderer: Renderer = new Renderer()
  container: any = null
  readonly lifecycle: Lifecycle = new Lifecycle()
  ontology: Ontology
  themeManager: any = null
  themes = [GrapholscapeTheme.defaultTheme, GrapholscapeTheme.darkTheme, GrapholscapeTheme.classicTheme]
  private entityNavigator = new EntityNavigator(this)
  private displayedNamesManager = new DisplayedNamesManager(this)
  lite: LiteRendererState

  constructor(ontology: Ontology, container: Element) {
    this.ontology = ontology
    this.renderer.container = container
    this.renderer.lifecycle = this.lifecycle

    this.renderer.renderState = new GrapholRendererState()
    this.renderer.setTheme(this.themes[0])
    this.lite = new LiteRendererState()
  }
  
  showDiagram(diagramId: number, viewportState = null) {
    const diagram = this.ontology.getDiagram(diagramId)

    if (!diagram) {
      console.warn(`Can't find any diagram with id="${diagramId}"`)
      return
    }

    this.renderer.render(diagram)
  }

  setRenderer(newRenderState: RenderState) {
    this.renderer.renderState = newRenderState
  }

  setTheme(newTheme: GrapholscapeTheme) {
    this.renderer.setTheme(newTheme)
    this.lifecycle.trigger(LifecycleEvent.ThemeChange, newTheme)
  }

  addTheme(newTheme: GrapholscapeTheme, select?: boolean) {
    this.themes.push(newTheme)
    if (select) {
      this.setTheme(newTheme)
    }
  }

  // TODO: Evaluate if this should part of public api
  // centerOnElement(elementId: string, diagramId?: number, zoom?: number) {
  //   if (diagramId && this.diagramId !== diagramId)
  //     this.showDiagram(diagramId)

  //   this.renderer.centerOnElementById(elementId, zoom)
  // }

  // ------------------------- ENTITY NAVIGATOR ------------------------- //
  /** @borrows this.entityNavigator.centerOnEntity as this.centerOnEntity */
  centerOnEntity = this.entityNavigator.centerOnEntity
  /** @borrows this.entityNavigator.selectEntity as this.selectEntity */
  selectEntity = this.entityNavigator.selectEntity

  // ----------------------------- RENDERER ----------------------------- //
  /** @borrows this.renderer.unselect as this.unselect */
  unselect = this.renderer.unselect
  /** @borrows this.renderer.fit as this.fit */
  fit = this.renderer.fit
  /** @borrows this.renderer.zoom as this.zoom */
  zoom = this.renderer.zoom
  /** @borrows this.renderer.zoomIn as this.zoomIn */
  zoomIn = this.renderer.zoomIn
  /** @borrows this.renderer.zoomOut as this.zoomOut */
  zoomOut = this.renderer.zoomOut
  /** @borrows this.renderer.filter as this.filter */
  filter = this.renderer.filter
  /** @borrows this.renderer.unfilter as this.unfilter */
  unfilter = this.renderer.unfilter

  get diagramId() {
    return this.renderer.diagram.id
  }

  get renderState() {
    return this.renderer.renderState.id
  }

  get theme() {
    return this.renderer.theme
  }

  // ---------------------- DISPLAYED NAMES MANAGER ---------------------- //
  /** @borrows this.displayedNamesManager.setEntityNameType as this.setEntityNameType */
  setEntityNameType = this.displayedNamesManager.setEntityNameType
  /** @borrows this.displayedNamesManager.setLanguage as this.setLanguage */
  setLanguage = this.displayedNamesManager.setLanguage

  get language() { return this.displayedNamesManager.language }
  get entityNameType() { return this.displayedNamesManager.entityNameType }

  // ---------------------------- LIFECYCLE ---------------------------- //
  on = this.lifecycle.on
}