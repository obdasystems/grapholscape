/**
 * # Ontology
 * Class used as the Model of the whole app.
  * @property {string} name
  * @property {string} version
  * @property {Namespace[]} namespaces
  * @property {Diagram[]} diagrams
 */

import cytoscape from 'cytoscape'
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
  constructor (name, version, namespaces = [], diagrams = []) {
    this.name = name
    this.version = version
    this.namespaces = namespaces
    this.diagrams = diagrams

    this.annotations = []
    this.languages = { list : [], default: ''}
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
    return this.namespaces.find( ns => ns.value === iriValue)
  }

  /**
   * Get the Namespace given one of its prefixes
   * @param {string} prefix 
   * @returns {Namespace}
   */
  getNamespaceFromPrefix(prefix) {
    return this.namespaces.find( ns => ns.hasPrefix(prefix) )
  }

  destructureIri(iri) {
    let result = {
      namespace : '',
      prefix : '',
      rem_chars : ''
    }
    for (let namespace of this.namespaces) {
      // if iri contains namespace or namespace without last separator
      if (iri.search(namespace.value) != -1) {
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

  // @param {Diagram} diagram
  addDiagram(diagram) {
    this.diagrams.push(diagram)
  }

  /**
   * @param {string|number} index the id or the name of the diagram
   * @returns {Diagram} The diagram object
   */
  getDiagram(index) {
    if (index < 0 || index > this.diagrams.length) return
    if (this.diagrams[index]) return this.diagrams[index]

    for ( let diagram of this.diagrams ) {
      if (diagram.name.toLowerCase() === index.toLowerCase()) return diagram
    }
  }

  /**
   * Get an element in the ontology by id, searching in every diagram
   * @param {string} elem_id - The `id` of the elem to retrieve
   * @param {boolean} json - if `true` return plain json, if `false` return cytoscape node. Default `true`
   * @returns {any} The cytoscape object or the plain json representation depending on `json` parameter.
   */
  getElem(elem_id, json = true) {
    for (let diagram of this.diagrams) {
      let node = diagram.cy.$id(elem_id)
      if (node && node.length > 0)
        return json ? node.json() : node
    }

    return false
  }

  /**
   * Retrieve an entity in json by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {JSON} The plain json representation of the entity.
   */
  getEntity(iri) {
    if (this.isEntitiesEmpty) this.getEntities()
    return this.entities[iri]?.occurrences[0] || this.entities[this.prefixedToFullIri(iri)]?.occurrences[0]
  }

  /**
   * Retrieve all occurrences of an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @param {boolean} json - 
   * @returns {Array} The plain json representation of the entity.
   *    - if `json` = `true` : occurrences are in plain json
   *    - if `json` = `false` : occurrences are [cytoscape elems](https://js.cytoscape.org/#collection)
   */
  getEntityOccurrences(iri, json = true) {
    /**
     * use local variable cause this.entities only contains json
     * in case of json = false, we need cytoscape objects
     * and this.getEntities() populates this.entities only if json = true
     */
    let entities = this.entities
    if ( json && this.isEntitiesEmpty ) 
      entities = this.getEntities()
    else if (!json)
      entities = this.getEntities(false)
      
  
    return entities[iri]?.occurrences || entities[this.prefixedToFullIri(iri)]?.occurrences
  }

  /**
   * Get an element in the ontology by its id and its diagram id
   * @param {string} elem_id - The id of the element to retrieve
   * @param {string } diagram_id - the id of the diagram containing the element
   * @param {boolean} json - if true return plain json, if false return cytoscape node. Default true.
   */
  getElemByDiagramAndId(elem_id, diagram_id, json = true) {
    let diagram = this.getDiagram(diagram_id)

    if (diagram) {
      let node = diagram.cy.$(`[id_xml = "${elem_id}"]`) || diagram.cy.$id(elem_id)
      if (node.length > 0)
        return json ? node.json() : node
    }

    return false
  }

  /**
   * Get the entities in the ontology
   * @param {boolean} json  - if true return plain json, if false return cytoscape collection. Default true.
   * @returns {object} a map of IRIs, with an array of entity occurrences (object[iri].occurrences)
   *    - if `json` = `true` : occurrences are in plain json
   *    - if `json` = `false` : occurrences are [cytoscape elems](https://js.cytoscape.org/#collection)
   */
  getEntities(json = true) {
    let entities = {}
    this.diagrams.forEach(diagram => {
      diagram.cy.$('.predicate').forEach( entity => {
        let iri = entity.data('iri').full_iri
        if (Object.keys(entities).includes(iri)) {
          addOccurrence(iri, entity)
        } else {
          entities[iri] = { occurrences: [] }
          addOccurrence(iri, entity)
        }
      })
    })
    
    if(json) this.entities = entities
    return entities

    function addOccurrence(iri, entity) {
      entity = json ? entity.json() : entity
      entities[iri].occurrences.push(entity)
    }
  }

  checkEntityIri(entity, iri) {
    return entity.data.iri.full_iri === iri ||
        entity.data.iri.prefix + entity.data.iri.remaining_chars === iri
  }

  prefixedToFullIri(prefixedIri) {
    for (let namespace of this.namespaces) {
      for (let prefix of namespace.prefixes) {
        if(prefixedIri.includes(prefix+':')) {
          return prefixedIri.replace(prefix+':', namespace.value)
        }
      }
    }
  }

  get isEntitiesEmpty() { return (!this.entities || Object.keys(this.entities).length === 0) }
}
