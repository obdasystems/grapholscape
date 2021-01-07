import cytoscape from 'cytoscape'
import { getGraphStyle }  from '../style/graph-style'

export default class GrapholscapeRenderer {
  constructor (container = null) {

    this.actual_diagram = null
    let cy_container = document.createElement('div')

    cy_container.style.width = '100%'
    cy_container.style.height = '100%'
    cy_container.style.position = 'relative'
    if (container)
      container.insertBefore(cy_container, container.firstChild)

    this.cy = cytoscape({
      container: cy_container,
      autoungrabify: true,
      wheelSensitivity: 0.4,
      maxZoom: 2.5,
      minZoom: 0.02,
      layout: {
        name: 'preset'
      }
    })

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
      this.onNodeSelection(e.target.data('id_xml'), e.target.data('diagram_id'))
    })
    this.cy.on('select', 'edge', e => {this.onEdgeSelection(e.target.data('id_xml'), e.target.data('diagram_id'))})
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
    this.cy.container().style.position = 'relative'
    this.cy.container().style.left = 0
    //this.cy.mount(container)
  }

  unmount() {
    this.cy.container().style.position = 'absolute'
    this.cy.container().style.left = '-999em'
    //this.cy.unmount()
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

  resetView () {
    this.cy.fit()
  }

  drawDiagram (diagram) {
    this.cy.remove('*')
    this.cy.add(diagram.nodes)
    this.cy.add(diagram.edges)
    this.cy.fit()
    this.actual_diagram = diagram.id
  }

  zoomIn() {
    this.cy.zoom({
      level: this.cy.zoom() + 0.08,
      renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
    })
  }

  zoomOut() {
    this.cy.zoom({
      level: this.cy.zoom() - 0.08,
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
    this.cy.style(getGraphStyle(theme))
  }

  getActualPosition() {
    return {
      x : this.cy.pan().x,
      y : this.cy.pan().y,
      zoom : this.cy.zoom()
    }
  }
}
