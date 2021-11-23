import cytoscape from 'cytoscape'
import { getGraphStyle }  from '../../style/graph-style'

export default class GrapholscapeRenderer {
  constructor (container = null) {
    this.label = ''
    this.actual_diagram = null
    this.cy_container = document.createElement('div')

    this.cy_container.style.width = '100%'
    this.cy_container.style.height = '100%'
    this.cy_container.style.position = 'relative'
    this.cy = cytoscape()
    if(container) this.setContainer(container)
  }

  setContainer(container) {
    if (container)
      container.insertBefore(this.cy_container, container.firstChild)
  }

  /**
   * WHY NOT USING cy.mount(container)??
   * because it causes a problem with float renderer.
   * In particular at the second time this.mount() will be
   * called, the layout will stop working, something happens internally
   * breaking the layout.
   *
   * WHY SWITCHING FROM display:none TO position:absolute??
   * display:none will cause the container having clientHeight(Width) = 0
   * and cytoscpae uses those values to perform the fit().
   * This will cause problems when switching renderers cause in some
   * cases fit() will be automatically called on the container having
   *  zero asdimensions
   */
  mount(container) {
    //container.insertBefore(this.cy.container(), container.firstChild)
    // force refresh

    //this.cy.container().style.display = 'block'
    //container.setAttribute('id', 'cy')
    this.cy_container = container
    this.cy?.mount(this.cy_container)
  }

  unmount() {
    //this.cy.container().style.display = 'none'
    //this.cy.container().parentElement.removeChild(this.cy.container())
    this.cy?.unmount()
  }

  centerOnNode (node_id, zoom) {
    var node = this.cy.getElementById(node_id)
    if (node) {
      this.centerOnPosition(node.position('x'), node.position('y'), zoom)
      this.cy.$(':selected').unselect()
      node.select()
    }
  }

  centerOnPosition (x_pos, y_pos, zoom = this.cy.zoom()) {
    this.cy.reset()
    let offset_x = this.cy.width() / 2
    let offset_y = this.cy.height() / 2
    x_pos -= offset_x
    y_pos -= offset_y
    this.cy.pan({
      x: -x_pos,
      y: -y_pos
    })
    this.cy.zoom({
      level: zoom,
      renderedPosition: { x: offset_x, y: offset_y }
    })
  }

  centerOnRenderedPosition(x_pos, y_pos, zoom = this.cy.zoom()) {
    this.cy.viewport({
      zoom : zoom,
      pan : {x : x_pos, y : y_pos}
    })
  }

  fit() {
    this.cy.fit()
  }

  drawDiagram (diagram) {
    this.cy = diagram.cy
    //this.cy.fit()
    this.actual_diagram = diagram.id
  }

  zoomIn(zoomValue) {
    this.cy.zoom({
      level: this.cy.zoom() + zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    })
  }

  zoomOut(zoomValue) {
    this.cy.zoom({
      level: this.cy.zoom() - zoomValue,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    })
  }

  filter(filter, cy_instance) {
    let cy = cy_instance || this.cy
    let selector = `${filter.selector}, .${filter.class}`

    cy.$(selector).forEach(element => {
      this.filterElem(element, filter.class, cy)
    })
  }

  filterElem (element, filter_class, cy_instance) {
    let cy = cy_instance || this.cy
    element.addClass('filtered '+filter_class)
    // Filter fake nodes!
    cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass('filtered '+filter_class)

    // ARCHI IN USCITA
    //var selector = `[source = "${element.data('id')}"]`
    element.outgoers('edge').forEach( e => {
      let neighbour = e.target()
      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') === 'input')) {
        this.filterElem(e.target(), filter_class, cy)
      }
    })

    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
      let neighbour = e.source()
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
        this.filterElem(e.source(), filter_class, cy)
      }
    })

    function getNumberEdgesInOut(neighbour) {
      let count =  neighbour.outgoers('edge').size() + neighbour.incomers('edge[type != "input"]').size()

      neighbour.outgoers().forEach( e => {
        if(e.target().hasClass('filtered')) {
          count--
        }
      })

      neighbour.incomers('[type != "input"]').forEach( e => {
        if(e.source().hasClass('filtered')) {
          count--
        }
      })

      return count
    }
  }

  unfilter(filter, cy_instance) {
    let selector = `${filter.selector}, .${filter.class}`
    let cy = cy_instance || this.cy

    cy.$(selector).removeClass('filtered')
    cy.$(selector).removeClass(filter.class)
  }

  setTheme(theme) {
    this.theme = theme
    this.cy?.style(getGraphStyle(theme))
  }

  /** @type {import('../renderer-manager').ViewportState} */
  get actualViewportState() {
    return {
      x : this.cy.pan().x,
      y : this.cy.pan().y,
      zoom : this.cy.zoom()
    }
  }

  get disabledFilters() {
    return []
  }

  /** @param {import('cytoscape').Core} cyInstance*/
  set cy(cyInstance) {
    if (cyInstance.json() === this.cy?.json()) return
    if (this._cy) this._cy.unmount()
    cyInstance.mount(this.cy_container)

    cyInstance.autoungrabify(true)
    cyInstance.maxZoom(2.5)
    cyInstance.minZoom(0.02)
    cyInstance.layout({ name: 'preset' })
    
    this._cy = cyInstance

    if (this.theme) this.setTheme(this.theme)

    this.cy.on('select', 'node', e => {
      let type = e.target.data('type')
      switch(type) {
        case 'intersection':
        case 'union':
        case 'disjoint-union':
          e.target.neighborhood().select()
          break
      }
      e.target.select();
      this.onNodeSelection(e.target)
    })
    this.cy.on('select', 'edge', e => {this.onEdgeSelection(e.target)})
    this.cy.on('tap', evt => {
      if (evt.target === this.cy) {
        this.onBackgroundClick()
      }
    })
    this.cy.on('mouseover', '*', e => {
      this.cy.container().style.cursor = 'pointer'
    })
    this.cy.on('mouseout', '*', e => {
      this.cy.container().style.cursor = 'inherit'
    })
  }

  get cy() { return this._cy }
}
