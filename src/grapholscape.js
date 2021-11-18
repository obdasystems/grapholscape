/** 
 * @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue 
 * @typedef {import('./model/diagram').default} Diagram
 * @typedef {import('./rendering/renderers').GrapholscapeRenderer} Renderer
 * @typedef {import('./style/themes-controller').Theme} Theme
 * @typedef {'label' | 'full' | 'prefixed'} EntityNameType 
 * 
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active
 * @property {boolean} Filter.disabled
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key
 * 
 * @typedef {Object} Language
 * @property {string} label - string representation to be visualized
 * @property {string} value - identifier of the language
 * 
 * @typedef {Object} Languages
 * @property {string} selected - key value in config.json of the selected language
 * @property {string} default - key value of the default language defined in the ontology
 * @property {Language[]} list - list of languages supported by the ontology
 * 
 * @callback edgeSelectionCallbak
 * @param {CollectionReturnValue} selectedEdge
 * 
 * @callback nodeSelectionCallbak
 * @param {CollectionReturnValue} selectedNode
 * 
 * @callback entitySelectionCallbak
 * @param {CollectionReturnValue} selectedEntity
 * 
 * @callback backgroundClickCallback
 * 
 * @callback diagramChangeCallback
 * @param {Diagram} newDiagram
 * 
 * @callback rendererChangeCallback
 * @param {string} newRenderer
 * 
 * @callback filterCallback
 * @param {Filter} filterObj
 * 
 * @callback themeChangeCallback
 * @param {Theme} newTheme
 * 
 * @callback entityNameTypeChangeCallback
 * @param {EntityNameType} newEntityNameType
 */

import defaultConfig from "./config.json";
import * as exporter from './exporting';
import Ontology from "./model";
import initRenderersManager from './rendering';
import ThemesController from "./style/themes-controller";
import { cyToGrapholElem } from "./util/model-obj-transformations";
import computeSimplifiedOntologies from "./util/simplifier"


export default class Grapholscape {
  /**
   * Create a core object of Grapholscape
   * @param {!Ontology} ontology An Ontology object
   * @param {object} container DOM element in which grapholscape will render the ontology
   * @param {?object} customConfig JSON of custom default settings, check out 
   * [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   */
  constructor(ontology, container, customConfig = null) {
    this.config = JSON.parse(JSON.stringify(defaultConfig)) //create copy

    this.themesController = new ThemesController()

    if (customConfig) this.setConfig(customConfig)

    if (customConfig?.renderers) {
      /** @type {import("./rendering/renderer-manager").default} */
      this.renderersManager = initRenderersManager(container, customConfig.renderers)
    } else {
      this.renderersManager = initRenderersManager(container, ['default', 'lite', 'float'])
    }

    // set language
    this.config.preferences.language.list = ontology.languages.list.map(lang => {
      return {
        "label": lang,
        "value": lang,
      }
    })

    this.defaultLanguage = ontology.languages.default

    // if not selected in config, select the default one
    let selectedLanguage = this.config.preferences.language.selected
    if (selectedLanguage == '')
      this.config.preferences.language.selected = this.defaultLanguage
    else {
      // if language is not supported by ontology, add it in the list
      // only for consistency : user defined it so he wants to see it
      if (!ontology.languages.list.includes(selectedLanguage))
        this.config.preferences.language.list.push({
          "label": selectedLanguage + ' - unsupported',
          "value": selectedLanguage
        })
    }

    this._callbacksDiagramChange = []
    this._callbacksEntitySelection = []
    this._callbacksNodeSelection = []
    this._callbacksBackgroundClick = []
    this._callbacksEdgeSelection = []
    this._callbacksFilterOn = []
    this._callbacksFilterOff = []
    this._callbacksRendererChange = []
    this._callbacksWikiClick = []
    this._callbacksThemeChange = []
    this._callbacksEntityNameTypeChange = []
    this._callbacksLanguageChange = []

    this.renderersManager.onEdgeSelection(selectedEdge => this.handleEdgeSelection(selectedEdge))
    this.renderersManager.onNodeSelection(selectedNode => this.handleNodeSelection(selectedNode))
    this.renderersManager.onBackgroundClick(_ => this.handleBackgroundClick())

    this.ontologies = {
      default: ontology,
      lite: null,
      float: null
    }

    this.SimplifiedOntologyPromise = computeSimplifiedOntologies(ontology)
      .then(result => {
        this.ontologies.lite = result.lite
        this.ontologies.float = result.float
      })
      .catch(reason => { console.error(reason) })

    this.applyTheme(this.config.rendering.theme.selected)
    this.ZOOM_STEP_VALUE = 0.08
  }

