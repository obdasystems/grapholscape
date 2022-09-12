import { GrapholscapeConfig, WidgetsConfig } from "../config/config"
import * as Exporter from '../exporter'
import { Ontology, ColoursNames, DefaultThemes, DefaultThemesEnum, GrapholscapeTheme, iRenderState, Lifecycle, LifecycleEvent, RendererStatesEnum, ViewportState } from "../model"
import { WidgetEnum } from "../ui/util/widget-enum"
import DisplayedNamesManager from "./displayedNamesManager"
import EntityNavigator from "./entity-navigator"
import { Renderer, GrapholRendererState, LiteRendererState, FloatyRenderState } from "./rendering"
import ThemeManager from "./themeManager"


export default class Grapholscape {
  renderer: Renderer = new Renderer()
  private availableRenderers: RendererStatesEnum[] = [
    RendererStatesEnum.GRAPHOL, RendererStatesEnum.GRAPHOL_LITE, RendererStatesEnum.FLOATY
  ]
  container: HTMLElement
  readonly lifecycle: Lifecycle = new Lifecycle()
  ontology: Ontology
  private entityNavigator = new EntityNavigator(this)
  private displayedNamesManager = new DisplayedNamesManager(this)
  private themesManager = new ThemeManager(this)
  widgets: Map<WidgetEnum, HTMLElement> = new Map()
  widgetsInitialStates: WidgetsConfig

  constructor(ontology: Ontology, container: HTMLElement, config?: GrapholscapeConfig) {
    this.ontology = ontology
    this.container = container
    this.renderer.container = container
    this.renderer.lifecycle = this.lifecycle

    this.renderer.renderState = new GrapholRendererState()
    if (!config?.selectedTheme) {
      this.themesManager.setTheme(DefaultThemesEnum.GRAPHOLSCAPE)
    }
    if (config) {
      this.setConfig(config)
    }
  }

  /**
   * Show a certain diagram by its ID
   * @param diagramId the diagram's id to display
   * @param viewportState set a custom {@link ViewportState}, if not set, last one available will be used
   * @returns void
   */
  showDiagram(diagramId: number, viewportState?: ViewportState) {
    const diagram = this.ontology.getDiagram(diagramId)

    if (!diagram) {
      console.warn(`Can't find any diagram with id="${diagramId}"`)
      return
    }

    this.entityNavigator.setGraphEventHandlers(diagram)
    diagram.lastViewportState = viewportState
    this.renderer.render(diagram)
  }

  /**
   * Change the actual renderer (Graphol - Lite - Floaty).
   * 
   * @remarks 
   * 
   * A RendererState is an implementation for the {@link iRenderState} interface
   * that changes the way the {@link Renderer} performs the main operations on a 
   * {@link Diagram} such as rendering it and filtering elements in it.
   * The renderer states included in Grapholscape are: {@link GrapholRendererState},
   * {@link LiteRendererState} and {@link FloatyRenderState}.
   * 
   * @param newRenderState the renderer state instance to set, if you want to reuse
   * these instances it's totally up to you.
   * 
   * 
   * @example
   * ```ts
   * // Setting the floaty renderer state
   * import { FloatyRendererState } from 'grapholscape'
   * 
   * grapholscape.setRenderer(new FloatyRendererState())
   * ```
   */
  setRenderer(newRenderState: iRenderState) {
    const shouldUpdateEntities = (this.diagramId !== 0 && !this.diagramId) || !this.ontology.getDiagram(this.diagramId)
      ?.representations.get(newRenderState.id) ? true : false

    if (!this.ontology.diagrams[0].representations.get(newRenderState.id)) {
      newRenderState.transformOntology(this.ontology)
    }

    this.renderer.renderState = newRenderState

    if (this.renderer.diagram)
      this.entityNavigator.setGraphEventHandlers(this.renderer.diagram)

    if (shouldUpdateEntities)
      this.entityNavigator.updateEntitiesOccurrences()

    this.lifecycle.trigger(LifecycleEvent.RendererChange, this.renderState)
  }

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

