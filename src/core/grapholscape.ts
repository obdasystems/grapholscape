import { GrapholscapeConfig, WidgetsConfig } from "../config"
import * as Exporter from '../exporter'
import { IIncremental } from "../incremental/i-incremental"
import { ColoursNames, DefaultFilterKeyEnum, DefaultThemes, DefaultThemesEnum, EntityNameType, Filter, GrapholscapeTheme, Lifecycle, LifecycleEvent, Ontology, RendererStatesEnum, Viewport, iRenderState } from "../model"
import rdfgraphSerializer from "../rdfgraph-serializer"
import DisplayedNamesManager from "./displayedNamesManager"
import EntityNavigator from "./entity-navigator"
import { FloatyRendererState, GrapholRendererState, LiteRendererState, Renderer } from "./rendering"
import IncrementalRendererState from "./rendering/incremental/incremental-render-state"
import setGraphEventHandlers from "./set-graph-event-handlers"
import ThemeManager from "./themeManager"


export default abstract class Grapholscape {
  renderer: Renderer = new Renderer()
  protected abstract availableRenderers: RendererStatesEnum[]
  container: HTMLElement
  readonly lifecycle: Lifecycle = new Lifecycle()
  ontology: Ontology
  protected abstract entityNavigator: EntityNavigator
  protected abstract displayedNamesManager: DisplayedNamesManager
  protected abstract themesManager: ThemeManager
  protected _incremental: IIncremental
  widgets: Map<string, HTMLElement> = new Map()
  widgetsInitialStates: WidgetsConfig

  // ----------------------------- RENDERER ----------------------------- //
  /**
   * Show a certain diagram by its ID
   * @param diagramId the diagram's id to display
   * @param viewportState set a custom {@link !model.Viewport}, if not set, last one available will be used
   */
  showDiagram(diagramId: number, viewportState?: Viewport) {
    const diagram = this.ontology.getDiagram(diagramId)

    if (!diagram) {
      console.warn(`Can't find any diagram with id="${diagramId}"`)
      return
    }

    if (this.renderState && !diagram.representations?.get(this.renderState)?.hasEverBeenRendered) {
      setGraphEventHandlers(diagram, this.lifecycle, this.ontology)
    }

    if (viewportState)
      diagram.lastViewportState = viewportState

    this.renderer.render(diagram)
  }

  /**
   * Change the current renderer (Graphol - Lite - Floaty).
   * 
   * @remarks
   * A RendererState is an implementation for the {@link !model.iRenderState} interface
   * that changes the way the {@link Renderer} performs the main operations on a 
   * {@link !model.Diagram} such as rendering it and filtering elements in it.
   * The renderer states included in Grapholscape are: {@link GrapholRendererState},
   * {@link LiteRendererState} and {@link FloatyRendererState}.
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

    const shouldTransformOntology = !this.ontology.diagrams[0]?.representations.get(newRenderState.id)
    if (shouldTransformOntology) {
      newRenderState.transformOntology(this.ontology)
    }

    if (this.renderer.diagram && !this.renderer.diagram?.representations.get(newRenderState.id)?.hasEverBeenRendered)
      setGraphEventHandlers(this.renderer.diagram, this.lifecycle, this.ontology)

    this.renderer.renderState = newRenderState

    if (shouldUpdateEntities)
      this.entityNavigator.updateEntitiesOccurrences()

    if (shouldTransformOntology) {
      newRenderState.postOntologyTransform(this)
    }
    this.lifecycle.trigger(LifecycleEvent.RendererChange, newRenderState.id)
  }

  /**
   * Center the viewport on a single element.
   * @remarks
   * If you specify a different diagram from the current one, it will be displayed
   * @param elementId the element's id (can be a node or an edge)
   * @param diagramId the diagram's id (**default**: the current one)
   * @param zoom the level zoom to apply, do not pass it if you don't want zoom to change
   */
  centerOnElement(elementId: string, diagramId?: number, zoom?: number) {
    if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
      this.showDiagram(diagramId)

    this.renderer.centerOnElementById(elementId, zoom)
  }

