import cytoscape from 'cytoscape'
/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
class Diagram {
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
    /** @type {boolean} */
    this.hasEverBeenRendered = false
  }

  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  addElems (elems) {
    this.cy.add(elems)
  }

  /**
   * Get the entity selected
   * @returns {cytoscape.CollectionReturnValue | undefined}
   */
  getSelectedEntity() {
    let result = this.cy.$('.predicate:selected').first()

    return result.length > 0 ? result : undefined
  }

  /**
   * Select a node or an edge given its unique id
   * @param {string} id unique elem id (node or edge)
   * @param {boolean} [unselect=true] should selected elements be unselected
   */
  selectElem(id, unselect = true) {
    if (unselect) this.unselectAll()
    this.cy.$id(id).select()
  }

  /**
   * Unselect every selected element in this diagram
   * @param {string} [selector='*'] cytoscape selector to filter the elements to unselect, default '*'
   */
  unselectAll(selector = '*') {
    this.cy.$(selector+':selected').unselect()
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

export default Diagram
