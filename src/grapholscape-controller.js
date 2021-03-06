/**
 * # GrapholscapeController - API
 * an object of this class is returned to the promise when reading a graphol file.
 * It expose a set of methods to set filters, change viewport state etc.
 *
 * @version [!!version!!]  <!-- don't touch, automatic version injection, see src/doc/doc.js -->
 */

import OwlTranslator from "./util/owl"
import computeSimplifiedOntologies from "./util/simplifier"
import * as default_config from "./config.json"
import downloadBlob from "./util/download_blob"

export default class GrapholscapeController {
  constructor(ontology, view = null, custom_config = null) {
    this.view = view
    this._ontology = ontology

    this.config = JSON.parse(JSON.stringify(default_config)) //create copy
    if(custom_config) this.setConfig(custom_config) // update default config, if passed
    // set language
    this.config.preferences.language.list = ontology.languages.map(lang => {
      return {
        "label" : lang,
        "value" : lang,
      }
    })
    this.default_language = ontology.default_language
    // if not selected in config, select default
    let selected_language = this.config.preferences.language.selected
    if ( selected_language == '')
      this.config.preferences.language.selected = this.default_language
    else {
      // if language is not supported by ontology, add it in the list
      // only for consistency : user defined it so he wants to see it
      if (!ontology.languages.includes(selected_language))
        this.config.preferences.language.list.push({
          "label" : selected_language + ' - unsupported' ,
          "value" : selected_language
        })
    }

    this.ontologies = {
      default: ontology,
      lite: null,
      float: null
    }

    this.owl_translator = new OwlTranslator()
    this.actualMode = 'default'
    this.SimplifiedOntologyPromise = computeSimplifiedOntologies(ontology)
      .then( result => {
        this.ontologies.lite = result.lite
        this.ontologies.float = result.float
      } )
      .catch( reason => {
        console.log(reason)
      })

    if ( this.config.preferences.entity_name.selected !=
      default_config.preferences.entity_name.selected )
      this.onEntityNameTypeChange(this.config.preferences.entity_name.selected)

    if ( this.config.preferences.language.selected !=
      default_config.preferences.language.selected)
      this.onLanguageChange(this.config.preferences.language.selected)
  }

  /**
   * Initialize controller
   *  - bind all event listener for the view
   *  - create all widgets with actual config and ontology infos
   */
  init() {
    let diagramsModelData = this.ontology.diagrams
    let entitiesModelData = this.ontology.getEntities()

    let diagramsViewData = diagramsModelData.map(diagram => this.diagramModelToViewData(diagram))
    let entitiesViewData = entitiesModelData.map(entity => this.entityModelToViewData(entity))
    let ontologyViewData = {
      name : this.ontology.name,
      version : this.ontology.version,
      namespaces : this.ontology.namespaces,
      annotations : this.ontology.annotations,
      description : this.ontology.description
    }

    // event handlers
    this.view.onDiagramChange = this.onDiagramChange.bind(this)
    this.view.onNodeNavigation = this.onNodeNavigation.bind(this)
    this.view.onEntitySelection = this.onEntitySelection.bind(this)
    this.view.onNodeSelection = this.onNodeSelection.bind(this)
    this.view.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.view.onEdgeSelection = this.onEdgeSelection.bind(this)
    this.view.onRenderingModeChange = this.changeRenderingMode.bind(this)
    this.view.onEntityNameTypeChange = this.onEntityNameTypeChange.bind(this)
    this.view.onLanguageChange = this.onLanguageChange.bind(this)
    this.view.onExportToPNG = this.exportToPNG.bind(this)
    this.view.onExportToSVG = this.exportToSVG.bind(this)

    this.view.createUi(ontologyViewData, diagramsViewData, entitiesViewData, this.config)
  }

  /**
   * Event handler for clicks on empty area of the graph.
   * It collapse all widgets' body.
   */
  onBackgroundClick() {
    this.view.blurAll()
  }

  /**
   * Activate one of the defined filters.
   * @param {String} type - one of `all`, `attributes`, `value-domain`, `individuals`, `universal`, `not`
   */
  filter(type) {
    this.view.filter(type)
  }

