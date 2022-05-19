import cytoscape, { Core } from 'cytoscape'
import setDatatypeOnDataProperty from '../util/set-datatype-on-data-property'
import { Type } from './node-enums'
/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
class Diagram {
  name: string
  id: string | number
  hasEverBeenRendered: boolean
  cy: Core
  /**
   * @param {string} name
   * @param {string | number} id
   * @param {JSON} elements - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  constructor(name: string, id: string | number, elements: JSON = null) {
    this.name = name
    this.id = id
    this.cy = cytoscape()
    if (elements)
      this.addElems(elements)
    /** @type {boolean} */
    this.hasEverBeenRendered = false
  }

  render(container: Element) {
    this.cy.mount(container)
  }

  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  addElems(elems: JSON) {
    //this.cy.add(elems)

    //this.cy.$(`node[type = "${Type.DATA_PROPERTY}"]`).forEach(cyDataProperty => setDatatypeOnDataProperty(cyDataProperty))
  }

  /**
   * Get the entity selected
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
  selectElem(id: string, unselect: boolean = true) {
    if (unselect) this.unselectAll()
    this.cy.$id(id).select()
  }

  /**
   * Unselect every selected element in this diagram
   * @param {string} [selector='*'] cytoscape selector to filter the elements to unselect, default '*'
   */
  unselectAll(selector: string = '*') {
    this.cy.$(selector + ':selected').unselect()
  }

  /**
   * Getter
   */
  get nodes() {
    return this.cy.nodes().jsons()
  }

  /**
   * Getter
   */
  get edges() {
    return this.cy.edges().jsons()
  }
}

export default Diagram
