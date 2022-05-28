import cytoscape from "cytoscape";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";

export default class DiagramRepresentation {
  private _cy = cytoscape()
  private _grapholElements: Map<string, GrapholElement> = new Map()
  private _hasEverBeenRendered = false

  get cy() {
    return this._cy
  }

  get hasEverBeenRendered() {
    return this._hasEverBeenRendered
  }

  set hasEverBeenRendered(value: boolean) {
    this._hasEverBeenRendered = value
  }

  /**
   * Add a new element (node or edge) to the diagram
   * @param newElement the GrapholElement to add to the diagram
   */
  addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity) {
    this.grapholElements.set(newElement.id, newElement)

    // Every elem can have a set of fake elements to build a custom shape
    const cyElems = newElement.getCytoscapeRepr(grapholEntity)
    this.cy.add(cyElems)
  }

  get grapholElements() {
    return this._grapholElements
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