  /*
   * Event handler for the click on a node in the explorer widget.
   * Focus on the node and show its details
   * @param {String} node_id - the id of the node to navigate to
   */
  onNodeNavigation(node_id) {
    let node = this.ontology.getElem(node_id)
    this.centerOnNode(node, 1.5)
    this.showDetails(node)
  }

  /*
   * Event handler for a digram change.
   * @param {string} diagram_index The index of the diagram to display
   */
  onDiagramChange(diagram_index) {
    let diagram = this.ontology.getDiagram(diagram_index)
    this.showDiagram(diagram)
  }

  /**
   * Display a diagram on the screen.
   * @param {JSON | string | number} diagramModelData The diagram retrieved from model, its name or it's id
   */
  showDiagram(diagramModelData) {
    if( typeof diagramModelData == 'string' || typeof diagramModelData == 'number') {
      diagramModelData = this.ontology.getDiagram(diagramModelData)
    }
    if (!diagramModelData)
      this.view.showDialog('error', `Diagram not existing`)

    let diagramViewData = this.diagramModelToViewData(diagramModelData)
    this.view.drawDiagram(diagramViewData)
  }

  /*
   * Event Handler for an entity selection.
   * @param {String} entity_id - The Id of the selected entity
   * @param {Boolean} unselect - Flag for unselecting elements on graph
   */
  onEntitySelection(entity_id, unselect) {
    let entity = this.ontology.getElem(entity_id)
    this.showDetails(entity, unselect)
  }

  /**
   * Show to the user the details of an entity.
   * @param {JSON} entityModelData The entity retrieved from model.
   * @param {Boolean} unselect - Flag for unselecting elements on graph. Default `false`.
   */
  showDetails(entityModelData, unselect = false) {
    if (this.config.widgets.details.enabled || this.config.widgets.occurrences_list.enabled) {
      let entityViewData = this.entityModelToViewData(entityModelData)

      // retrieve all occurrences and construct a list of pairs { elem_id , diagram_id }
      entityViewData.occurrences = this.ontology.getOccurrences(entityViewData.iri.full_iri).map( elem => {
        return {
          id: elem.data.id,
          id_xml: elem.data.id_xml,
          diagram_id: elem.data.diagram_id,
          diagram_name: this.ontology.getDiagram(elem.data.diagram_id).name }
      })

      if (this.config.widgets.details.enabled)
        this.view.showDetails(entityViewData, unselect)

      if (this.config.widgets.occurrences_list.enabled)
      this.view.showOccurrences(entityViewData.occurrences, unselect)
    }
  }

  onEdgeSelection(edge_id, diagram_id) {
    /*
     * To be refactored.
     * Owl Translator uses cytoscape representation for navigating the graph.
     * We need then the node as a cytoscape object and not as plain json.
     */
    let edge_cy = this.ontology.getElemByDiagramAndId(edge_id, diagram_id, false)
    if(edge_cy)
      this.showOwlTranslation(edge_cy)

    this.view.hideWidget('details')
    this.view.hideWidget('occurrences_list')

    // show details on roles in float mode
    if (this.actualMode == 'float') {
      let edge = this.ontology.getElemByDiagramAndId(edge_id, diagram_id)

      if(edge.classes.includes('predicate')) {
        this.showDetails(edge, false)
      }
    }
  }

  /*
   * Event handler for a node selection on the graph.
   * Show the details and owl translation if the node is an entity, hide it otherwise.
   * @param {String} node_id - The id of the node to center on
   * @param {string} diagram_id - The id of the diagram containing the element
   */
  onNodeSelection(node_id, diagram_id) {
    let node = this.ontology.getElemByDiagramAndId(node_id, diagram_id)

    if (!node) {
      console.error('Unable to find the node with {id= '+node_id+'} in the ontology')
      return
    }

    if(node.classes.includes('predicate')) {
      this.showDetails(node, false)
    } else {
      this.view.hideWidget('details')
      this.view.hideWidget('occurrences_list')
    }

    /*
     * To be refactored.
     * Owl Translator uses cytoscape representation for navigating the graph.
     * We need then the node as a cytoscape object and not as plain json.
     */
    let node_cy = this.ontology.getElemByDiagramAndId(node_id, diagram_id, false)
    this.showOwlTranslation(node_cy)
  }

