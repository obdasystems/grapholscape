import cytoscape from "cytoscape";
import { isGrapholEdge } from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";
import { isGrapholNode } from "../graphol-elems/node";

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

  updateElement(element: GrapholElement): void
  updateElement(elementId: string): void
  updateElement(elementIdOrObj: string | GrapholElement) {
    let grapholElement: GrapholElement
    if (typeof elementIdOrObj === 'string') {
      grapholElement = this.grapholElements.get(elementIdOrObj)
    } else {
      grapholElement = elementIdOrObj
    }

    if (!grapholElement) return

    const cyElement = this.cy.$id(grapholElement.id)

    if (isGrapholNode(grapholElement) && grapholElement.position !== cyElement.position()) {
      cyElement.position(grapholElement.position)
    }

    if (isGrapholEdge(grapholElement)) {
      cyElement.move({
        source: grapholElement.sourceId,
        target: grapholElement.targetId
      })
    }

    cyElement.data(grapholElement.getCytoscapeRepr()[0].data)
  }

  get grapholElements() {
    return this._grapholElements
  }

  set grapholElements(newElementMap) {
    this._grapholElements = newElementMap
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