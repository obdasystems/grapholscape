import cytoscape from "cytoscape";
import cytoscapeDefaultConfig from "../../config/cytoscape-default-config";
import { isGrapholEdge } from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholElement from "../graphol-elems/graphol-element";
import { isGrapholNode } from "../graphol-elems/node";
import Iri from "../iri";
import { TypesEnum, Viewport } from "../rdf-graph/swagger";

export default class DiagramRepresentation {
  private _cy: cytoscape.Core
  private _grapholElements: Map<string, GrapholElement> = new Map()
  private _hasEverBeenRendered = false


  public lastViewportState?: Viewport

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
  }

  removeElement(elementId: string) {
    this.grapholElements.delete(elementId)
    this.cy.$id(elementId).remove()
  }

  clear() {
    this.cy.elements().remove()
    this.grapholElements.clear()

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

  filter(elementId: string, filterTag: string,) {
    const element = this.cy.$id(elementId)

    if (element.hasClass('filtered'))
      return

    const classesToAdd = ['filtered', filterTag]
    element.addClass(classesToAdd.join(' '))
    // Filter fake nodes!
    this.cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass(classesToAdd.join(' '))

    // ARCHI IN USCITA
    //var selector = `[source = "${element.data('id')}"]`
    element.outgoers('edge').forEach(e => {
      let neighbour = e.target()

      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.target().hasClass(classesToAdd[0]) && (number_edges_in_out <= 0 || e.data('type') === TypesEnum.INPUT)) {
        this.filter(e.target().id(), filterTag)
      }
    })

    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
      let neighbour = e.source()
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.source().hasClass(classesToAdd[0]) && number_edges_in_out === 0) {
        this.filter(e.source().id(), filterTag)
      }
    })


    function getNumberEdgesInOut(neighbour: cytoscape.NodeSingular) {
      let count = neighbour.outgoers('edge').size() + neighbour.incomers(`edge[type != "${TypesEnum.INPUT}"]`).size()
  
      neighbour.outgoers('node').forEach(node => {
        if (node.hasClass(classesToAdd[0])) {
          count--
        }
      })
  
      neighbour.incomers(`edge[type != "${TypesEnum.INPUT}"]`).forEach(e => {
        if (e.source().hasClass(classesToAdd[0])) {
          count--
        }
      })
  
      return count
    }
  }

  unfilter(elementId: string, filterTag: string) {
    const classToRemove = ['filtered', filterTag]
    const element = this.cy.$id(elementId)
    if (element.hasClass('filtered') && element.hasClass(filterTag)) {
      this.cy.$id(elementId).removeClass(classToRemove.join(' '))
      this.cy.$(`.${filterTag}`).removeClass(classToRemove.join(' '))
    }
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

  get nodesCounter() { return this.cy.nodes().length }
  get edgesCounter() { return this.cy.edges().length }
}