  /**
   * Focus on a single node and zoom on it.
   * If necessary it also display the diagram containing the node.
   * @param {JSON} nodeModelData - The node retrieved from model
   * @param {Number} zoom - The zoom level to apply
   */
  centerOnNode(nodeModelData, zoom) {
    if (this.view.actual_diagram_id != nodeModelData.data.diagram_id) {
      let diagram = this.ontology.getDiagram(nodeModelData.data.diagram_id)
      this.showDiagram(diagram)
    }

    let nodeViewData = {
      id : nodeModelData.data.id,
      position : nodeModelData.position,
    }

    this.view.centerOnNode(nodeViewData, zoom)
  }

  /**
   * Get OWL translation from a node and give the result to the view.
   * To be refactored.
   * @param {object} elem - Cytoscape representation of a node or a edge
   */
  showOwlTranslation(elem) {
    if (this.config.widgets.owl_translator.enabled) {
      let owl_text = null
      if (elem.isNode())
        owl_text = this.owl_translator.nodeToOwlString(elem, true)
      else if (elem.isEdge())
        owl_text = this.owl_translator.edgeToOwlString(elem)
      this.view.showOwlTranslation(owl_text)
    }
  }

  /**
   * Change the rendering mode.
   * @param {string} mode - the rendering/simplifation mode to activate: `default`, `lite`, or `float`
   * @param {boolean} keep_viewport_state - if `false`, viewport will fit on diagram.
   * Set it `true` if you don't want the viewport state to change.
   * In case of no diagram displayed yet, it will be forced to `false`.
   * Default: `true`.
   *
   * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
   */
  changeRenderingMode(mode, keep_viewport_state = true) {
    this.view.blurAll()
    if (mode === this.actualMode) return
    let old_mode = this.actualMode
    // if we change to lite or default mode, coming from float mode,
    // and we didn't define a new viewport state, then reset viewport
    // to fit the diagram because there's no equivalence in float graph
    // and other graphs, unlike lite and default mode which have fixed
    // positions for nodes.
    let shouldHardResetViewport = (mode != 'float' && old_mode == 'float') || mode == 'float'
    let new_viewport_state =
      keep_viewport_state && !shouldHardResetViewport ?
        this.view.renderer.getActualPosition()
        : null
    this.actualMode = mode
    this.view.widgets.get('simplifications').actual_mode = mode

    mode == 'float' ?
      this.view.showWidget('layout_settings')
      : this.view.hideWidget('layout_settings')

    switch(mode) {
      case 'lite':
      case 'float': {
        this.SimplifiedOntologyPromise.then(() => {
          // async code, actualMode may be changed
          if (this.actualMode === mode) {
            try {
            performChange.bind(this)()
            } catch (e) {console.log(e)}
          }
        })
        break
      }
      case 'default': {
        performChange.bind(this)()
        break
      }
    }

    function performChange() {
      this.ontology = this.ontologies[mode]
      this.view.setRenderer(this.view.renderers[mode])
      Object.keys(this.view.filters).map(key => {
        if (key != 'all' &&
            key != 'attributes' &&
            key != 'individuals') {

          if (mode == 'float' || mode == 'lite') {
            // disable all unnecessary filters
            this.view.filters[key].disabled = true
          }

          if (mode == 'default') {
            // enable filters that may have been disabled by lite mode
            this.view.filters[key].disabled = false

            if (key == 'value_domain' && this.view.filters.attributes.active)
              this.view.filters.value_domain.disabled = true
          }
        }
      })


      this.updateGraphView(new_viewport_state)
      this.updateEntitiesList()
      this.view.widgets.get('filters').requestUpdate()

      if (shouldHardResetViewport) {
        /*
         * HACKY
         * WHY TIMEOUT?
         * mount() and unmount() from cytoscape create issues with labels
         * in float mode. to avoid that grapholscape mount and unmount
         * renderers using display:none. this somehow causes container to get
         * zero as both dimensions inside cytoscape even after setting display:block
         * and it fails to perform the fit() operation.
         * waiting a little bit assure those dimensions to have correct values.
         */
        setTimeout(() => this.view.resetView(), 250)
      }
    }
  }