  get selectedEntity() {
    const selectedElement = this.renderer.selectedElement

    if (selectedElement?.isEntity())
      return this.ontology.getEntity(this.renderer.cy?.$id(selectedElement.id).data().iri)
  }

  get renderers() { return this.availableRenderers }

  // ---------------------- DISPLAYED NAMES MANAGER ---------------------- //
  /** @borrows this.displayedNamesManager.setEntityNameType as this.setEntityNameType */
  setEntityNameType = this.displayedNamesManager.setEntityNameType
  /** @borrows this.displayedNamesManager.setLanguage as this.setLanguage */
  setLanguage = this.displayedNamesManager.setLanguage

  get language() { return this.displayedNamesManager.language }
  get entityNameType() { return this.displayedNamesManager.entityNameType }

  // -------------------------- THEMES MANAGER -------------------------- //
  /** @borrows this.themesManager.setTheme as this.setTheme */
  setTheme = this.themesManager.setTheme
  /** @borrows this.themesManager.addTheme as this.addTheme */
  addTheme = this.themesManager.addTheme

  get theme() { return this.themesManager.theme }
  get themeList() { return this.themesManager.themes }

  // ----------------------------- LIFECYCLE ----------------------------- //
  on = this.lifecycle.on

  // -------------------------------- UI -------------------------------- //
  get uiContainer() { return this.container.querySelector('.gscape-ui') }
  get buttonsTray() { return this.uiContainer?.querySelector('.gscape-ui-buttons-tray') }


  // ------------------------------ CONFIG ------------------------------ //
  setConfig(newConfig: GrapholscapeConfig) {
    if (newConfig.language) {
      this.displayedNamesManager.setLanguage(newConfig.language)
    }

    if (newConfig.entityNameType) {
      this.displayedNamesManager.setEntityNameType(newConfig.entityNameType)
    }

    if (newConfig.renderers) {
      this.availableRenderers = newConfig.renderers
      /** 
       * Just use the first defined renderer state
       * the other ones will be managed by renderer-selector widget
       * or manually by the app importing grapholscape
       */
      switch (newConfig.renderers[0]) {
        case RendererStatesEnum.GRAPHOL: {
          this.setRenderer(new GrapholRendererState())
          break
        }

        case RendererStatesEnum.GRAPHOL_LITE: {
          this.setRenderer(new LiteRendererState())
          break
        }

        case RendererStatesEnum.FLOATY: {
          this.setRenderer(new FloatyRenderState())
          break
        }
      }
    }

    if (newConfig.themes) {
      this.themesManager.removeThemes()
      newConfig.themes.forEach(newTheme => {
        const _castedNewTheme = newTheme as GrapholscapeTheme

        // It's a default theme id
        if (DefaultThemes[newTheme as DefaultThemesEnum]) {
          this.themesManager.addTheme(DefaultThemes[newTheme as DefaultThemesEnum])
        }

        // It's a custom theme
        else if (_castedNewTheme.id) {
          this.themesManager.addTheme(new GrapholscapeTheme(_castedNewTheme.id, _castedNewTheme.colours, _castedNewTheme.name))
        }
      })
    }

    if (newConfig.selectedTheme && this.themeList.map(theme => theme.id).includes(newConfig.selectedTheme)) {
      this.themesManager.setTheme(newConfig.selectedTheme)
    } else if (!this.themeList.includes(this.theme)) {
      this.themesManager.setTheme(this.themeList[0].id)
    }

    if (newConfig.widgets) {
      this.widgetsInitialStates = newConfig.widgets
    }
  }

  // ---------------------------- EXPORTING ---------------------------- //
  exportToPng(fileName = this.exportFileName) {
    fileName += '.png'
    Exporter.toPNG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph))
  }

  exportToSvg(fileName = this.exportFileName) {
    fileName += '.svg'
    Exporter.toSVG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph))
  }

  /**
   * Filename for exports
   * string in the form: "[ontology name]-[diagram name]-v[ontology version]"
   */
  get exportFileName() {
    return `${this.ontology.name}-${this.renderer.diagram?.name}-v${this.ontology.version}`
  }
}