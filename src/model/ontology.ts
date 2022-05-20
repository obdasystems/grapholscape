/** 
 * @typedef {object} Iri
 * @property {string} Iri.fullIri
 * @property {string} Iri.remainingChars the string after the namespace or prefix
 * @property {string} Iri.prefix
 * @property {string} Iri.prefixed
 * @property {string} Iri.namespace
 */

/** 
 * @typedef {object} Position
 * @property {number} Position.x
 * @property {number} Position.y
 */

/**
 * @typedef {Object.<string, string[]>} Annotation
 */

/**
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
 */

/** 
 * @typedef {object} ElemData the data related to the diagram elements: nodes or edges
 * @property {number} diagram_id the id owning this element
 * @property {string} displayed_name the name displayed in the diagram
 * @property {string} fillColor color of the node body
 * @property {string} fontSize the size of the displayed name
 * @property {number} height
 * @property {number} width
 * @property {Object<string, Annotation>} annotations map <annotationKind, Annotation> where annotationKind can be `label`, `comment` etc..
 * @property {Iri} iri
 * @property {string} id unique id in the ontology [id]+_+[diagram_id]
 * @property {string} id_xml the parsed id (not unique in the ontology)
 * @property {import('./node-enums').Types} identity
 * @property {Types} type the type of node
 * @property {boolean?} labelXcentered whether to center node's label on node's body along X axis
 * @property {boolean?} labelYcentered whether to center node's label on node's body along X axis
 * @property {number} labelXpos offset position of the node's label in case it's not centered along X
 * @property {number} labelYpos offset position of the node's label in case it's not centered along Y
 * @property {import('./node-enums').Shape} shape the shape of the node
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
 */


import cytoscape from 'cytoscape'
import AnnotatedElement from './annotated-element'
import Diagram from './diagram'
import GrapholEntity from './graphol-elems/entity'
import Namespace from './namespace'
/**
 * # Ontology
 * Class used as the Model of the whole app.
 */
class Ontology extends AnnotatedElement {
  name: string
  version: string
  namespaces: Namespace[]
  diagrams: Diagram[]
  languages: {
    /** @type {import('../grapholscape').Language[]}*/
    list: any[]; default: string
  }
  _entities: GrapholEntity[]

  /**
   * @param {string} name
   * @param {string} version
   * @param {Namespace[]} namespaces
   * @param {Diagram[]} diagrams
   */
  constructor(name: string, version: string, namespaces: Namespace[] = [], diagrams: Diagram[] = []) {
    super()
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.version = version
    /** @type {Namespace[]} */
    this.namespaces = namespaces
    /** @type {Diagram[]} */
    this.diagrams = diagrams


    this.languages = {
      /** @type {import('../grapholscape').Language[]}*/
      list: [],
      default: ''
    }
  }

  /** @param {Namespace} namespace */
  addNamespace(namespace: Namespace) {
    this.namespaces.push(namespace)
  }

  /**
   * Get the Namspace object given its IRI string
   * @param {string} iriValue the IRI assigned to the namespace
   * @returns {Namespace}
   */
  getNamespace(iriValue: string): Namespace {
    return this.namespaces.find(ns => ns.toString() === iriValue)
  }

  /**
   * Get the Namespace given one of its prefixes
   * @param {string} prefix 
   * @returns {Namespace}
   */
  getNamespaceFromPrefix(prefix: string): Namespace {
    return this.namespaces.find(ns => ns.hasPrefix(prefix))
  }

  // /**
  //  * Get 
  //  * @param {string} iri full iri
  //  * @returns {Iri | undefined}
  //  */
  // destructureIri(iri) {
  //   for (let namespace of this.namespaces) {
  //     // if iri contains namespace 
  //     if (iri.includes(namespace.value)) {
  //       return {
  //         namespace: namespace.value,
  //         prefix: namespace.prefixes[0],
  //         fullIri: iri,
  //         remainingChars: iri.slice(namespace.value.length),
  //         prefixed:  namespace.prefixes[0] + ':' + iri.slice(namespace.value.length)
  //       }
  //     }
  //   }
  // }