  /**
   * Redraw actual diagram and set viewport state. If state is not passed, viewport is not changed.
   * @param {object} state - object representation of **rendered position** in [cytoscape format](https://js.cytoscape.org/#notation/position).
   *
   * > Example: { x: 0, y: 0, zoom: 1} - initial state
   */
  updateGraphView(state) {
    this.onDiagramChange(this.view.actual_diagram_id)
    if (state) this.view.setViewPort(state)
  }

  /**
   * Update the entities list in the ontology explorer widget
   */
  updateEntitiesList() {
    let entitiesViewData = this.ontology.getEntities().map( entity => this.entityModelToViewData(entity))
    this.view.updateEntitiesList(entitiesViewData)
  }

  /*
   * Set the kind of displayed name for entities.
   * Then refresh diagram and entities list
   * @param {string} - type accepted values: `label` | `full` | `prefixed`
   */
  onEntityNameTypeChange(type) {
    this.SimplifiedOntologyPromise.then(() => {
      Object.keys(this.ontologies).forEach(key => {
        let entities = this.ontologies[key].getEntities(false) // get cytoscape nodes
        switch(type) {
          case 'label':
            entities.forEach(entity => {
              if (entity.data('label')[this.language])
                entity.data('displayed_name', entity.data('label')[this.language])
              else if (entity.data('label')[this.default_language])
                entity.data('displayed_name', entity.data('label')[this.default_language])
              else {
                let first_label_key = Object.keys(entity.data('label'))[0]
                entity.data('displayed_name', entity.data('label')[first_label_key])
              }
            })
            break

          case 'full':
            entities.forEach(entity => {
              entity.data('displayed_name', entity.data('iri').full_iri)
            })
            break

          case 'prefixed':
            entities.forEach(entity => {
              let prefixed_iri = entity.data('iri').prefix + entity.data('iri').remaining_chars
              entity.data('displayed_name', prefixed_iri)
            })
            break
        }
      })
      this.updateGraphView(this.view.renderer.getActualPosition())
      this.updateEntitiesList()
    })
  }

  /*
   * Update selected language in config and set displayed names accordingly
   * Then refresh diagram and entities list
   * @param {string} - language
   */
  onLanguageChange(language) {
    this.config.preferences.language.selected = language
    // update displayed names (if label is selected then update the label language)
    this.onEntityNameTypeChange(this.config.preferences.entity_name.selected)
  }

  /**
   * Update the actual configuration and apply changes.
   * @param {Object} new_config - a configuration object. Please read [wiki/settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
   */
  setConfig(new_config) {
    Object.keys(new_config).forEach( entry => {

      // if custom theme
      if (entry == 'theme' && typeof(new_config[entry]) == 'object') {
        let custom_theme_value = `custom${this.config.rendering.theme.list.length}`

        this.config.rendering.theme.list.push({
          value : custom_theme_value,
          label : new_config[entry].name || `Custom${this.config.rendering.theme.list.length}`
        })


        // update selected theme unless new config is set with selected = false
        if ( new_config[entry].selected == undefined || new_config[entry].selected == true)
          this.config.rendering.theme.selected = custom_theme_value

        // remove metadata from theme in order to get only colours
        delete new_config[entry].name
        delete new_config[entry].selected

        this.view.registerCustomTheme(new_config[entry], custom_theme_value)
      } else {
        for (let area in this.config) {
          try {
            let setting = this.config[area][entry]
            if (setting) {
              // apply custom settings only if they match type and are defined in lists
              if (setting.type == 'boolean' && typeof(new_config[entry]) == 'boolean')
                this.config[area][entry].enabled = new_config[entry]
              else if( this.config[area][entry].list.map( elm => elm.value).includes(new_config[entry]))
                this.config[area][entry].selected = new_config[entry]
            }
          } catch (e) {
            console.warn(`Custom default setting [${entry}] not recognized`)
          }
        }
      }
    })

    /*
     * setting widget observes this.config object reference, not internal properties.
     * Forcing the update it will render using the new config internal properties
     * reacting to each change.
     */
    this.view.settings_widget?.requestUpdate()
  }

