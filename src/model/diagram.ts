import cytoscape from 'cytoscape'
import cytoscapeDefaultConfig from '../config/cytoscape-default-config'
import { getGraphStyle } from '../style/graph-style'
import GrapholscapeTheme from '../model/theme'
import GrapholEdge from './graphol-elems/edge'
import GrapholNode from './graphol-elems/node'
import Renderer from './i-renderer'
import { setTheme } from '../core/themes'
import GrapholEntity, { Functionalities } from './graphol-elems/entity'
import GrapholElement from './graphol-elems/graphol-element'
import { Type } from './node-enums'
/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
class Diagram implements Renderer {
  name: string
  id: number
  hasEverBeenRendered: boolean
  cy = cytoscape(cytoscapeDefaultConfig)
  grapholNodes: GrapholNode[] = []
  grapholEdges: GrapholEdge[] = []
  grapholEntities: GrapholEntity[] = []

  /**
   * @param {string} name
   * @param {number} id
   */
  constructor(name: string, id: number) {
    this.name = name
    this.id = id
    /** @type {boolean} */
    this.hasEverBeenRendered = false
  }
  showEntity: (iri: string, zoom?: number) => void
  selectEntity: (iri: string, zoom?: number) => void
  centerOnRederedPosition: (x: number, y: number, zoom?: number) => void

  render(container: Element) {
    this.cy.mount(container)

    if (!this.hasEverBeenRendered) {
      this.cy.fit()
    }

    this.hasEverBeenRendered = true
  }

  stopRendering() {
    this.cy.unmount()
  }

  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  addElems(elems: JSON) {
    //this.cy.add(elems)

    //this.cy.$(`node[type = "${Type.DATA_PROPERTY}"]`).forEach(cyDataProperty => setDatatypeOnDataProperty(cyDataProperty))
  }

  addEntity(entity: GrapholEntity) {
    this.grapholEntities.push(entity)
  }

  getEntityByOccurrence(occurrence: GrapholElement) {
    return this.grapholEntities.find(gEntity => gEntity.hasOccurrence(occurrence.id, this.id))
  }

  /**
   * Add a new node to the diagram
   * @param newNode the GrapholNode to add to the diagram
   */
  addNode(newNode: GrapholNode) {
    this.grapholNodes.push(newNode)

    const cyNode = newNode.toCyRepr()
    
    // Set functionality for data/object properties
    if (newNode.is(Type.DATA_PROPERTY) || newNode.is(Type.OBJECT_PROPERTY)) {
      const entity = this.getEntityByOccurrence(newNode)
      cyNode.data[Functionalities.functional] = entity.hasFunctionality(Functionalities.functional)
      cyNode.data[Functionalities.inverseFunctional] = entity.hasFunctionality(Functionalities.inverseFunctional)
    }

    if(newNode.fakeNodes) {
      console.log(newNode.fakeNodes)
      newNode.fakeNodes.forEach(fakeNode => {
        const fakeCyNode = fakeNode.toCyRepr()
        this.cy.add(fakeCyNode)
      })
    }

    this.cy.add(cyNode)
  }

  addEdge(newEdge: GrapholEdge) {
    this.grapholEdges.push(newEdge)
    const cyEdge = newEdge.toCyRepr()
    // Transform source id from XML to source absolute id
    cyEdge.data.source = `${cyEdge.data.source}_${this.id}`
    // Transform source id from XML to source absolute id
    cyEdge.data.target = `${cyEdge.data.target}_${this.id}`
    this.cy.add(cyEdge)
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
   * @param {string} iri unique elem id (node or edge)
   */
  selectIri(iri: string) {
    this.unselect()
    //this.getEntityElement().select()
    this.cy.$id(iri).select()
  }

  /**
   * Unselect every selected element in this diagram
   */
  unselect() {
    this.cy.elements().unselect()
  }

  fit() {
    this.cy.fit()
  }

  focusElement(elementId: string, zoom?: number) {
    var node = this.cy.getElementById(elementId)
    if (node) {
      this.centerOnModelPosition(node.position('x'), node.position('y'), zoom)
    } else {
      console.warn('Element id (${elementId}) not found. Please check that this is the correct diagram')
    }
  }

  centerOnModelPosition(xPos: number, yPos: number, zoom?: number) {
    const _zoom = zoom || this.cy.zoom()

    let offsetX = this.cy.width() / 2
    let offsetY = this.cy.height() / 2
    xPos -= offsetX
    yPos -= offsetY
    this.cy.pan({
      x: -xPos,
      y: -yPos
    })
    this.cy.zoom({
      level: _zoom,
      renderedPosition: { x: offsetX, y: offsetY }
    })
  }

  centerOnRenderedPosition(xPos: number, yPos: number, zoom = this.cy.zoom()) {
    this.cy.viewport({
      zoom: zoom,
      pan: { x: xPos, y: yPos }
    })
  }

  zoomIn(zoomValue: number) {
    this.cy.zoom({
      level: this.cy.zoom() + zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    })
  }

  zoomOut(zoomValue: number) {
    this.cy.zoom({
      level: this.cy.zoom() - zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    })
  }

  getGrapholNode(nodeId: string) {
    return this.grapholNodes.find(gNode => gNode.idXml === nodeId)
  }

  setTheme(theme: GrapholscapeTheme) {
    this.cy.style(getGraphStyle(theme))
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