  /** @param {Diagram} diagram */
  addDiagram(diagram: Diagram) {
    this.diagrams.push(diagram)
  }


  /**
   * @param {string | number} index the id or the name of the diagram
   * @returns {Diagram} The diagram object
   */
  getDiagram(index: string | number): Diagram {
    if (index < 0 || index > this.diagrams.length) return
    if (this.diagrams[index]) return this.diagrams[index]

    return this.diagrams.find(d => d.name.toLowerCase() === index?.toString().toLowerCase())
  }

  addEntity(entity: GrapholEntity) {
    this.entities.push(entity)
  }

  getEntity(iri: string) {
    return this.entities.find(e => e.iri.equals(iri))
  }

  /**
   * Get an element in the ontology by id, searching in every diagram
   * @param {string} elem_id - The `id` of the elem to retrieve
   * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
   */
  getElem(elem_id: string): cytoscape.CollectionReturnValue {
    for (let diagram of this.diagrams) {
      let node = diagram.cy.$id(elem_id)
      if (node.length > 0) return node
    }
  }

  /**
   * Retrieve an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {cytoscape.CollectionReturnValue} The cytoscape object representation.
   */
  // getEntity(iri: string): cytoscape.CollectionReturnValue {
  //   if (this.getEntityOccurrences(iri)) return this.getEntityOccurrences(iri)[0]
  // }

  /**
   * Retrieve all occurrences of an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {cytoscape.CollectionReturnValue[]} An array of cytoscape object representation
   */
  getEntityOccurrences(iri: string): cytoscape.CollectionReturnValue[] {
    return this.entities[iri] || this.entities[this.prefixedToFullIri(iri)]
  }

  /**
   * Get an element in the ontology by its id and its diagram id
   * @param {string} elemID - The id of the element to retrieve
   * @param {string } diagramID - the id of the diagram containing the element
   * @returns {cytoscape.CollectionReturnValue} The element in cytoscape object representation
   */
  getElemByDiagramAndId(elemID: string, diagramID: string): cytoscape.CollectionReturnValue {
    let diagram = this.getDiagram(diagramID)

    if (diagram) {
      let node = diagram.cy.$(`[id_xml = "${elemID}"]`) || diagram.cy.$id(elemID)
      if (node.length > 0)
        return node
    }
  }

  /**
   * Get the entities in the ontology
   * @returns {Object.<string, cytoscape.CollectionReturnValue[]>} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
   */
  getEntities(): { [s: string]: cytoscape.CollectionReturnValue[] } {
    let entities = {}
    this.diagrams.forEach(diagram => {
      diagram.cy.$('.predicate').forEach(entity => {
        let iri = entity.data('iri').fullIri

        if (!Object.keys(entities).includes(iri)) {
          entities[iri] = []
        }

        entities[iri].push(entity)
      })
    })

    //this._entities = entities
    return entities
  }

  /**
   * Check if entity has the specified iri in full or prefixed form
   * @param {Entity} entity 
   * @param {string} iri
   * @returns {boolean}
   */
  // checkEntityIri(entity: Entity, iri: string): boolean {
  //   /** @type {Iri} */
  //   let entityIri: Iri = entity.data('iri') || entity.data.iri
  //   return entityIri.fullIri === iri ||
  //     entityIri.prefixed === iri
  // }

  /**
   * Retrieve the full IRI given a prefixed IRI
   * @param {string} prefixedIri a prefixed IRI
   * @returns {string} full IRI
   */
  prefixedToFullIri(prefixedIri: string): string {
    if (!prefixedIri || typeof (prefixedIri) !== 'string') return
    for (let namespace of this.namespaces) {
      let prefix = namespace.prefixes.find(p => prefixedIri.includes(p + ':'))

      if (prefix) return prefixedIri.replace(prefix + ':', namespace.toString())

      else if (prefixedIri.startsWith(':') && namespace.prefixes.some(p => p === '')) {
        return prefixedIri.replace(':', namespace.toString())
      }
    }
  }

  get isEntitiesEmpty() { return (!this._entities || Object.keys(this._entities).length === 0) }

  get entities() { return this._entities }
}

export default Ontology