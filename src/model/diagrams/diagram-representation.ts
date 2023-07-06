import cytoscape, { CytoscapeOptions } from "cytoscape";
import cytoscapeDefaultConfig from "../../config/cytoscape-default-config";
import { isGrapholEdge } from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";
import { isGrapholNode } from "../graphol-elems/node";
import Iri from "../iri";

export default class DiagramRepresentation {
  private _cy: cytoscape.Core
  private _grapholElements: Map<string, GrapholElement> = new Map()
  private _hasEverBeenRendered = false

  private _nodesCounter: number = 0
  private _edgesCounter: number = 0

  constructor(cyConfig = cytoscapeDefaultConfig) {
    this.cy = cytoscape(cyConfig)
  }

  get cy() {
    return this._cy
  }

  set cy(newCy: cytoscape.Core) {
    this._cy = newCy
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
    const addedElems = this.cy.add(cyElems)
    addedElems.forEach(e => {
      e.isNode() ? this._nodesCounter += 1 : this._edgesCounter += 1
    })
  }

  removeElement(elementId: string) {
    this.grapholElements.delete(elementId)
    this.cy.$id(elementId).remove()
  }

  clear() {
    this.cy.elements().remove()
    this.grapholElements.clear()
    this._nodesCounter = 0
    this._edgesCounter = 0
  }

  updateElement(element: GrapholElement, updatePosition?: boolean): void
  updateElement(elementId: string, updatePosition?: boolean): void
  updateElement(elementIdOrObj: string | GrapholElement, updatePosition: boolean = true) {
    let grapholElement: GrapholElement | undefined
    if (typeof elementIdOrObj === 'string') {
      grapholElement = this.grapholElements.get(elementIdOrObj)
    } else {
      grapholElement = elementIdOrObj
    }

    if (!grapholElement) return

    const cyElement = this.cy.$id(grapholElement.id)

    if (updatePosition && isGrapholNode(grapholElement) && grapholElement.position !== cyElement.position()) {
      cyElement.position(grapholElement.position)
    }

    if (isGrapholEdge(grapholElement)) {
      cyElement.move({
        source: grapholElement.sourceId,
        target: grapholElement.targetId
      })
    }

    const iri = cyElement.data().iri
    cyElement.data(grapholElement.getCytoscapeRepr()[0].data)
    // iri should be always preserved
    cyElement.data().iri = iri
  }

  containsEntity(iriOrGrapholEntity: Iri | GrapholEntity): boolean {
    let iri: Iri
    if ((iriOrGrapholEntity as GrapholEntity).iri !== undefined) {
      iri = (iriOrGrapholEntity as GrapholEntity).iri
    } else {
      iri = iriOrGrapholEntity as Iri
    }

    for (let [_, grapholElement] of this.grapholElements) {
      if (grapholElement.iri && iri.equals(grapholElement.iri)) {
        return true
      }
    }

    return false
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

  get nodesCounter() { return this._nodesCounter }
  get edgesCounter() { return this._edgesCounter }
}