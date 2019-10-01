import cytoscape from 'cytoscape'
import OwlTranslator from '../../owl'
import { getGraphStyle }  from '../style/graph-style'

export default class GrapholscapeRenderer {
  constructor (container) {

    this.filters = {
      all: {
        selector: '#undefined',
        label: 'Filter All',
        active: false,
        disabled: false,
        class: 'undefined'
      },
      attributes: {
        selector: '[type = "attribute"]',
        label: 'Attributes',
        active: false,
        disabled: false,
        class: 'filterattributes',
      },
      value_domain: {
        selector: '[type = "value-domain"]',
        label: 'Value Domain',
        active: false,
        disabled: false,
        class: 'filtervaluedomains'
      },
      individuals: {
        selector: '[type = "individual"]',
        label: 'Individuals',
        active: false,
        disabled: false,
        class: 'filterindividuals'
      },
      universal_quantifier: {
        selector: '[type $= "-restriction"][label = "forall"]',
        label: 'Universal Quantifier',
        active: false,
        disabled: false,
        class: 'filterforall'
      },
      not: {
        selector: '[type = "complement"]',
        label: 'Not',
        active: false,
        disabled: false,
        class: 'filtercomplements'
      },
    }

    this.owl_translator = new OwlTranslator()

    // container ad-hoc for cytoscape instance
    var cy_container = document.createElement('div')
    cy_container.setAttribute('id', 'cy')
    container.appendChild(cy_container)

    this.actual_diagram = null
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

    
    this.cy.on('select', 'node', e => {this.onNodeSelection(e.target.id())})
    this.cy.on('select', 'edge', e => {this.onEdgeSelection(e.target.id())})
    this.cy.on('tap', evt => {
      if (evt.target === this.cy) {
        this.onBackgroundClick()
      }
    })
    
  }

  centerOnNode (node_id, zoom) {
    var node = this.cy.getElementById(node_id)
    if (node) {
      this.centerOnPosition(node.position('x'), node.position('y'), zoom)
      this.cy.$(':selected').unselect()
      node.select()
    }
  }

  centerOnPosition (x_pos, y_pos, zoom) {
    this.cy.reset()
    var offset_x = this.cy.width() / 2
    var offset_y = this.cy.height() / 2
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

  resetView () {
    this.cy.fit()
  }

  drawDiagram (diagram) {
    this.cy.remove('*')
    this.cy.add(diagram.nodes)
    this.cy.add(diagram.edges)
    // check if any filter is active and if yes, apply them to the "actual diagram"
    Object.keys(this.filters).map(key => {
      if (this.filters[key].active)
        this.filter(this.filters[key])
    })

    this.cy.fit()

    this.actual_diagram = diagram.id
    /*
    if (this.ui_controller.diagram_selector)
      this.ui_controller.diagram_selector.actual_diagram = diagram
    */

    return true
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
        this.filterElem(e.target(), filter_class)
      }
    })

    // ARCHI IN ENTRATA
    element.incomers('edge').forEach(e => {
      let neighbour = e.source()
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      let number_edges_in_out = getNumberEdgesInOut(neighbour)

      if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
        this.filterElem(e.source(), filter_class)
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
    // Re-Apply other active filters to resolve ambiguity
    Object.keys(this.filters).map(key => {
      if (this.filters[key].active)
        this.filter(this.filters[key])
    })
  }

  setTheme(theme) {
    this.cy.style(getGraphStyle(theme))
  }
}
