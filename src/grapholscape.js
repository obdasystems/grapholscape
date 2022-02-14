/** @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue */
/** @typedef {import('./rendering/renderers/index').GrapholscapeRenderer} Renderer */
/** @typedef {'label' | 'full' | 'prefixed'} EntityNameType */

/** 
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active
 * @property {boolean} Filter.disabled
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key
 */

/** 
 * @typedef {Object} Language
 * @property {string} label - string representation to be visualized
 * @property {string} value - identifier of the language
 */

/** 
 * @typedef {Object} Languages
 * @property {string} selected - key value in config.json of the selected language
 * @property {string} default - key value of the default language defined in the ontology
 * @property {Language[]} list - list of languages supported by the ontology
 */

/**
 * @callback elemSelectionCallbak
 * @param {CollectionReturnValue} selectedElem
 */

/**
 * @callback entitySelectionCallbak
 * @param {CollectionReturnValue} selectedEntity
 */

/**
 * @callback backgroundClickCallback
 */

/**
 * @callback diagramChangeCallback
 * @param {import('./model/index').Diagram} newDiagram
 */

/**
 * @callback rendererChangeCallback
 * @param {string} newRenderer
 */

/**
 * @callback filterCallback
 * @param {Filter} filterObj
 */

/**
 * @callback themeChangeCallback
 * @param {import('./style/themes').Theme} newTheme
 */

/**
 * @callback entityNameTypeChangeCallback
 * @param {EntityNameType} newEntityNameType
 */

import defaultConfig from "./config/config.json";
import * as ConfigManager from "./config/config-manager"
import * as exporter from './exporting';
import Ontology from "./model";
import initRenderersManager from './rendering';
import ThemesController from "./style/themes-controller";
import { cyToGrapholElem } from "./util/model-obj-transformations";
import computeSimplifiedOntologies from "./util/simplifier"

class Grapholscape {
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

    /**
     * @type {string} the iri of the current selected Entity
     */
    this.selectedEntityIri = null

    this.renderersManager.onEelemSelection(selectedElem => this.handleElemSelection(selectedElem))
    this.renderersManager.onBackgroundClick(_ => this.handleBackgroundClick())

    this.ontologies = {
      default: ontology,
      lite: null,
      float: null
    }

    if (this.shouldSimplify) {
      this.SimplifiedOntologyPromise = computeSimplifiedOntologies(ontology)
        .then(result => {
          this.ontologies.lite = result.lite
          this.ontologies.float = result.float
        })
        .catch(reason => { console.error(reason) })
    }

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
   * @param {elemSelectionCallbak} callback 
   */
  onNodeSelection(callback) { this._callbacksNodeSelection.push(callback) }

  /**
   * Function handling the selection of a node on a diagram [called by renderer]
   * @param {CollectionReturnValue} elem 
   */
  handleElemSelection(elem) {
    const grapholElem = cyToGrapholElem(elem)
    if (grapholElem.isEntity()) {
      this.selectedEntityIri = grapholElem.data.iri.fullIri
      this._callbacksEntitySelection.forEach(fn => fn(elem))
    } else {
      this.unselectEntity([this.actualDiagramID])
    }

    if (elem.isNode())
      this._callbacksNodeSelection.forEach(fn => fn(elem))
    else
      this._callbacksEdgeSelection.forEach(fn => fn(elem))
  }

  /**
   * Register a new callback to be called on a edge selection
   * @param {elemSelectionCallbak} callback 
   */
  onEdgeSelection(callback) { this._callbacksEdgeSelection.push(callback) }

  /**
   * Register a new callback to be called on a background click
   * @param {backgroundClickCallback} callback 
   */
  onBackgroundClick(callback) {
    this._callbacksBackgroundClick.push(callback)
  }

  handleBackgroundClick() {
    this.unselectEntity([this.actualDiagramID])
    this._callbacksBackgroundClick.forEach(fn => fn())
  }

  /**
   * Unselect the current selected entity in every diagram
   * @param {string[]} [diagramsToSkip = []] array of diagram IDs to be skipped
   */
  unselectEntity(diagramsToSkip = []) {
    for (const key in this.ontologies) {
      this.ontologies[key].diagrams.forEach(d => {
        if (!diagramsToSkip.includes(d.id) || this.ontologies[key] !== this.ontology) {
          d.unselectAll()
        }
      })
    }
    this.selectedEntityIri = null
  }