  /**
   * Select an element in a diagram.
   * @remarks
   * If you specify a different diagram from the current one, it will be displayed
   * @param elementId the element's id (can be a node or an edge)
   * @param diagramId the diagram's id (**default**: the current one)
   */
  selectElement(elementId: string, diagramId?: number) {
    if ((diagramId || diagramId === 0) && this.diagramId !== diagramId)
      this.showDiagram(diagramId)

    this.renderer.selectElement(elementId)
  }

  /** Unselect any selected element in the current diagram */
  unselect() { this.renderer.unselect() }

  /** Fit viewport to diagram */
  fit() { this.renderer.fit() }

  /**
   * Apply a certain level of zoom
   * @param value level of zoom to set
   */
  zoom(value: number) { this.renderer.zoom(value) }

  /**
   * Increase the zooom level by a certain amount
   * @param amount the amount of zoom to add
   */
  zoomIn(amount: number) { this.renderer.zoomIn(amount) }

  /**
   * Decrease the zooom level by a certain amount
   * @param amount the amount of zoom to remove
   */
  zoomOut(amount: number) { this.renderer.zoomOut(amount) }

  /**
   * Filter elements on the diagram.
   * @remarks
   * It will be currently applied only if the user defined callback on the event
   * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
   * allows for the filter to be applied.
   * @param filter the filter to apply, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum} 
   * or a string representing the unique key of a defined filter
   */
  filter(filter: string | Filter | DefaultFilterKeyEnum) { this.renderer.filter(filter) }

  /**
   * Unfilter elements on the diagram.
   * @remarks
   * It will be currently deactivated only if the user defined callback on the event
   * {@link !model.LifecycleEvent.FilterRequest} returns true and if the internal logic
   * allows for the filter to be deactivated.
   * @param filter the filter to disable, can be an object of type {@link !model.Filter}, {@link !model.DefaultFilterKeyEnum} 
   * or a string representing the unique key of a defined filter
   */
  unfilter(filter: string | Filter | DefaultFilterKeyEnum) { this.renderer.unfilter(filter) }

  /** The current diagram's id */
  get diagramId() {
    return this.renderer.diagram?.id
  }

  /** The current renderer state */
  get renderState() {
    return this.renderer.renderState?.id
  }

  /** The current selected Entity */
  get selectedEntity() {
    const selectedElement = this.renderer.selectedElement

    if (selectedElement?.isEntity())
      return this.ontology.getEntity(this.renderer.cy?.$id(selectedElement.id).data().iri)
  }

  /** An array of available renderer's state for this Grapholscape instance */
  get renderers() { return this.availableRenderers }

  // ------------------------- ENTITY NAVIGATOR ------------------------- //
  /**
   * Center viewport on a single entity occurrence given its IRI
   * @param iri the iri of the entity to find and center on
   * @param diagramId the diagram containing the entity.
   * If not specified, the first entity occurrence in any diagram will be used.
   * @param zoom the level of zoom to apply.
   * If not specified, zoom level won't be changed.
   */
  centerOnEntity(iri: string, diagramId?: number, zoom?: number) {
    this.entityNavigator.centerOnEntity(iri, diagramId, zoom)
  }

  /**
   * Center viewport on a single entity occurrence and selects it given its IRI
   * @param iri the iri of the entity to find and center on
   * @param diagramId the diagram containing the entity.
   * If not specified, the first entity occurrence in any diagram will be used.
   * @param zoom the level of zoom to apply.
   * If not specified, zoom level won't be changed.
   */
  selectEntity(iri: string, diagramId?: number, zoom?: number) {
    this.entityNavigator.selectEntity(iri, diagramId, zoom)
  }

