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
export class Ontology {
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
  }

  // @param {Iri} iri
  addIri(iri) {
    this.namespaces.push(iri)
  }

  getIriFromValue(value) {
    for(let iri of this.namespaces) {
      if (iri.value == value)
        return iri
    }
  }

  getIriFromPrefix(prefix) {
    for(let iri of this.namespaces) {
      if (iri.prefixes.includes(prefix))
        return iri
    }
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
      } else if (iri.search(namespace.value.slice(0, -1)) != -1) {
        result.namespace = namespace.value
        result.prefix = namespace.prefixes[0]
        result.rem_chars = iri.slice(namespace.value.length - 1)
        break;
      }
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
   * Retrieve an entity by its IRI.
   * @param {string} iri - The IRI in full or prefixed form.
   * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
   * @returns {JSON} The plain json representation of the entity.
   */
  getEntity(iri) {
    return this.getEntities().find(i => {
      return i.data.iri.full_iri === iri ||
        i.data.iri.prefix + i.data.iri.rem_chars === iri
    })
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
      let node = diagram.cy.$(`[id_xml = "${elem_id}"]`)
      if (node)
        return json ? node.json() : node
    }

    return false
  }

  /**
   * Get the entities in the ontology
   * @param {boolean} json  - if true return plain json, if false return cytoscape collection. Default true.
   * @returns {JSON | any}
   *    - if `json` = `true` : array of JSONs with entities
   *    - if `json` = `false` : [cytoscape collection](https://js.cytoscape.org/#collection)
   */
  getEntities (json = true) {
    let predicates = cytoscape().collection()
    this.diagrams.forEach(diagram => {
      predicates = predicates.union(diagram.cy.$('.predicate'))
    })

    predicates = predicates.sort((a,b) => {
      return a.data('displayed_name').localeCompare(b.data('displayed_name'))
    })

    return json ? predicates.jsons() : predicates
  }
}

export default Ontology