  /**
   * Export the current diagram in to a PNG image and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToPNG(fileName = null) {
    fileName = fileName || this.export_file_name+'.png'
    this.view.renderer.cy.png(this.export_options).then(blob => downloadBlob(blob, fileName))
  }

  /**
   * Export the current diagram in to a SVG file and save it on user's disk
   * @param {String} fileName - the name to assign to the file
   * (Default: [ontology name]-[diagram name]-v[ontology version])
   */
  exportToSVG(fileName = null) {
    fileName = fileName || this.export_file_name+'.svg'
    let svg_content = this.view.renderer.cy.svg(this.export_options)
    let blob = new Blob([svg_content], {type:"image/svg+xml;charset=utf-8"});
    downloadBlob(blob, fileName)
  }

  /*
   * Options for exports, blob-promise
   */
  get export_options() {

    let bg = this.view.themes[this.config.rendering.theme.selected].background.cssText ||
      this.view.themes[this.config.rendering.theme.selected].background
    return {
      output: 'blob-promise',
      full: true,
      bg: bg
    }
  }

  /*
   ** Filename for exports: [ontology name]-[diagram name]-v[ontology version])
   */
  get export_file_name() {
    return `${this.ontology.name}-${this.actual_diagram.name}-v${this.ontology.version}`
  }

  entityModelToViewData(entityModelData) {
    let language_variant_properties = ["label"]
    for (let property of language_variant_properties) {
      if (entityModelData.data[property]) {
        if (entityModelData.data[property][this.language])
          language_variant_properties[property] = entityModelData.data[property][this.language]
        else if (entityModelData.data[property][this.default_language]) {
          language_variant_properties[property] = entityModelData.data[property][this.default_language]
        } else {
          for (let lang of this.languagesList) {
            if (entityModelData.data[property][lang]) {
              language_variant_properties[property] = entityModelData.data[property][lang]
              break
            }
          }
        }
      }
    }

    let entityViewData = {
      id : entityModelData.data.id,
      id_xml : entityModelData.data.id_xml,
      diagram_id : entityModelData.data.diagram_id,
      label : language_variant_properties.label,
      displayed_name : entityModelData.data.displayed_name,
      type : entityModelData.data.type,
      iri : entityModelData.data.iri,
      description : entityModelData.data.description,
      annotations : entityModelData.data.annotations,
      functional : entityModelData.data.functional,
      inverseFunctional : entityModelData.data.inverseFunctional,
      asymmetric : entityModelData.data.asymmetric,
      irreflexive : entityModelData.data.irreflexive,
      reflexive : entityModelData.data.reflexive,
      symmetric : entityModelData.data.symmetric,
      transitive : entityModelData.data.transitive,
    }

    return JSON.parse(JSON.stringify(entityViewData))
  }

  diagramModelToViewData(diagramModelData) {
    let diagramViewData =  {
      name : diagramModelData.name,
      id : diagramModelData.id,
      nodes : diagramModelData.nodes,
      edges : diagramModelData.edges,
    }

    return JSON.parse(JSON.stringify(diagramViewData))
  }

  set ontology(ontology) {
    this._ontology = ontology
  }

  get ontology() {
    return this._ontology
  }

  /**
   * Setter.
   * Set the callback function for wiki redirection given an IRI
   * @param {Function} callback - the function to call when redirecting to a wiki page.
   * The callback will receive the IRI.
   */
  set onWikiClick(callback) {
    this._onWikiClick = callback
    this.view.onWikiClick = callback
  }

  get onWikiClick() {
    return this._onWikiClick
  }

  /**
   * Getter
   * @returns {string} - selected language
   */
  get language() {
    return this.config.preferences.language.selected
  }

  /**
   * Getter
   * @returns {Array} - languages defined in the ontology
   */
  get languagesList() {
    return this.config.preferences.language.list.map(lang => lang.value)
  }

  /**
   * Getter
   * @returns {Diagram} - the diagram displayed
   */
  get actual_diagram() {
    return this.ontology.getDiagram(this.view.actual_diagram_id)
  }
}