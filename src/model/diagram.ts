import cytoscape from 'cytoscape'
import cytoscapeDefaultConfig from '../config/cytoscape-default-config'
import GrapholscapeTheme from '../model/theme'
import { getGraphStyle } from '../style/graph-style'
import { isGrapholEdge } from './graphol-elems/edge'
import GrapholEntity from './graphol-elems/entity'
import GrapholElement from './graphol-elems/graphol-element'
import { isGrapholNode } from './graphol-elems/node'
import Renderer from './i-renderer'
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
  grapholElements: Map<string, GrapholElement> = new Map()

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

  render(container: Element) {
    this.cy.mount(container)

    if (!this.hasEverBeenRendered) {
      this.cy.fit()
    }

    this.unselect()
    this.hasEverBeenRendered = true
  }

  stopRendering() {
    this.cy.unmount()
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

  /**
   * Select a node or an edge its unique id
   * @param {string} elementId elem id (node or edge)
   */
  selectElement(elementId: string) {
    this.cy.$id(elementId).select()
  }

  /**
   * Unselect every selected element in this diagram
   */
  unselect() {
    this.cy.elements(':selected').unselect()
  }

  fit() {
    this.cy.fit()
  }

  /**
   * Put a set of elements (nodes and/or edges) at the center of the viewport.
   * If just one element then the element will be at the center.
   * @param elementId the element's ID
   * @param zoom the zoom level to apply, if not passed, zoom level won't be changed
   */
  centerOnElementById(elementId: string, zoom = this.cy.zoom(), select?: boolean) {
    const cyElement = this.cy.$id(elementId)

    if (cyElement.empty()) {
      console.warn('Element id (${elementId}) not found. Please check that this is the correct diagram')
    } else {
      this.zoom(zoom)
      this.cy.center(cyElement)
      if (select && this.cy.$(':selected') !== cyElement) {
        this.unselect()
        cyElement.select()
      }
    }
  }

  centerOnElement(element: GrapholElement, zoom = this.cy.zoom(), select?: boolean) {
    this.centerOnElementById(element.id, zoom, select)
  }

  centerOnModelPosition(xPos: number, yPos: number, zoom = this.cy.zoom()) {
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

  zoom(zoomValue: number) {
    if (zoomValue != this.cy.zoom())
      this.cy.zoom(zoomValue)
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

  setTheme(theme: GrapholscapeTheme) {
    this.cy.style(getGraphStyle(theme))
  }

  updateAll() {
    for (let grapholElement of this.grapholElements.values()) {
      this.updateElement(grapholElement.id)
    }
  }

  updateElement(elementId: string) {
    const grapholElement = this.grapholElements.get(elementId)
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