  /**
   * Register a new callback to be called on a diagram change
   * @param {diagramChangeCallback} callback 
   */
  onDiagramChange(callback) { this._callbacksDiagramChange.push(callback) }

  /**
   * Display a diagram on the screen.
   * @param {Diagram | string | number} diagram The diagram retrieved from model, its name or it's id
   * @param {import("./rendering/renderer-manager").ViewportState} viewportState the viewPortState of the viewport,
   * if you don't pass it, viewport won't change unless it's the first time you draw such diagram. In this case
   * viewport will fit to diagram.
   */
  showDiagram(diagram, viewportState = null) {
    const showDiagram = () => {
      if (typeof diagram == 'string' || typeof diagram == 'number') {
        diagram = this.ontology.getDiagram(diagram)
      }

      if (!diagram) {
        console.warn('diagram not existing')
        return
      }

      const isFirstTimeRendering = diagram.hasEverBeenRendered
      this.renderersManager.drawDiagram(diagram)
      if (viewportState)
        this.renderersManager.setViewport(viewportState)
      else if (!isFirstTimeRendering) {
        this.renderersManager.fit()
      }
      this.renderersManager.updateDisplayedNames(this.actualEntityNameType, this.languages)

      Object.keys(this.filterList).forEach(key => {
        let filter = this.filterList[key]
        if (filter.active) this.renderersManager.filter(filter)
      })

      // simulate selection on old selected entity, this updates UI too
      if (this.selectedEntityIri) {
        this.selectEntityOccurrences(this.selectedEntityIri)
      }

      this._callbacksDiagramChange.forEach(fn => fn(diagram))
    }

    this.performActionInvolvingOntology(showDiagram)
  }

  /**
   * Select a single node and zoom on it.
   * If necessary it also display the diagram containing the node.
   * @param {string} nodeID - The node unique ID
   * @param {number?} zoom - The zoom level to apply (Default: 1.5)
   */
  centerOnNode(nodeID, zoom = 1.5) {
    const centerOnNode = () => {
      // get diagram id containing the node
      let elem = this.ontology.getElem(nodeID)
      if (!elem) {
        console.warn(`Could not find any element with id=${nodeID} in the actual ontology, try to change renderer`)
        return
      }
      let nodeDiagramID = cyToGrapholElem(this.ontology.getElem(nodeID)).data.diagram_id
      if (this.actualDiagramID != nodeDiagramID) {
        this.showDiagram(nodeDiagramID)
        /**
         * hack in case of actual renderer is based on simplifications.
         * In that case, if we call centerOnNode on renderer immediately, it will be performed
         * before the new diagram has been drawn, this because showDiagram will wait for
         * the simplified ontology promise to be resolved. (showDiagram is async).
         * Calling again this same function will wait again for that promise to be
         * fulfilled and for sure the right diagram will be drawn.
         */
        if (this.shouldWaitSimplifyPromise) {
          this.centerOnNode(nodeID, zoom)
          return
        }
      }

      this.renderersManager.centerOnNode(nodeID, zoom)
    }

    this.performActionInvolvingOntology(centerOnNode)
  }

