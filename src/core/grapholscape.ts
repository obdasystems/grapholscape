import Ontology, { GrapholEntity } from "../model"
import Lifecycle, { LifecycleEvent } from "../model/lifecycle"
import RenderState, { RenderStatesEnum } from "../model/renderers/i-render-state"
import GrapholscapeTheme from "../model/theme"
import { WidgetEnum } from "../ui/util/widget-enum"
import DisplayedNamesManager from "./displayedNamesManager"
import EntityNavigator from "./entity-navigator"
import Renderer from "./rendering"
import FloatyRenderState from "./rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "./rendering/graphol/graphol-renderer-state"
import LiteRendererState from "./rendering/lite/lite-renderer-state"


export default class Grapholscape {
  renderer: Renderer = new Renderer()
  container: HTMLElement
  readonly lifecycle: Lifecycle = new Lifecycle()
  ontology: Ontology
  themeManager: any = null
  themes = [GrapholscapeTheme.defaultTheme, GrapholscapeTheme.darkTheme, GrapholscapeTheme.classicTheme]
  private entityNavigator = new EntityNavigator(this)
  private displayedNamesManager = new DisplayedNamesManager(this)
  lite: LiteRendererState
  floaty: FloatyRenderState
  widgets: Map<WidgetEnum, HTMLElement> = new Map()

  constructor(ontology: Ontology, container: HTMLElement) {
    this.ontology = ontology
    this.container = container
    this.renderer.container = container
    this.renderer.lifecycle = this.lifecycle

    this.renderer.renderState = new GrapholRendererState()
    this.renderer.setTheme(this.themes[0])
  }

  showDiagram(diagramId: number, viewportState = null) {
    const diagram = this.ontology.getDiagram(diagramId)

    if (!diagram) {
      console.warn(`Can't find any diagram with id="${diagramId}"`)
      return
    }

    this.entityNavigator.setGraphEventHandlers(diagram)

    const shouldUpdateEntities = !this.ontology.getDiagram(this.diagramId)
      ?.representations.get(this.renderState)?.hasEverBeenRendered

    this.renderer.render(diagram)
    if (shouldUpdateEntities)
      this.entityNavigator.updateEntitiesOccurrences()
  }

  setRenderer(newRenderState: RenderState) {
    const shouldUpdateEntities = !this.ontology.getDiagram(this.diagramId)
      ?.representations.get(newRenderState.id)?.hasEverBeenRendered

    if (!this.ontology.diagrams[0].representations.get(newRenderState.id)) {
      newRenderState.transformOntology(this.ontology)
    }

    this.renderer.renderState = newRenderState

    this.entityNavigator.setGraphEventHandlers(this.renderer.diagram)
    if (shouldUpdateEntities)
      this.entityNavigator.updateEntitiesOccurrences()
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
  centerOnElement(elementId: string, diagramId?: number, zoom?: number) {
    if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
      this.showDiagram(diagramId)

    this.renderer.centerOnElementById(elementId, zoom)
  }

  // ------------------------- ENTITY NAVIGATOR ------------------------- //
  /** @borrows this.entityNavigator.centerOnEntity as this.centerOnEntity */
  centerOnEntity = this.entityNavigator.centerOnEntity
  /** @borrows this.entityNavigator.selectEntity as this.selectEntity */
  selectEntity = this.entityNavigator.selectEntity

  // ----------------------------- RENDERER ----------------------------- //
  /** @borrows this.renderer.unselect as this.unselect */
  unselect = this.renderer.unselect
  /** @borrows this.renderer.selectElement as this.selectElement */
  selectElement = this.renderer.selectElement
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
    return this.renderer.diagram?.id
  }

  get renderState() {
    return this.renderer.renderState.id
  }

  get theme() {
    return this.renderer.theme
  }

  get selectedEntity() {
    const selectedElement = this.renderer.selectedElement

    if (selectedElement?.isEntity())
      return this.ontology.getEntity(this.renderer.cy?.$id(selectedElement.id).data().iri)
  }

  // ---------------------- DISPLAYED NAMES MANAGER ---------------------- //
  /** @borrows this.displayedNamesManager.setEntityNameType as this.setEntityNameType */
  setEntityNameType = this.displayedNamesManager.setEntityNameType
  /** @borrows this.displayedNamesManager.setLanguage as this.setLanguage */
  setLanguage = this.displayedNamesManager.setLanguage

  get language() { return this.displayedNamesManager.language }
  get entityNameType() { return this.displayedNamesManager.entityNameType }

  // ----------------------------- LIFECYCLE ----------------------------- //
  on = this.lifecycle.on


  // -------------------------------- UI -------------------------------- //
  get uiContainer() { return this.container.querySelector('.gscape-ui') }
  get buttonsTray() { return this.uiContainer?.querySelector('.gscape-ui-buttons-tray') }
}