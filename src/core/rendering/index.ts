import cytoscape, { ElementDefinition } from "cytoscape"
import { Diagram, Filter, GrapholElement, LifecycleEvent } from "../../model"
import { isGrapholEdge } from "../../model/graphol-elems/edge"
import { isGrapholNode } from "../../model/graphol-elems/node"
import GrapholscapeTheme from "../../model/theme"
import { getGraphStyle } from "../../style/graph-style"
import RenderState from "../../model/renderers/i-render-state"
import { DefaultFilterKeyEnum, getDefaultFilters } from "./filtering"
import Lifecycle from "../../model/lifecycle"

/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */
export default class Renderer {
  container: Element
  cy: cytoscape.Core
  private _renderState: RenderState
  filters = new Map(Object.values(getDefaultFilters()).map(filter => [filter.key, filter]))
  diagram: Diagram
  private _theme: GrapholscapeTheme
  private _lifecycle: Lifecycle
  FOCUS_ZOOM_LEVEL = 1.5

  constructor(renderState?: RenderState) {
    if (renderState)
      this.renderState = renderState
  }

  set lifecycle(lc: Lifecycle) {
    this._lifecycle = lc
  }

  set renderState(rs: RenderState) {
    this._renderState = rs
    rs.renderer = this

    if (this.diagram) {
      this.stopRendering()
      rs.render()
    }
  }

  get renderState() { return this._renderState }

  get theme() { return this._theme }

  render(diagram: Diagram) {
    if (!this.diagram || this.diagram.id !== diagram.id) {
      this.stopRendering()
      this.diagram = diagram
      this._renderState.render()
      this._lifecycle.trigger(LifecycleEvent.DiagramChange, diagram)
    }
  }

  mount() {
    if (!this.cy.style()) {
      this.applyTheme()
    }

    this.cy.mount(this.container)
  }

  addElement(element: ElementDefinition) {
    this.cy.add(element)
  }

  /**
   * Filter elements on the diagram.
   * It will be actually applied only if the user defined callback on the event
   * {@link LifecycleEvent.FilterRequest} returns true and if the internal logic
   * allows for the filter to be applied.
   * @param filter Can be an object of type {@link Filter}, {@link DefaultFilterKeyEnum} 
   * or a string representing the unique key of a defined filter
   */
  filter = (filter: Filter | DefaultFilterKeyEnum | string) => {
    let _filter: Filter = this.getFilter(filter)
    
    if (!_filter) return

    if (this._lifecycle.trigger(LifecycleEvent.FilterRequest, _filter) && this._renderState.filterManager.filterActivation(_filter)) {
      this.performFilter(_filter)
      this._lifecycle.trigger(LifecycleEvent.Filter, _filter)
    }
  }

  private performFilter(filter: Filter, activate: boolean = true) {
    for (let grapholElement of this.grapholElements.values()) {
      if (filter.shouldFilter(grapholElement)) {
        if (activate)
          this._renderState.filter(grapholElement.id, filter)
        else 
          this._renderState.unfilter(grapholElement.id, filter)
      }
    }

    filter.active = activate
  }

  /**
   * Unfilter elements on the diagram.
   * It will be actually deactivated only if the user defined callback on the event
   * {@link LifecycleEvent.FilterRequest} returns true and if the internal logic
   * allows for the filter to be deactivated.
   * @param filter Can be an object of type {@link Filter}, {@link DefaultFilterKeyEnum} 
   * or a string representing the unique key of a defined filter
   */
  unfilter = (filter: Filter | DefaultFilterKeyEnum | string) => {
    const _filter = this.getFilter(filter)
    if (!_filter) return

    if (this._lifecycle.trigger(LifecycleEvent.UnfilterRequest, _filter) && this._renderState.filterManager.filterDeactivation(_filter)) {
      this.performFilter(_filter, false)
      this.applyActiveFilters()
      this._lifecycle.trigger(LifecycleEvent.Unfilter, _filter)
    }
  }

  private getFilter(filter: Filter | string) {
    let _filter: Filter
    if (typeof filter === 'string') {
      _filter = this.filters.get(filter)
    } else {
      _filter = filter
    }

    if (!_filter || !this.filters.has(_filter.key)) {
      console.warn(`Can't find any filter "${filter}"`)
      return
    }

    return _filter
  }

  private applyActiveFilters() {
    this.filters.forEach(filter => {
      if (filter.active) {
        this.performFilter(filter)
      }
    })
  }

  stopRendering() {
    this.cy?.unmount()
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
  unselect = () => {
    this.cy.elements(':selected').unselect()
  }

  /**
   * Fit viewport to diagram
   */
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
      this.cy.animate({
        center: {
          eles: cyElement
        },
        zoom: zoom,
      })
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
      this.cy.animate({
        zoom: zoomValue,
      })
  }

  zoomIn(zoomValue: number) {
    this.cy.animate({
      zoom: {
        level: this.cy.zoom() + zoomValue,
        renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
      }
    })
  }

  zoomOut(zoomValue: number) {
    this.cy.animate({
      zoom: {
        level: this.cy.zoom() - zoomValue,
        renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
      }
    })
  }

  setTheme(theme: GrapholscapeTheme) {
    if (theme !== this._theme) {
      this._theme = theme
      if (this.cy) {
        this.applyTheme()
      }
    }
  }

  applyTheme() {
    if (this._theme) {
      this.cy.style(getGraphStyle(this._theme))
    } else {
      console.warn('Cannot render anything, please set a theme')
    }
  }

  // updateAll() {
  //   for (let grapholElement of this.grapholElements.values()) {
  //     this.updateElement(grapholElement.id)
  //   }
  // }

  updateElement(grapholElement: GrapholElement) {
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

  get isThemeApplied() {
    return this.cy.style()
  }

  get grapholElements() {
    return this.diagram.representations.get(this._renderState.id).grapholElements
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