  /**
   * Register a new callback to be called on a renderer change
   * @param {rendererChangeCallback} callback 
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
    const setRenderer = () => {
      let viewportState = keepViewportState ? this.renderersManager.actualViewportState : null

      // let selectedEntities = {}
      // // get selected entity in each diagram
      // this.ontology.diagrams.forEach(diagram => {
      //   if (diagram.getSelectedEntity())
      //     selectedEntities[diagram.id] = cyToGrapholElem(diagram.getSelectedEntity())
      // })

      this.renderersManager.setRenderer(rendererKey)

      Object.keys(this.filterList).forEach(filterKey => {
        this.filterList[filterKey].disabled = this.renderer.disabledFilters.includes(filterKey)
      })

      this.showDiagram(this.actualDiagramID, viewportState)
      // for each selected entity in each diagram, select it again in the new renderer
      // Object.keys(selectedEntities).forEach(diagramID => {
      //   this.selectEntityOccurrences(selectedEntities[diagramID].data.iri.fullIri, diagramID)
      // })
      if (this.selectedEntityIri) {
        this.selectEntityOccurrences(this.selectedEntityIri)
      }

      this._callbacksRendererChange.forEach(fn => fn(rendererKey))
    }

    let oldRendererKey = this.renderer.key

    if (rendererKey === oldRendererKey) return
    // if we come or are going to float renderer then never keep the old viewport state
    keepViewportState = keepViewportState &&
      !(oldRendererKey == 'float' || rendererKey == 'float')

    this.performActionInvolvingOntology(setRenderer)
  }

  /**
   * Select an entity by its IRI and the diagram it belongs to.
   * If you don't specify a diagram, actual diagram will be used if it exists and if it contains
   * any occurrence of the specified entity IRI, otherwise the diagram of the first entity IRI
   * occurrence will be used.
   * @param {string} iri the IRI of the entity to select in full or prefixed form
   * @param {Diagram | number | string} [diagram] The diagram in which to select the IRI (can be
   * also the diagram id).
   */
  selectEntityOccurrences(iri, diagram) {
    const selectEntityOccurrences = () => {
      let diagramID = ''
      if (typeof (diagram) === 'object')
        diagramID = diagram.id
      else
        diagramID = this.ontology.getDiagram(diagram)?.id

      const iriOccurrences = this.ontology.getEntityOccurrences(iri)

      if (!iriOccurrences || iriOccurrences.length === 0) {
        console.warn(`Could not find any entity with "${iri}" as prefixed or full IRI`)
        return
      }

      if (!diagramID) {
        iriOccurrences.forEach(elem => this.selectElem(cyToGrapholElem(elem).data.id))
      } else {
        iriOccurrences.forEach(entity => {
          const grapholEntity = cyToGrapholElem(entity)
          if (grapholEntity.data.diagram_id === diagramID) {
            this.selectElem(grapholEntity.data.id)
          }
        })
      }
    }

    this.performActionInvolvingOntology(selectEntityOccurrences)
  }

  /**
   * Select a node or an edge given its unique id.
   * It does not change diagram nor viewport state.
   * If you want to select and focus viewport on a node,
   * you should use {@link centerOnNode}.
   * @param {string} id unique elem id (node or edge)
   * @param {number | string} [diagram] The diagram in which to select the IRI (can be also the diagram id)
   */
  selectElem(id, diagram) {
    const selectElem = () => {
      if (!diagram) {
        diagram = cyToGrapholElem(this.ontology.getElem(id)).data.diagram_id
      }
      this.ontology.getDiagram(diagram)?.selectElem(id)
    }
    this.performActionInvolvingOntology(selectElem)
  }

  /**
   * Set viewport state.
   * @param {import('./rendering/renderer-manager').ViewportState} state - 
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
  fit() { this.renderersManager.fit() }
  /**
   * Register a callback to be called on a filter activation
   * @param {filterCallback} callback 
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

    if (this.isDefinedFilter(filterType)) {
      this.filterList[filterType].active = true
    }

    this.renderersManager.filter(filterObj)
    filterObj['key'] = Object.keys(this.filterList).find(key => this.filterList[key] === filterObj)
    this._callbacksFilterOn.forEach(fn => fn(filterObj))
  }

  isDefinedFilter(filterType) {
    return this.filterList[filterType] ? true : false
  }

  /** @param {filterCallback} callback */
  onUnfilter(callback) { this._callbacksFilterOff.push(callback) }

  /**
   * deactivate a predefined filter or execute a custom filter on a selector
   * @param {string | Filter} filterType The name of the predefined filter to execute
   * or a custom Filter obj
   */
  unfilter(filterType) {
    /** @type {Filter} */
    let filterObj = this.isDefinedFilter(filterType) ?
      this.filterList[filterType] : filterType

    if (this.isDefinedFilter(filterType))
      this.filterList[filterType].active = false

    this.renderersManager.unfilter(filterObj)

    this._callbacksFilterOff.forEach(fn => fn(filterObj))
  }

  /** @param {themeChangeCallback} callback */
  onThemeChange(callback) { this._callbacksThemeChange.push(callback) }

