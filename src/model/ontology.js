import cytoscape from 'cytoscape'

export class Ontology {
  constructor (name, version, iriSet = new Set(), diagrams = []) {
    this.name = name
    this.version = version
    this.iriSet = iriSet
    this.diagrams = diagrams
  }

  // @param {Iri} iri
  addIri (iri) {
    this.iriSet.add(iri)
  }

  // @param {Diagram} diagram
  addDiagram (diagram) {
    this.diagrams.push(diagram)
  }

  getDiagram(index) {
    return this.diagrams[index]
  }

  /**
   * Get an element in the ontology by id, searching in every diagram
   * @param {string} elem_id - The id of the elem to retrieve 
   * @param {boolean} json - if true return plain json, if false return cytoscape node
   */
  getElem(elem_id, json = true) {
    for (let diagram of this.diagrams) {
      let node = diagram.cy.$id(elem_id)
      if (node)
        return json ? node.json() : node  
    }

    return false
  }

  /**
   * Get an element in the ontology by its id and its diagram id
   * @param {string} elem_id - The id of the elem to retrieve 
   * @param {string }
   * @param {boolean} json - if true return plain json, if false return cytoscape node
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

  // return a collection with all the predicates in the ontology
  getEntities () {
    let predicates = cytoscape().collection()
    this.diagrams.forEach(diagram => {
      predicates = predicates.union(diagram.cy.nodes('.predicate'))
    })

    predicates = predicates.sort((a,b) => a.data('label').localeCompare(b.data('label')))
    
    return predicates.jsons()
  }

  getDefaultIri () {
    let return_iri = null
    this.iriSet.forEach(iri => {
      if (iri.isDefault()) {
        return_iri = iri
      }
    })

    return return_iri
  }
}

export default Ontology
