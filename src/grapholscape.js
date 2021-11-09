import defaultConfig from "./config.json";
import * as exporter from './exporting';
import Ontology from "./model";
import initRenderersManager from './rendering';
import ThemesController from "./style/themes-controller";
import { diagramModelToViewData, entityModelToViewData } from "./util/model-to-view-data";
import computeSimplifiedOntologies from "./util/simplifier"


export default class Grapholscape {
  // TODO move this comment on index.js and make it merge it in doc/api.md
  /**
   * Create a core object of Grapholscape
   * @param {!Ontology} ontology An Ontology object
   * @param {object} container DOM element in which grapholscape will render the ontology
   * @param {?object} customConfig JSON of custom default settings, check out 
   * [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   */
  constructor(ontology, container, customConfig = null) {
    this.config = JSON.parse(JSON.stringify(defaultConfig)) //create copy
    
    // set language
    this.config.preferences.language.list = ontology.languages.list.map(lang => {
      return {
        "label" : lang,
        "value" : lang,
      }
    })

    this.defaultLanguage = ontology.languages.default

    // if not selected in config, select the default one
    let selectedLanguage = this.config.preferences.language.selected
    if ( selectedLanguage == '')
      this.config.preferences.language.selected = this.defaultLanguage
    else {
      // if language is not supported by ontology, add it in the list
      // only for consistency : user defined it so he wants to see it
      if (!ontology.languages.list.includes(selectedLanguage))
        this.config.preferences.language.list.push({
          "label" : selectedLanguage + ' - unsupported' ,
          "value" : selectedLanguage
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
    

    this.themesController = new ThemesController()

    if (customConfig?.renderers) {
      this.renderersManager = initRenderersManager(container, customConfig.renderers)
    } else {
      this.renderersManager = initRenderersManager(container, ['default', 'lite', 'float'])
    }

    this.renderersManager.onEdgeSelection = this.handleEdgeSelection.bind(this)
    this.renderersManager.onNodeSelection = this.handleNodeSelection.bind(this)
    this.renderersManager.onBackgroundClick = this.handleBackgroundClick.bind(this)
    
    this.applyTheme('gscape')

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
      .catch(reason => {
        console.log(reason)
      })


    if (customConfig) this.setConfig(customConfig)
  }

  onEntitySelection(callback) { this._callbacksEntitySelection.push(callback) }

  /**
   * Register a new callback to be called on a node selection
   * @param {function} callback 
   */
  onNodeSelection(callback) { this._callbacksNodeSelection.push(callback) }

  handleNodeSelection(nodeID, nodeDiagramID) {
    let nodeModelData = this.ontology.getElemByDiagramAndId(nodeID, nodeDiagramID)

    if (nodeModelData.classes.includes('predicate')) {
      let entityViewData = entityModelToViewData(nodeModelData, this.languages)
      this._callbacksEntitySelection.forEach(fn => fn(entityViewData))
    }

    this._callbacksNodeSelection.forEach(fn => fn(nodeModelData))
  }

  /**
   * Register a new callback to be called on a edge selection
   * @param {function} callback 
   */
  onEdgeSelection(callback) { this._callbacksEdgeSelection.push(callback) }

  handleEdgeSelection(edgeID, edgeDiagramID) {
    let edgeModelData = this.ontology.getElemByDiagramAndId(edgeID, edgeDiagramID)
    if (edgeModelData.classes.includes('predicate')) {
      let entityViewData = entityModelToViewData(edgeModelData, this.languages)
      this._callbacksEntitySelection.forEach(fn => fn(entityViewData))
    }

    this._callbacksEdgeSelection.forEach(fn => fn(edgeModelData))
  }

  /**
   * Register a new callback to be called on a background click
   * @param {function} callback 
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
   * @param {JSON | string | number} diagramModelData The diagram retrieved from model, its name or it's id
   * @param {function} callback optional callback to execute after a diagram change
   */
  showDiagram(diagramModelData) {
    if (typeof diagramModelData == 'string' || typeof diagramModelData == 'number') {
      diagramModelData = this.ontology.getDiagram(diagramModelData)
    }

    if (!diagramModelData) {
      console.warn('diagram not existing')
      return
    }

    let diagramViewData = diagramModelToViewData(diagramModelData)
    this.renderersManager.drawDiagram(diagramViewData)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)

    Object.keys(this.filterList).forEach(key => {
      let filter = this.filterList[key]
      if (filter.active) this.renderersManager.filter(filter)
    })
    this._callbacksDiagramChange.forEach(fn => fn(diagramViewData))
  }

  /**
   * Focus on a single node and zoom on it.
   * If necessary it also display the diagram containing the node.
   * @param {number} nodeID - The node unique ID
   * @param {number?} zoom - The zoom level to apply (Default: 1.5)
   */
  centerOnNode(nodeID, zoom = 1.5) {
    // get diagram id containing the node
    let nodeDiagramID = this.ontology.getElem(nodeID).data.diagram_id
    if (this.renderersManager.actualDiagramID != nodeDiagramID) {
      this.showDiagram(nodeDiagramID)
    }

    this.renderersManager.centerOnNode(nodeID, zoom)

    /**
    let nodeViewData = {
      id : nodeModelData.data.id,
      position : nodeModelData.position,
    }

    this.view.centerOnNode(nodeViewData, zoom)
    */
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
   * @param {boolean} keepViewportState - if `false`, viewport will fit on diagram.
   * Set it `true` if you don't want the viewport state to change.
   * In case of no diagram displayed yet, it will be forced to `false`.
   * Default: `true`.
   *
   * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
   */
  setRenderer(rendererKey, keepViewportState = true) {
    // TODO maintain selected entities selected
    if (rendererKey === this.renderer.key) return

    switch (rendererKey) {
      // for simplified ontologies wait for them to be computed
      case 'lite':
      case 'float': {
        this.SimplifiedOntologyPromise.then(() => {
          performChange.bind(this)()
        })
        break
      }
      default: {
        performChange.bind(this)()
        break
      }
    }

    function performChange() {
      this.renderersManager.setRenderer(rendererKey, keepViewportState)

      Object.keys(this.filterList).forEach(filterKey => {
        this.filterList[filterKey].disabled = this.renderer.disabledFilters.includes(filterKey)
      })
      this.showDiagram(this.actualDiagramID)
      this._callbacksRendererChange.forEach(fn => fn(rendererKey))
    }


  }

  /**
   * Set viewport state.
   * @param {object} state - object representation of **rendered position** in [cytoscape format](https://js.cytoscape.org/#notation/position).
   *
   * > Example: { x: 0, y: 0, zoom: 1} - initial state
   */
  setViewPort(state) {
    if (state) this.renderersManager.setViewPort(state)
  }

  zoomIn() { this.renderersManager.zoomIn() }
  zoomOut() { this.renderersManager.zoomOut() }

  onFilter(callback) { this._callbacksFilterOn.push(callback) }

  /**
   * Activate a predefined filter or execute a custom filter on a selector
   * @param {string | object} filterType The name of the predefined filter to execute
   * or a custom filter
   * @param {string} filterType.selector the cytoscape selector, read more about
   * [cytoscape selectors](https://js.cytoscape.org/#selectors)
   * @param {string} filterType.class the class (css) that will be added to filtered elems
   */
  filter(filterType) {
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType

    let filteredElems = this.renderersManager.filter(filterObj)

    this._callbacksFilterOn.forEach(fn => fn(filteredElems))
  }

  isDefinedFilter(filterType) {
    return this.filterList[filterType] ? true : false
  }

  /**
   * deactivate a predefined filter or execute a custom filter on a selector
   * @param {string} filterType The name of the predefined filter to execute
   * or the cytoscape selector defining a custom filter, read more about
   * [cytoscape selectors](https://js.cytoscape.org/#selectors)
   */
  unfilter(filterType) {
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType

    let unFilteredElems = this.renderersManager.unfilter(filterObj)

    this._callbacksFilterOff.forEach(fn => fn(unFilteredElems))
  }

  /**
   * Apply an existing theme or pass a new custom theme that will be added and then applied
   * @param {string | object } theme a predefined theme name or a custom theme
   */
  applyTheme(theme) {
    let normalizedTheme = this.themesController.getTheme(theme)
    if (!normalizedTheme) {
      try {
        this.addTheme(theme)
      } catch { return }
    }

    this.container.style.background = normalizedTheme.background // prevent black background on fullscreen
    
    // set custom properties on container so the gui widgets can use these new colours
    let prefix = '--theme-gscape-'
    Object.keys(normalizedTheme).forEach( key => {
      let css_key = prefix + key.replace(/_/g,'-')
      this.container.style.setProperty(css_key, normalizedTheme[key])
    })

    
    this.renderersManager.setTheme(normalizedTheme) // set graph style based on new theme
    this.themesController.actualTheme = theme
  }

  /**
   * 
   * @param {object} theme add a new custom
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
  }

  changeEntityNameType(entityNameType) {
    this.config.preferences.entity_name.selected = entityNameType
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)
  }

  changeLanguage(language) {
    this.config.preferences.language.selected = language
    // update displayed names (if label is selected then update the label language)
    this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)
  }

  /**
   * Export the current diagram in to a PNG image and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToPNG(fileName = this.exportFileName) {
    fileName = fileName + '.png'
    exporter.toPNG(fileName, this.renderer.cy, this.themesController.actualTheme.background)

    //this.onExportToPNG()
  }

  /**
   * Export the current diagram in to a SVG file and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToSVG(fileName = this.exportFileName) {
    fileName = fileName + '.svg'
    exporter.toSVG(fileName, this.renderer.cy, this.themesController.actualTheme.background)

    //this.onExportToSVG()
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

  get ontology() {
    return this.ontologies[this.actualRenderingMode] || this.ontologies.default
  }

  /*
   ** Filename for exports: [ontology name]-[diagram name]-v[ontology version])
   */
  get exportFileName() {
    return `${this.ontology.name}-${this.actualDiagram.name}-v${this.ontology.version}`
  }

  get renderer() { return this.renderersManager.renderer }

  get container() { return this.renderersManager.container }

  get graphContainer() { return this.renderersManager.graphContainer }

  get languages() {
    return {
      selected: this.config.preferences.language.selected ,
      default: this.defaultLanguage,
      list: this.config.preferences.language.list
    }
  }

  get filterList() { return this.config.widgets.filters.filter_list }

  get themes() { return this.themesController.themes }

  get actualDiagramID() { return this.renderersManager.actualDiagramID }

  get actualRenderingMode() { return this.renderer.key }

  get actualEntityNameType() { return this.config.preferences.entity_name.selected }

  get selectedEntities() {
    return this.renderersManager.renderer.cy.$('.predicates:selected')
  }
}
