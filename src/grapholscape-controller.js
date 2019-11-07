import OwlTranslator from "./owl"
import computeLiteOntology from "./simplifier"

export default class GrapholscapeController {
  constructor(ontology, view = null) {
    this.ontologies = {
      default: ontology,
      lite: null,
    }
    this._ontology = ontology
    this.view = view
    this.owl_translator = new OwlTranslator()
    this.liteMode = false
    this.liteOntologyPromise = computeLiteOntology(ontology)
      .then( result => { 
        this.ontologies.lite = result 
      } )
      .catch( reason => {
        console.log(reason)
      })

  }

  init() {
    let diagramsModelData = this.ontology.diagrams
    let entitiesModelData = this.ontology.getEntities()

    let diagramsViewData = diagramsModelData.map(diagram => this.constructor.diagramModelToViewData(diagram))
    let entitiesViewData = entitiesModelData.map(entity => this.constructor.entityModelToViewData(entity))
    let ontologyViewData = {
      name : this.ontology.name,
      version : this.ontology.version,
      iriSet : this.ontology.iriSet
    }

    // event handlers
    this.view.onDiagramChange = this.onDiagramChange.bind(this)
    this.view.onNodeNavigation = this.onNodeNavigation.bind(this)
    this.view.onEntitySelection = this.onEntitySelection.bind(this)
    this.view.onNodeSelection = this.onNodeSelection.bind(this)
    this.view.onBackgroundClick = this.onBackgroundClick.bind(this)
    this.view.onEdgeSelection = this.onEdgeSelection.bind(this)
    this.view.onLiteModeActive = this.onLiteModeActive.bind(this)
    this.view.onDefaultModeActive = this.onDefaultModeActive.bind(this)
    
    this.view.createUi(ontologyViewData, diagramsViewData, entitiesViewData)
  }

  /**
   * Event handler for clicks on empty area of the graph.
   * It collapse all widgets' body.
   */
  onBackgroundClick() {
    this.view.blurAll()
  }

  /**
   * Event handler for the click on a node in the explorer widget.
   * Focus on the node and show its details
   * @param {String} node_id - the id of the node to navigate to
   */
  onNodeNavigation(node_id) {
    let node = this.ontology.getElem(node_id)
    this.centerOnNode(node, 1.5)
    this.showDetails(node)
  }

  /**
   * Event handler for a digram change.
   * @param {string} diagram_index The index of the diagram to display
   */
  onDiagramChange(diagram_index) {
    let diagram = this.ontology.getDiagram(diagram_index)
    this.showDiagram(diagram)
  }

  /**
   * Display a diagram on the screen.
   * @param {JSON} diagramModelData The diagram retrieved from model
   */
  showDiagram(diagramModelData) {
    let diagramViewData = this.constructor.diagramModelToViewData(diagramModelData)
    this.view.drawDiagram(diagramViewData)
  }

  /**
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
   * @param {JSON} entityModelData The entity retrieved from model
   */
  showDetails(entityModelData, unselect) {
    let entityViewData = this.constructor.entityModelToViewData(entityModelData)
    this.view.showDetails(entityViewData, unselect)
  } 

  onEdgeSelection(edge_id, diagram_id) {

    /**
     * To be refactored.
     * Owl Translator uses cytoscape representation for navigating the graph.
     * We need then the node as a cytoscape object and not as plain json.
     */
    let edge_cy = this.ontology.getElemByDiagramAndId(edge_id, diagram_id, false)
    if(edge_cy)
      this.showOwlTranslation(edge_cy)
  }

  /**
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

    /**
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
   * @param {object} node - cytoscape representation of a node
   */
  showOwlTranslation(elem) {
    let owl_text = null
    if (elem.isNode())
      owl_text = this.owl_translator.nodeToOwlString(elem, true)
    else if (elem.isEdge())
      owl_text = this.owl_translator.edgeToOwlString(elem)
    this.view.showOwlTranslation(owl_text)
  }

  onLiteModeActive() {
    this.liteMode = true
    this.liteOntologyPromise.then(() => {
      if (this.liteMode) {
        this.ontology = this.ontologies.lite
        this.onDiagramChange(this.view.actual_diagram_id)
        this.updateEntitiesList()
      }
    })
  }

  onDefaultModeActive() {
    this.liteMode = false
    this.ontology = this.ontologies.default
    this.onDiagramChange(this.view.actual_diagram_id)
    this.updateEntitiesList()
  }

  updateEntitiesList() {
    let entitiesViewData = this.ontology.getEntities().map( entity => this.constructor.entityModelToViewData(entity))
    this.view.updateEntitiesList(entitiesViewData)
  }

  static entityModelToViewData(entityModelData) {
    let entityViewData = {
      id : entityModelData.data.id,
      id_xml : entityModelData.data.id_xml,
      diagram_id : entityModelData.data.diagram_id,
      label : entityModelData.data.label,
      type : entityModelData.data.type,
      iri : entityModelData.data.iri,
      description : entityModelData.data.description,
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

  static diagramModelToViewData(diagramModelData) {
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
}