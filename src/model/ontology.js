/**
 * @typedef {object} Iri
 * @property {string} Iri.full_iri
 * @property {string} Iri.remaining_chars the string after the namespace or prefix
 * @property {string} Iri.prefix
 * @property {string} Iri.prefixed
 * 
 * @typedef {object} Position
 * @property {number} Position.x
 * @property {number} Position.y
 * 
 * @typedef {object} GrapholElem
 * @property {Position} position
 * @property {string} classes
 * @property {"nodes"|"edges"} group
 * @property {boolean} grabbable
 * @property {boolean} locked
 * @property {boolean} pannable
 * @property {boolean} removed
 * @property {boolean} selectable
 * @property {boolean} selected
 * @property {ElemData} data
 * 
 * @typedef {object} ElemData the data related to the diagram elements: nodes or edges
 * @property {number} diagram_id the id owning this element
 * @property {string} displayed_name the name displayed in the diagram
 * @property {string} fillColor color of the node body
 * @property {string} fontSize the size of the displayed name
 * @property {number} height 
 * @property {number} width
 * @property {Object.<string, string>} label a map <language, value>
 * @property {Iri} iri
 * @property {string} id unique id in the ontology [id]+_+[diagram_id]
 * @property {string} id_xml the parsed id (not unique in the ontology)
 * @property {ElemType} identity
 * @property {ElemType} type the type of node
 * @property {boolean?} labelXcentered whether to center node's label on node's body along X axis
 * @property {boolean?} labelYcentered whether to center node's label on node's body along X axis
 * @property {number} labelXpos offset position of the node's label in case it's not centered along X
 * @property {number} labelYpos offset position of the node's label in case it's not centered along Y
 * @property {string?} shape the shape of the node
 * @property {string[]?} inputs [property-assertion] list of id_xml
 * //edge
 * @property {string?} source [edge] the id of the source node
 * @property {string?} target [edge] the id of the target node
 * @property {Position[]?} breakpoints [edge] a list of edge's breakpoints positions
 * @property {number[]?} segment_distances [edge] read more about segment-distances(https://js.cytoscape.org/#style/unbundled-bezier-edges)
 * @property {number[]?} segment_weights [edge] read more about segment-weights (https://js.cytoscape.org/#style/unbundled-bezier-edges)
 * @property {number[]?} source_endpoint [edge] position of the endpoint on source node
 * @property {number[]?} target_endpoint [edge] position of the endpoint on target node
 * // Object/DataProperties
 * @property {boolean?} functional
 * @property {boolean?} inverseFunctional
 * @property {boolean?} symmetric
 * @property {boolean?} asymmetric
 * @property {boolean?} reflexive
 * @property {boolean?} irreflexive
 * @property {boolean?} transitive
 * 
 * @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue
 */

/**
 * # Ontology
 * Class used as the Model of the whole app.
  * @property {string} name
  * @property {string} version
  * @property {Namespace[]} namespaces
  * @property {Diagram[]} diagrams
 */
import Diagram from './diagram'
import Namespace from './namespace'

export default class Ontology {
  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {Namespace[]} namespaces
   * @param {Diagram[]} diagrams
   */
  constructor(name, version, namespaces = [], diagrams = []) {
    this.name = name
    this.version = version
    this.namespaces = namespaces
    this.diagrams = diagrams

    this.annotations = []
    this.languages = { list: [], default: '' }
    this.description = []
  }

  /** @param {Namespace} namespace */
  addNamespace(namespace) {
    this.namespaces.push(namespace)
  }

  /**
   * Get the Namspace object given its IRI string
   * @param {string} iriValue the IRI assigned to the namespace
   * @returns {Namespace}
   */
  getNamespace(iriValue) {
    return this.namespaces.find(ns => ns.value === iriValue)
  }

  /**
   * Get the Namespace given one of its prefixes
   * @param {string} prefix 
   * @returns {Namespace}
   */
  getNamespaceFromPrefix(prefix) {
    return this.namespaces.find(ns => ns.hasPrefix(prefix))
  }

