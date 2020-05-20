/**
 * # GrapholscapeController - API
 * an object of this class is returned to the promise when reading a graphol file.
 * It expose a set of methods to set filters, change viewport state etc.
 *
 * @version 1.0.0
 */

import OwlTranslator from "./util/owl"
import computeSimplifiedOntologies from "./util/simplifier"
import * as default_config from "./config.json"

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
    this.view.onRenderingModeChange = this.onRenderingModeChange.bind(this)
    if (this.onWikiClickCallback) {
      this.view.onWikiClick = this.onWikiClick.bind(this)
    }
    this.view.onEntityNameTypeChange = this.onEntityNameTypeChange.bind(this)
    this.view.onLanguageChange = this.onLanguageChange.bind(this)

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
    if (this.config.widgets.details.enabled) {
      let entityViewData = this.entityModelToViewData(entityModelData)
      this.view.showDetails(entityViewData, unselect)
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

    // show details on roles in float mode
    if (this.actualMode == 'float') {
      let edge = this.ontology.getElemByDiagramAndId(edge_id, diagram_id)

      if(edge.classes.includes('predicate')) {
        this.showDetails(edge, false)
      } else {
        this.view.hideDetails()
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
      this.view.hideDetails()
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

  onRenderingModeChange(mode, state) {
    this.actualMode = mode
    switch(mode) {
      case 'lite':
      case 'float': {
        this.SimplifiedOntologyPromise.then(() => {
          if (this.actualMode === mode) {
            this.ontology = this.ontologies[mode]
            this.updateGraphView(state)
            this.updateEntitiesList()
          }
        })
        break
      }
      case 'default': {
        this.ontology = this.ontologies.default
        this.updateGraphView(state)
        this.updateEntitiesList()
        break
      }
    }
  }

  /**
   * Change the rendering mode.
   * @param {string} mode - the rendering/simplifation mode to activate: `graphol`, `lite`, or `float`
   * @param {boolean} keep_viewport_state - if `false`, viewport will fit on diagram.
   * Set it `true` if you don't want the viewport state to change.
   * In case of no diagram displayed yet, it will be forced to `false`.
   * Default: `true`.
   *
   * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
   */
  changeRenderingMode(mode, keep_viewport_state = true) {
    this.view.changeRenderingMode(mode, keep_viewport_state)
    this.view.widgets.get('simplifications').actual_mode = mode
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
                for (let lang of this.languagesList) {
                  if (entity.data('label')[lang]) {
                    entity.data('displayed_name', entity.data('label')[lang])
                    break
                  }
                }
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

  setConfig(new_config) {
    Object.keys(new_config).forEach( entry => {

      // if custom theme
      if (entry == 'theme' && typeof(new_config[entry]) == 'object') {
        this.view.setCustomTheme((new_config[entry]))
        this.config.rendering.theme.list.push({
          value : 'custom',
          label : 'Custom'
        })
        this.config.rendering.theme.selected = 'custom'
        return // continue to next entry and skip next for
      }
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
        } catch (e) {}
      }
    })
  }

  onWikiClick(iri) {
    this.onWikiClickCallback(iri)
  }

  setOnWikiClickCallback(callback) {
    this.onWikiClickCallback = callback
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