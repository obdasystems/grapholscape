import cytoscape from 'cytoscape'
import GrapholscapeUiController from '../ui/ui-controller'
import { nodeToOwlString, edgeToOwlString } from './owl'
import { getGraphStyle }  from './graph-style'
import * as themes from '../style/themes'

export default class GrapholscapeRenderer {
  constructor (container, ontology) {
    // container chosen by the user
    this.container = container
    this.ontology = ontology

    this.filters = {
      all: {
        type: 'all',
        label: 'Filter All',
        active: false,
        disabled: false,
      },
      attributes: {
        type: 'attribute',
        label: 'Attributes',
        active: false,
        disabled: false,
        class: 'filterattributes',
      },
      value_domain: {
        type: 'value-domain',
        label: 'Value Domain',
        active: false,
        disabled: false,
        class: 'valuedomains'
      },
      individuals: {
        type: 'individual',
        label: 'Individuals',
        active: false,
        disabled: false,
        class: 'filterindividuals'
      },
      universal_quantifier: {
        type: 'forAll',
        label: 'Universal Quantifier',
        active: false,
        disabled: false,
        class: 'filterforall'
      },
      not: {
        type: 'complement',
        label: 'Not',
        active: false,
        disabled: false,
        class: 'filtercomplements'
      },
    }

    this.container = container
    this.container.style.fontSize = '14px'
    this.container.style.color = '#666'

    this.container.requestFullscreen =
    this.container.requestFullscreen ||
    this.container.mozRequestFullscreen || // Mozilla
    this.container.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
    this.container.webkitRequestFullscreen || // Webkit
    this.container.msRequestFullscreen // IE

    document.cancelFullscreen =
    document.cancelFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitCancelFullScreen ||
    document.msExitFullscreen

    // container ad-hoc for cytoscape instance
    var cy_container = document.createElement('div')
    cy_container.setAttribute('id', 'cy')
    this.container.appendChild(cy_container)

    this.actual_diagram = Object()
    
    this.ui_controller = new GrapholscapeUiController(this)
    this.ui_controller.createUi()

    this.cy = cytoscape({
      container: cy_container,
      autoungrabify: true,
      wheelSensitivity: 0.4,
      maxZoom: 2.5,
      minZoom: 0.02,
      style: getGraphStyle(themes.gscape),
      layout: {
        name: 'preset'
      }
    })

    this.cy.on('select', '.predicate', evt => { this.ui_controller.showDetails(evt.target) })

    this.cy.on('select', '*', evt => {
      if (!evt.target.hasClass('predicate')) {
        this.ui_controller.hideDetails()
      }
      if (evt.target.isEdge() && (evt.target.data('type') !== 'input')) {
        let owl_text = this.edgeToOwlString(evt.target)
        this.ui_controller.showOwlTranslation(owl_text)
      } else if (evt.target.isNode() && evt.target.data('type') !== 'facet') {
        let owl_text = this.nodeToOwlString(evt.target, true)
        this.ui_controller.showOwlTranslation(owl_text)
      } else {
        this.ui_controller.hideOwlTranslation()
      }
    })

    this.cy.on('tap', evt => {
      if (evt.target === this.cy) {
        this.ui_controller.widgets.forEach(widget => widget.blur())
      }
    })
  }

  centerOnNode (node_id, diagram, zoom) {
    // if we're not on the diagram of the node to center on, just draw it!
    if (this.actual_diagram.id !== diagram.id) {
      this.drawDiagram(diagram)
    }
    var node = this.cy.getElementById(node_id)
    this.centerOnPosition(node.position('x'), node.position('y'), zoom)
    this.cy.collection(':selected').unselect()
    node.select()
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
    this.cy.add(diagram.collection)
    // check if any filter is active and if yes, apply them to the "actual diagram"
    Object.keys(this.filters).map(key => {
      if (this.filters[key].active)
        this.filter(key)
    })

    this.cy.fit()

    if (this.ui_controller.diagram_selector)
      this.ui_controller.diagram_selector.actual_diagram = diagram

    return true
  }

  filter(key) {
    let selector = ``
    let that = this

    if (this.filters[key].type === 'forAll') {
      selector = `:visible[type $= "-restriction"][label = "forall"], .${this.filters[key].class}`
    } else {
      selector = `:visible[type = "${this.filters[key].type}"], .${this.filters[key].class}`
    }

    this.cy.$(selector).forEach( element => {
      filterElem(element, this.filters[key].class)
    })

    function filterElem (element, filter_class) {
      element.addClass('filtered '+filter_class)
      // Filter fake nodes!
      that.cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass('filtered '+filter_class)
      // ARCHI IN USCITA
      var selector = `[source = "${element.data('id')}"]`
      element.connectedEdges(selector).forEach( e => {
        // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        var sel2 = `edge:visible[source = "${e.target().id()}"]`
        var sel3 = `edge:visible[target = "${e.target().id()}"][type != "input"]`
        var number_edges_in_out = e.target().connectedEdges(sel2).size() + e.target().connectedEdges(sel3).size()
        if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') === 'input')) {
          filterElem(e.target(), filter_class)
        }
      })

      // ARCHI IN ENTRATA
      selector = `[target ="${element.data('id')}"]`
      element.connectedEdges(selector).forEach(e => {
        // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        var sel2 = `edge:visible[source = "${e.source().id()}"]`
        var sel3 = `edge:visible[target = "${e.source().id()}"][type != "input"]`
        var number_edges_in_out = e.source().connectedEdges(sel2).size() + e.source().connectedEdges(sel3).size()
        if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
          filterElem(e.source(), filter_class)
        }
      })
    }

  }

  unfilter(key) {
    let filter_class = this.filters[key].class
    let selector = `` 
    if (this.filters[key].type === 'forAll') {
      selector = `:visible[type $= "-restriction"][label = "forall"], .${this.filters[key].class}`
    } else {
      selector = `:visible[type = "${this.filters[key].type}"], .${this.filters[key].class}`
    }
    
    this.cy.$(selector).removeClass('filtered')
    this.cy.$(selector).removeClass(filter_class)
    // Re-Apply other active filters to resolve ambiguity
    Object.keys(this.filters).map(key => {
      if (this.filters[key].active)
        this.filter(key)
    })
  }

  set theme(theme) {
    this.cy.style(getGraphStyle(theme))

    let prefix = '--theme-gscape-'
    Object.keys(theme).map(key => {
      let css_key = prefix + key.replace(/_/g,'-')
      this.container.style.setProperty(css_key, theme[key]) 
    })
  }
}

Object.assign(GrapholscapeRenderer.prototype, { nodeToOwlString, edgeToOwlString })