  // TODO maybe this doesn't belong to ontology
  /**
   * Get 
   * @param {string} iri 
   * @returns 
   */
  destructureIri(iri) {
    let result = {
      namespace: '',
      prefix: '',
      remaining_chars: ''
    }
    for (let namespace of this.namespaces) {
      // if iri contains namespace 
      if (iri.includes(namespace.value)) {
        result.namespace = namespace.value
        result.prefix = namespace.prefixes[0]

        result.rem_chars = iri.slice(namespace.value.length)
        break;
      }
      //else if (iri.search(namespace.value.slice(0, -1)) != -1) {
      //result.namespace = namespace.value
      //result.prefix = namespace.prefixes[0]
      //result.rem_chars = iri.slice(namespace.value.length - 1)
      //break;
      //}
    }

    return result
  }

  /** @param {Diagram} diagram */
  addDiagram(diagram) {
    this.diagrams.push(diagram)
  }

  /**
   * @param {string | number} index the id or the name of the diagram
   * @returns {Diagram} The diagram object
   */
  getDiagram(index) {
    if (index < 0 || index > this.diagrams.length) return
    if (this.diagrams[index]) return this.diagrams[index]

    return this.diagrams.find(d => d.name.toLowerCase() === index.toString().toLowerCase())
  }

  /**
   * Get an element in the ontology by id, searching in every diagram
   * @param {string} elem_id - The `id` of the elem to retrieve
   * @param {boolean} json - if `true` return plain json, if `false` return cytoscape node. Default `false`
   * @returns {CollectionReturnValue} The cytoscape object representation.
   */
  getElem(elem_id) {
    for (let diagram of this.diagrams) {
      let node = diagram.cy.$id(elem_id)
      if (node.length > 0) return node
    }
  }

  /**
   * Retrieve an entity in json by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {CollectionReturnValue} The cytoscape object representation.
   */
  getEntity(iri) {
    return this.getEntityOccurrences(iri)[0]
  }

  /**
   * Retrieve all occurrences of an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {CollectionReturnValue[]} An array of cytoscape object representation
   */
  getEntityOccurrences(iri) {
    return this.entities[iri] || this.entities[this.prefixedToFullIri(iri)]
  }

  /**
   * Get an element in the ontology by its id and its diagram id
   * @param {string} elemID - The id of the element to retrieve
   * @param {string } diagramID - the id of the diagram containing the element
   * @returns {CollectionReturnValue} The element in cytoscape object representation
   */
  getElemByDiagramAndId(elemID, diagramID) {
    let diagram = this.getDiagram(diagramID)

    if (diagram) {
      let node = diagram.cy.$(`[id_xml = "${elemID}"]`) || diagram.cy.$id(elemID)
      if (node.length > 0)
        return node
    }
  }

  /**
   * Get the entities in the ontology
   * @returns {Object.<string, CollectionReturnValue[]} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
   */
  getEntities() {
    let entities = {}
    this.diagrams.forEach(diagram => {
      diagram.cy.$('.predicate').forEach(entity => {
        let iri = entity.data('iri').full_iri

        if (!Object.keys(entities).includes(iri)) {
          entities[iri] = []
        }

        entities[iri].push(entity)
      })
    })

    this._entities = entities
    return entities
  }

  checkEntityIri(entity, iri) {
    let entityIri = entity.data('iri') || entity.data.iri
    return entityIri.full_iri === iri ||
      entityIri.prefix + entityIri.remaining_chars === iri
  }

  prefixedToFullIri(prefixedIri) {
    for (let namespace of this.namespaces) {
      for (let prefix of namespace.prefixes) {
        if (prefixedIri.includes(prefix + ':')) {
          return prefixedIri.replace(prefix + ':', namespace.value)
        }
      }
    }
  }

  get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0) }

  get entities() { return this.isEntitiesEmpty ? this.getEntities() : this._entities}
}