  // ---------------------- DISPLAYED NAMES MANAGER ---------------------- //
  /**
   * Change the displayed entity's names. 
   * @param newEntityNametype the entity name type to set
   */
  setEntityNameType(newEntityNametype: EntityNameType) {
    this.displayedNamesManager.setEntityNameType(newEntityNametype)
  }

  /**
   * Change the language used for the labels and comments
   * @remarks The language must be supported by the ontology or the first available
   * language for a given label/comment wil be used as fallback
   * @param newLanguage the language to set {@link !config.Language}
   */
  setLanguage(newLanguage: string) {
    this.displayedNamesManager.setLanguage(newLanguage)
  }

  /** The current selected language */
  get language() { return this.displayedNamesManager.language }
  /** The current selected entity name type (label, full iri or prefixed iri) */
  get entityNameType() { return this.displayedNamesManager.entityNameType }

  // -------------------------- THEMES MANAGER -------------------------- //
  /**
   * Apply a given theme
   * @param themeId the theme's ID
   */
  setTheme(themeId: string) {
    this.themesManager.setTheme(themeId)
  }

  /**
   * @ignore
   * // TODO: make this method update settings widget before publishing in docs
   * Add a new theme in the list of available themes
   * @param newTheme the new theme
   * @experimental
   */
  addTheme(newTheme: GrapholscapeTheme) {
    this.themesManager.addTheme(newTheme)
  }

  /**
   * @ignore
   * // TODO: make this method update settings widget before publishing in docs
   * Remove a theme in the list of available themes
   * @param newTheme the new theme
   * @experimental
   */
  removeTheme(newTheme: GrapholscapeTheme) {
    this.themesManager.removeTheme(newTheme)
  }

  /** The current theme used by Grapholscape */
  get theme() { return this.themesManager.theme }

  /** The available themes for this Grapholscape instance */
  get themeList() { return Array.from(this.themesManager.themes) }

  // ----------------------------- LIFECYCLE ----------------------------- //
  /**
   * Register a callback for a given event.
   * @remarks
   * Check {@link !model.LifecycleEvent} and {@link !model.IonEvent} for the
   * full list of events/callbacks types
   * @param event The event for which register a callback.
   * @param callback Function to call when the specified event occurs
   * 
   * @example reacting to a node selection
   * ```js
   *  import { LifecycleEvent } from 'grapholscape'
   * 
   *  // ...init grapholscape
   *  
   * grapholscape.on(LifecycleEvent.NodeSelection, (selectedNode) => {
   *  // here you can do whatever you want with selectedNode, like printing its shape
   *  console.log(selectedNode.shape)
   * })
   * ```
   */
  on = this.lifecycle.on

  // -------------------------------- UI -------------------------------- //
  /** 
   * The container in which Grapholscape places the UI components.
   * You can use this container to add new widgets or dialogs if you want to.
   */
  get uiContainer() { return this.container.querySelector('.gscape-ui') }
  /** 
   * The container in which the bottom-right buttons are placed.
   * You can use this container to add your own Buttons if you want to.
   */
  get buttonsTray() { return this.uiContainer?.querySelector('.gscape-ui-buttons-tray') }