  /**
   * Register a new callback to be called on a entity selection
   * @param {entitySelectionCallbak} callback 
   */
  onEntitySelection(callback) { this._callbacksEntitySelection.push(callback) }

  /**
   * Register a new callback to be called on a node selection
   * @param {nodeSelectionCallbak} callback 
   */
  onNodeSelection(callback) { this._callbacksNodeSelection.push(callback) }

  /**
   * Function handling the selection of a node on a diagram [called by renderer]
   * @param {CollectionReturnValue} node 
   */
  handleNodeSelection(node) {
    if (cyToGrapholElem(node).classes.includes('predicate')) {
      this._callbacksEntitySelection.forEach(fn => fn(node))
    }

    this._callbacksNodeSelection.forEach(fn => fn(node))
  }

  /**
   * Register a new callback to be called on a edge selection
   * @param {edgeSelectionCallbak} callback 
   */
  onEdgeSelection(callback) { this._callbacksEdgeSelection.push(callback) }

  /**
   * Function handling the selection of an edge on a diagram [called by renderer]
   * @param {CollectionReturnValue} edge 
   */
  handleEdgeSelection(edge) {
    if (cyToGrapholElem(edge).classes.includes('predicate')) {
      this._callbacksEntitySelection.forEach(fn => fn(edge))
    }

    this._callbacksEdgeSelection.forEach(fn => fn(edge))
  }

  /**
   * Register a new callback to be called on a background click
   * @param {backgroundClickCallback} callback 
   */
  onBackgroundClick(callback) {
    this._callbacksBackgroundClick.push(callback)
  }

  handleBackgroundClick() { this._callbacksBackgroundClick.forEach(fn => fn()) }

  /**
   * Register a new callback to be called on a diagram change
   * @param {function} callback 
   */
  onDiagramChange(callback) { this._callbacksDiagramChange.push(callback) }

  /**
   * Display a diagram on the screen.
   * @param {Diagram | string | number} diagram The diagram retrieved from model, its name or it's id
   * @param {boolean} shouldViewportFit whether to fit viewport to diagram or not
   * @param {function} callback optional callback to execute after a diagram change
   */
  showDiagram(diagram, shouldViewportFit = false) {
    if (typeof diagram == 'string' || typeof diagram == 'number') {
      diagram = this.ontology.getDiagram(diagram)
    }

    if (!diagram) {
      console.warn('diagram not existing')
      return
    }

    shouldViewportFit = shouldViewportFit || !diagram.hasEverBeenRendered
    this.renderersManager.drawDiagram(diagram, shouldViewportFit)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)

    Object.keys(this.filterList).forEach(key => {
      let filter = this.filterList[key]
      if (filter.active) this.renderersManager.filter(filter)
    })

    // simulate selection on old selected entity, this updates UI too
    let entity = diagram.getSelectedEntity()
    if (entity) {
      let grapholEntity = cyToGrapholElem(entity)
      if (grapholEntity.data.diagram_id === this.actualDiagramID) {
        this._callbacksEntitySelection.forEach(fn => fn(entity))
        this.centerOnNode(grapholEntity.data.id)
      }
    }