  /**
   * Apply an existing theme or pass a new custom theme that will be added and then applied
   * Please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @param {string | import('./style/themes').Theme } themeKey a predefined theme key or a custom Theme object
   * @tutorial Themes
   */
  applyTheme(themeKey) {
    if (themeKey === this.themesController.actualTheme) return

    let normalizedTheme = this.themesController.getTheme(themeKey)
    if (!normalizedTheme) { // if it's not defined then maybe it's a custom theme
      try {
        this.addTheme(themeKey) // addTheme returns the key of the new added theme
      } catch (e) {
        console.error('The specified theme is not a valid theme, please read: https://github.com/obdasystems/grapholscape/wiki/Themes')
        console.error(e)
        return
      }
      normalizedTheme = this.themesController.getTheme(themeKey.id)
      if (!normalizedTheme) return
      themeKey = themeKey.id
    }

    this.container.style.background = normalizedTheme.background // prevent black background on fullscreen

    // set custom properties on container so the gui widgets can use these new colours
    let prefix = '--theme-gscape-'
    Object.keys(normalizedTheme).forEach(key => {
      let css_key = prefix + key.replace(/_/g, '-')
      this.container.style.setProperty(css_key, normalizedTheme[key])
    })

    this.config.rendering.theme.selected = themeKey
    this.renderersManager.setTheme(normalizedTheme) // set graph style based on new theme
    this.themesController.actualTheme = themeKey
    ConfigManager.storeConfigEntry('theme', themeKey)
    this._callbacksThemeChange.forEach(fn => fn(normalizedTheme, themeKey))
  }

  /**
   * Register a new theme
   * @param {import('./style/themes').Theme} theme a theme object, please read more about [themes](https://github.com/obdasystems/grapholscape/wiki/Themes)
   * @tutorial Themes
   */
  addTheme(theme) {
    if (!theme.id) {
      throw (new Error('The custom theme you specified must have a declared unique "id" property'))
    }

    this.config.rendering.theme.list.push({
      value: theme.id,
      label: theme.name || theme.id
    })


    // update selected theme unless new them is set with selected = false
    if (theme.selected == undefined || theme.selected == true) {
      this.config.rendering.theme.selected = theme.id
    }
    // remove metadata from theme in order to get only colours
    delete theme.name
    delete theme.selected

    this.themesController.addTheme(theme, theme.id)
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
    ConfigManager.storeConfigEntry('entity_name', entityNameType)
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
    ConfigManager.storeConfigEntry('language', language)
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
   * @tutorial Settings
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
   * @type {Ontology}
   */
  get ontology() {
    return this.ontologies[this.actualRenderingMode] || this.ontologies.default
  }

  /**
   * Filename for exports
   * string in the form: "[ontology name]-[diagram name]-v[ontology version]"
   * @type {string}
   */
  get exportFileName() {
    const diagramName = this.ontology.getDiagram(this.actualDiagramID).name
    return `${this.ontology.name}-${diagramName}-v${this.ontology.version}`
  }

  get renderer() { return this.renderersManager.renderer }

  get container() { return this.renderersManager.container }
  get graphContainer() { return this.renderersManager.graphContainer }

  /** @type {Languages} */
  get languages() {
    return {
      selected: this.config.preferences.language.selected,
      default: this.defaultLanguage,
      list: this.config.preferences.language.list
    }
  }

  /** @type {Filter[]} */
  get filterList() { return this.config.widgets.filters.filter_list }

  get themes() { return this.themesController.themes }

  /** @type {string | number} */
  get actualDiagramID() { return this.renderersManager.actualDiagramID }

  /** @type {string} */
  get actualRenderingMode() { return this.renderer?.key }

  /** @type {EntityNameType} */
  get actualEntityNameType() { return this.config.preferences.entity_name.selected }

  /**
   * Whether grapholscape should perform simplifications or not
   * used to wait for result in case 'lite' or 'float' renderer
   * is selected.
   * @type {boolean}
   */
  get shouldSimplify() {
    let rendererKeys = Object.keys(this.renderersManager.renderers)
    return rendererKeys.includes('lite') || rendererKeys.includes('float')
  }

  get shouldWaitSimplifyPromise() {
    return this.renderer.key !== 'default'
  }

  /**
   * Perform any action that might be using simplified ontologies,
   * this ensures the action to be performed only when such
   * ontology is available.
   * @param {function} callback the function to execute
   */
  performActionInvolvingOntology(callback) {
    if (this.shouldSimplify && this.shouldWaitSimplifyPromise) {
      this.SimplifiedOntologyPromise.then(() => callback())
    } else {
      callback()
    }
  }
}

/** @type {Grapholscape} */
export default Grapholscape