  // ------------------------------ CONFIG ------------------------------ //
  /**
   * @ignore
   * @privateRemarks // TODO: Be sure this method reflects on UI before publishing it in to the docs
   * Apply a new custom configuration
   * @param newConfig the config object to apply
   * @experimental
   */
  setConfig(newConfig: GrapholscapeConfig) {
    if (newConfig.language) {
      this.displayedNamesManager.setLanguage(newConfig.language)
    }

    if (newConfig.entityNameType) {
      this.displayedNamesManager.setEntityNameType(newConfig.entityNameType)
    }

    if (newConfig.renderers) {
      this.availableRenderers = newConfig.renderers
    }

    let rendererStateToSet: RendererStatesEnum | undefined = undefined
    /**
     * If only one renderer defined, just use it
     */
    if (this.availableRenderers.length <= 1) {
      rendererStateToSet = this.availableRenderers[0]
    }
    /** 
     * If selected renderer is included in the list of renderers, use it.
     * The other ones will be managed by renderer-selector widget
     * or manually by the app importing grapholscape.
     */
    else if (newConfig.selectedRenderer && this.availableRenderers.includes(newConfig.selectedRenderer)) {
      rendererStateToSet = newConfig.selectedRenderer
    }

    if (rendererStateToSet) {
      switch (rendererStateToSet) {
        case RendererStatesEnum.GRAPHOL: {
          this.setRenderer(new GrapholRendererState())
          break
        }

        case RendererStatesEnum.GRAPHOL_LITE: {
          this.setRenderer(new LiteRendererState())
          break
        }

        case RendererStatesEnum.FLOATY: {
          this.setRenderer(new FloatyRendererState())
          break
        }

        case RendererStatesEnum.INCREMENTAL: {
          this.setRenderer(new IncrementalRendererState())
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
          this.themesManager.addTheme(DefaultThemes[newTheme as DefaultThemesEnum]!)
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

    if (newConfig.customIncrementalController) {
      this.incremental = newConfig.customIncrementalController
    }
  }

  // ---------------------------- EXPORTING ---------------------------- //
  /**
   * Export current diagram and download it as a PNG image.
   * @param fileName custom file name. Defaults to {@link exportFileName}
   */
  exportToPng(fileName = this.exportFileName) {
    fileName += '.png'
    Exporter.toPNG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph))
  }

  /**
   * Export current diagram and download it as an SVG.
   * @param fileName custom file name. Defaults to {@link exportFileName}
   */
  exportToSvg(fileName = this.exportFileName) {
    fileName += '.svg'
    Exporter.toSVG(fileName, this.renderer.cy, this.theme.getColour(ColoursNames.bg_graph))
  }

  /**
   * Export current ontology as an RDFGraph.
   * RDFGraph is a JSON serialization of grapholscape's model.
   * Useful to resume a previous state.
   * @returns RDFGraph representation of this grapholscape instance's model.
   */
  exportToRdfGraph() {
    return rdfgraphSerializer(this)
  }

  /**
   * Filename for exports.
   * String in the form: "[ontology name]-[diagram name]-v[ontology version]"
   */
  get exportFileName() {
    return `${this.ontology.name}-${this.renderer.diagram?.name}-v${this.ontology.version}`
  }

  get incremental() {
    return this._incremental
  }

  set incremental(incrementalController: IIncremental) {
    this._incremental = incrementalController
    this._incremental.init()
  }
}

export class Core extends Grapholscape {
  protected availableRenderers: RendererStatesEnum[] = [
    RendererStatesEnum.GRAPHOL,
    RendererStatesEnum.GRAPHOL_LITE,
    RendererStatesEnum.FLOATY,
    RendererStatesEnum.INCREMENTAL
  ]
  renderer: Renderer
  container: HTMLElement
  lifecycle: Lifecycle
  ontology: Ontology
  protected entityNavigator: EntityNavigator = new EntityNavigator(this)
  protected displayedNamesManager: DisplayedNamesManager = new DisplayedNamesManager(this)
  protected themesManager: ThemeManager = new ThemeManager(this)
  widgets: Map<string, HTMLElement>
  widgetsInitialStates: WidgetsConfig

  constructor(ontology: Ontology, container: HTMLElement, config?: GrapholscapeConfig) {
    super()
    this.ontology = ontology
    this.container = container
    this.renderer.container = container
    this.renderer.lifecycle = this.lifecycle
    this.themesManager = new ThemeManager(this)
    //this.renderer.renderState = new GrapholRendererState()
    if (!config?.selectedTheme) {
      this.themesManager.setTheme(DefaultThemesEnum.GRAPHOLSCAPE)
    }
    if (config) {
      this.setConfig(config)
    }
  }
}