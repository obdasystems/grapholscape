import cytoscape from 'cytoscape'
/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
export default class Diagram {
  /**
   * @param {string} name
   * @param {string | number} id
   * @param {JSON} elements - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  constructor (name, id, elements = null) {
    this.name = name
    this.id = id
    this.cy = cytoscape()
    if (elements)
      this.addElems(elements)
  }

  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  addElems (elems) {
    this.cy.add(elems)
  }

  /**
   * Getter
   * @returns {JSON} - nodes in JSON
   */
  get nodes() {
    return this.cy.nodes().jsons()
  }

  /**
   * Getter
   * @returns {JSON} - edges in JSON
   */
  get edges() {
    return this.cy.edges().jsons()
  }
}