    this._callbacksDiagramChange.forEach(fn => fn(diagram))
  }

  /**
   * Focus on a single node and zoom on it.
   * If necessary it also display the diagram containing the node.
   * @param {number} nodeID - The node unique ID
   * @param {number?} zoom - The zoom level to apply (Default: 1.5)
   */
  centerOnNode(nodeID, zoom = 1.5) {
    // get diagram id containing the node
    let nodeDiagramID = cyToGrapholElem(this.ontology.getElem(nodeID)).data.diagram_id
    if (this.renderersManager.actualDiagramID != nodeDiagramID) {
      this.showDiagram(nodeDiagramID)
    }

    this.renderersManager.centerOnNode(nodeID, zoom)
  }

  /**
   * Register a new callback to be called on a renderer change
   * @param {function} callback 
   */
  onRendererChange(callback) {
    this._callbacksRendererChange.push(callback)
  }

  /**
   * Change the rendering mode.
   * @param {string} rendererKey - the rendering/simplifation mode to activate: `default`, `lite`, or `float`
   * @param {boolean} [keepViewportState=true] - if `false`, viewport will fit on diagram.
   * Set it `true` if you don't want the viewport state to change.
   * In case of no diagram displayed yet, it will be forced to `false`.
   * Default: `true`.
   * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
   */
  setRenderer(rendererKey, keepViewportState = true) {
    const performChange = () => {
      let viewportState = keepViewportState ? this.renderersManager.actualViewportState : undefined

      let selectedEntities = {}
      // get selected entity in each diagram
      this.ontology.diagrams.forEach(diagram => {
        if (diagram.getSelectedEntity())
          selectedEntities[diagram.id] = cyToGrapholElem(diagram.getSelectedEntity())
      })

      this.renderersManager.setRenderer(rendererKey)

      Object.keys(this.filterList).forEach(filterKey => {
        this.filterList[filterKey].disabled = this.renderer.disabledFilters.includes(filterKey)
      })

      this.showDiagram(this.actualDiagramID) // either viewport state is set manually or untouched
      // for each selected entity in each diagram, select it again in the new renderer
      Object.keys(selectedEntities).forEach(diagramID => {
        this.selectEntity(selectedEntities[diagramID].data.iri.fullIri, diagramID)
      })
      this.setViewport(viewportState)

      this._callbacksRendererChange.forEach(fn => fn(rendererKey))
    }

    let oldRendererKey = this.renderer.key

    if (rendererKey === oldRendererKey) return
    // if we come or are going to float renderer then never keep the old viewport state
    keepViewportState = keepViewportState &&
      !(oldRendererKey == 'float' || rendererKey == 'float')

    switch (rendererKey) {
      // for simplified ontologies wait for them to be computed
      case 'lite':
      case 'float': {
        this.SimplifiedOntologyPromise.then(() => {
          performChange()
        })
        break
      }
      default: {
        performChange()
        break
      }
    }
  }

  /**
   * Select an entity by its IRI and the diagram it belongs to,
   * if you don't pass a diagram, the actual diagram will be used
   * @param {string} iri the IRI of the entity to select in full or prefixed form
   * @param {Diagram | number | string} [diagram=actualDiagramID] The diagram in which to select the IRI (can be also the diagram id)
   */
  selectEntity(iri, diagram = this.actualDiagramID || 0) {
    let diagramID = ''
    try {
      if (typeof (diagram) === 'object')
        diagramID = diagram.id
      else
        diagramID = this.ontology.getDiagram(diagram).id
    } catch (e) { console.error(`Diagram ${diagram} not defined`) }

    this.ontology.entities[iri].forEach(entity => {
      let grapholEntity = cyToGrapholElem(entity)
      if (grapholEntity.data.diagram_id === diagramID) {
        this.selectElem(grapholEntity.data.id, diagramID)
      }
    })
  }

  /**
   * Select a node or an edge given its unique id
   * @param {string} id unique elem id (node or edge)
   * @param {number | string} [diagram=actualDiagramID] The diagram in which to select the IRI (can be also the diagram id)
   */
  selectElem(id, diagramID = this.actualDiagramID || 0) {
    this.ontology.getDiagram(diagramID)?.selectElem(id)
  }

  /**
   * Set viewport state.
   * @param {import('./rendering/renderers/default-renderer').ViewportState} state - 
   * object representation of **rendered position** in 
   * [cytoscape format](https://js.cytoscape.org/#notation/position).
   *
   * > Example: { x: 0, y: 0, zoom: 1} - initial state
   */
  setViewport(state) {
    if (state) this.renderersManager.setViewport(state)
  }

  zoomIn(zoomValue = this.ZOOM_STEP_VALUE) { this.renderersManager.zoomIn(zoomValue) }
  zoomOut(zoomValue = this.ZOOM_STEP_VALUE) { this.renderersManager.zoomOut(zoomValue) }

  /**
   * Register a callback to be called on a filter activation
   * @param {filterOnCallback} callback 
   */
  onFilter(callback) { this._callbacksFilterOn.push(callback) }

  /**
   * Activate a predefined filter or execute a custom filter on a selector
   * @param {string | Filter} filterType The name of the predefined filter to execute
   * or a custom Filter obj
   */
  filter(filterType) {
    /** @type {Filter} */
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType

    this.renderersManager.filter(filterObj)
    filterObj['key'] = Object.keys(this.filterList).find(f => f === filterObj)
    this._callbacksFilterOn.forEach(fn => fn(filterObj))
  }

  isDefinedFilter(filterType) {
    return this.filterList[filterType] ? true : false
  }

  /**
   * deactivate a predefined filter or execute a custom filter on a selector
   * @param {string | Filter} filterType The name of the predefined filter to execute
   * or a custom Filter obj
   */
  unfilter(filterType) {
    /** @type {Filter} */
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType

    this.renderersManager.unfilter(filterObj)

    this._callbacksFilterOff.forEach(fn => fn(filterObj))
  }

  /** @param {themeChangeCallback} callback */
  onThemeChange(callback) { this._callbacksThemeChange.push(callback) }
  /**
   * Apply an existing theme or pass a new custom theme that will be added and then applied
   * Please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @param {string | Theme } themeKey a predefined theme key or a custom Theme object
   */
  applyTheme(themeKey) {
    if (themeKey === this.themesController.actualTheme) return

    let normalizedTheme = this.themesController.getTheme(themeKey)
    if (!normalizedTheme) { // if it's not defined then maybe it's a custom theme
      try {
        themeKey = this.addTheme(themeKey) // addTheme returns the key of the new added theme
        normalizedTheme = this.themesController.getTheme(themeKey)
      } catch {
        console.error('The specified theme is not a valid theme, please read: https://github.com/obdasystems/grapholscape/wiki/Themes')
        return
      }
    }

    this.container.style.background = normalizedTheme.background // prevent black background on fullscreen

    // set custom properties on container so the gui widgets can use these new colours
    let prefix = '--theme-gscape-'
    Object.keys(normalizedTheme).forEach(key => {
      let css_key = prefix + key.replace(/_/g, '-')
      this.container.style.setProperty(css_key, normalizedTheme[key])
    })


    this.renderersManager.setTheme(normalizedTheme) // set graph style based on new theme
    this.themesController.actualTheme = themeKey
    this._callbacksThemeChange.forEach(fn => fn(normalizedTheme))
  }

  /**
   * Register a new theme
   * @param {Theme} theme a theme object, please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @returns {string} the key assigned to the new theme for later setting it
   */
  addTheme(theme) {
    let custom_theme_value = `custom${this.config.rendering.theme.list.length}`

    this.config.rendering.theme.list.push({
      value: custom_theme_value,
      label: theme.name || `Custom${this.config.rendering.theme.list.length}`
    })


    // update selected theme unless new them is set with selected = false
    if (theme.selected == undefined || theme.selected == true) {
      this.config.rendering.theme.selected = custom_theme_value
    }
    // remove metadata from theme in order to get only colours
    delete theme.name
    delete theme.selected

    this.themesController.addTheme(theme, custom_theme_value)
    return custom_theme_value
  }

  /** @param {entityNameTypeChangeCallback} callback */
  onEntityNameTypeChange(callback) { this._callbacksEntityNameTypeChange.push(callback) }

  /**
   * Change displayed names on entities using label in the selected language, full or prefixed IRI
   * @param {EntityNameType} entityNameType 
   */
  changeEntityNameType(entityNameType) {
    this.config.preferences.entity_name.selected = entityNameType
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)
    this._callbacksEntityNameTypeChange.forEach(fn => fn(entityNameType))
  }

  onLanguageChange(callback) { this._callbacksLanguageChange.push(callback) }

  /**
   * Change the language of entities names
   * @param {string} language a languageKey (Language.value), you can find defined languages in Grapholscape.languages.list
   */
  changeLanguage(language) {
    this.config.preferences.language.selected = language
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)
    this._callbacksLanguageChange.forEach(fn => fn(language))
  }

  /**
   * Export the current diagram in to a PNG image and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToPNG(fileName = this.exportFileName) {
    fileName = fileName + '.png'
    exporter.toPNG(fileName, this.renderer.cy, this.themesController.actualTheme.background)
  }

  /**
   * Export the current diagram in to a SVG file and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToSVG(fileName = this.exportFileName) {
    fileName = fileName + '.svg'
    exporter.toSVG(fileName, this.renderer.cy, this.themesController.actualTheme.background)
  }

  /**
   * Update the actual configuration and apply changes.
   * @param {Object} new_config - a configuration object. Please read [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   */
  setConfig(new_config) {
    Object.keys(new_config).forEach(entry => {

      // if custom theme
      if (entry == 'theme' && typeof (new_config[entry]) == 'object') {
        this.addTheme(new_config[entry])
      } else {
        for (let area in this.config) {
          try {
            let setting = this.config[area][entry]
            if (setting) {
              // apply custom settings only if they match type and are defined in lists
              if (setting.type == 'boolean' && typeof (new_config[entry]) == 'boolean')
                this.config[area][entry].enabled = new_config[entry]
              else if (this.config[area][entry].list.map(elm => elm.value).includes(new_config[entry]))
                this.config[area][entry].selected = new_config[entry]
            }
          } catch (e) {
            console.warn(`Custom default setting [${entry}] not recognized`)
          }
        }
      }
    })
  }

  /**
   * Set a callback to be called on a wiki redirection.
   * @param {function} callback the function to call on a wiki redirection, it will be passed the IRI to redirect to
   */
  onWikiClick(callback) {
    this._callbacksWikiClick.push(callback)
  }

  wikiRedirectTo(iri) {
    this._callbacksWikiClick.forEach(fn => fn(iri))
  }

  /**
   * @returns {Ontology}
   */
  get ontology() {
    return this.ontologies[this.actualRenderingMode] || this.ontologies.default
  }

  /**
   * Filename for exports
   * @returns {string} string in the form: "[ontology name]-[diagram name]-v[ontology version]"
   */
  get exportFileName() {
    return `${this.ontology.name}-${this.actualDiagram.name}-v${this.ontology.version}`
  }

  get renderer() { return this.renderersManager.renderer }

  get container() { return this.renderersManager.container }
  get graphContainer() { return this.renderersManager.graphContainer }

  /** @returns {Languages} */
  get languages() {
    return {
      /** @type {string} */
      selected: this.config.preferences.language.selected,
      /** @type {string} */
      default: this.defaultLanguage,
      /** @type {Language[]} */
      list: this.config.preferences.language.list
    }
  }

  /** @returns {Filter[]} */
  get filterList() { return this.config.widgets.filters.filter_list }

  get themes() { return this.themesController.themes }

  /** @returns {string | number} */
  get actualDiagramID() { return this.renderersManager.actualDiagramID }

  /** @returns {string} */
  get actualRenderingMode() { return this.renderer.key }

  /** @returns {EntityNameType} */
  get actualEntityNameType() { return this.config.preferences.entity_name.selected }

}
