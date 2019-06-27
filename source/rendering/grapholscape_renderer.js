import cytoscape from 'cytoscape'
import createUi from './ui'
import { toggle } from './ui_util'
import { nodeToOwlString, edgeToOwlString } from './owl'
import { graph_style }  from './graph-style'

export default class GrapholscapeRenderer {
  constructor (container, ontology) {
    // container chosen by the user
    this.container = container
    this.ontology = ontology

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

    this.cy = cytoscape({
      container: cy_container,
      autoungrabify: true,
      wheelSensitivity: 0.4,
      maxZoom: 2.5,
      minZoom: 0.02,
      style: graph_style,
      layout: {
        name: 'preset'
      }
    })

    var this_render = this
    this.cy.on('select', '.predicate', function (evt) { this_render.showDetails(evt.target) })

    this.cy.on('select', '*', function (evt) {
      if (!evt.target.hasClass('predicate')) {
        document.getElementById('details').classList.add('hide')
      }
      if (evt.target.isEdge() && (evt.target.data('type') !== 'input')) {
        document.getElementById('owl_translator').classList.remove('hide')
        document.getElementById('owl_axiomes').innerHTML = this_render.edgeToOwlString(evt.target)
      } else if (evt.target.isNode() && evt.target.data('type') !== 'facet') {
        document.getElementById('owl_translator').classList.remove('hide')
        document.getElementById('owl_axiomes').innerHTML = this_render.nodeToOwlString(evt.target, true)
      } else {
        document.getElementById('owl_translator').classList.add('hide')
      }
    })

    this.cy.on('tap', function (evt) {
      if (evt.target === this_render.cy) {
        document.getElementById('details').classList.add('hide')
        document.getElementById('owl_translator').classList.add('hide')
        var i, button
        var bottom_windows = document.getElementsByClassName('bottom_window')
        for (i = 0; i < bottom_windows.length; i++) {
          bottom_windows[i].classList.add('hide')
        }
        var collapsible_elms = document.getElementsByClassName('gcollapsible')
        for (i = 0; i < collapsible_elms.length; i++) {
          if (collapsible_elms[i].id === 'details_body' || collapsible_elms[i].id === 'translator_body') { continue }
          if (collapsible_elms[i].clientHeight !== 0) {
            if (collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0]) {
              toggle(collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0])
            } else {
              toggle(collapsible_elms[i])
            }
          }
        }
      }
    })
    this.actual_diagram = Object()
    this.createUi()
  }

  // getDiagramName(diagram_id) {
  //   return this.diagrams[diagram_id].getAttribute('name');
  // }

  // getDiagramId(name) {
  //   var diagram_id;
  //   for (diagram_id = 0; diagram_id < this.diagrams.length; diagram_id++) {
  //     if (this.diagrams[diagram_id].getAttribute('name') === name)
  //       return diagram_id;
  //   }
  //   return -1;
  // }

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

  renderDescription (description) {
    return description.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
  }

  showDetails (target) {
    this.entity_details.entity = target.json()
    this.entity_details.show()
    
    /*
    document.getElementById('details').classList.remove('hide')
    var body_details = document.getElementById('details_body')
    body_details.innerHTML = '<table class="details_table">' +
                             '<tr><th>Name</th><td>' + target.data('label').replace(/\n/g, '') + '</td></tr>' +
                             '<tr><th>Type</th><td>' + target.data('type') + '</td></tr>' +
                             '<tr><th>IRI</th><td><a style="text-decoration:underline" href="/documentation/predicate/' + target.data('type') + '/' + target.data('label').replace('\n', '') + '">' + target.data('iri') + '</a></td></tr></table>'
    if (target.data('type') ==='role' || target.data('type') ==='attribute') {
      if (target.data('functional')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Functional</span></div>' }
      if (target.data('inverseFunctional')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Inverse Functional</span></div>' }
      if (target.data('asymmetric')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>' }
      if (target.data('irreflexive')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Irreflexive</span></div>' }
      if (target.data('reflexive')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>' }
      if (target.data('symmetric')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Symmetric</span></div>' }
      if (target.data('transitive')) { body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Transitive</span></div>' }
    }
    if (target.data('description')) {
      body_details.innerHTML += '<div class="table_header"><strong>Description</strong></div><div class="descr">' + this.renderDescription(target.data('description')) + '</div>'
    }
    */
  }

  toggleFullscreen (button, x, y, event) {
    var c = this.container
    if (this.isFullscreen()) {
      document.cancelFullscreen()
    } else {
      c.requestFullscreen()
    }
  }

  isFullscreen () {
    return document.fullScreenElement ||
      document.mozFullScreenElement || // Mozilla
      document.webkitFullscreenElement || // Webkit
      document.msFullscreenElement // IE
  }

  resetView () {
    this.cy.fit()
  }

  drawDiagram (diagram) {
    this.cy.remove('*')
    this.cy.add(diagram.collection)
    // check if any filter is active and if yes, apply them to the "actual diagram"
    var filter_options = document.getElementsByClassName('filtr_option')
    var i
    for (i = 0; i < filter_options.length; i++) {
      if (!filter_options[i].firstElementChild.firstElementChild.checked) {
        this.filter(filter_options[i].firstElementChild.firstElementChild.id)
      }
    }
    this.cy.fit()

    if (this.diagram_selector)
      this.diagram_selector.actual_diagram = diagram

    return true
  }

  filter (checkbox_id) {
    var eles, type
    var this_graph = this

    switch (checkbox_id) {
      case 'val_check':
        type = 'value-domain'
        break
      case 'attr_check':
        type = 'attribute'
        if (!document.getElementById('attr_check').checked) {
          document.getElementById('val_check').setAttribute('disabled', 'true')
        } else {
          document.getElementById('val_check').removeAttribute('disabled')
        }
        break
      case 'indiv_check':
        type = 'individual'
        break
      case 'forall_check':
        type = 'forall'
        break
      case 'not_check':
        type = 'complement'
        break
    }

    if (type === 'forall') {
      eles = this.cy.$(':visible[type $= "-restriction"][label = "forall"], .forall_check')
    } else {
      eles = this.cy.$(':visible[type = "' + type + '"], .' + checkbox_id)
    }

    var filter_options = document.getElementsByClassName('filtr_option')
    var i; var active = 0

    if (document.getElementById(checkbox_id).checked) {
      eles.removeClass(checkbox_id)
      eles.removeClass('filtered')
      // Re-Apply other active filters to resolve ambiguity
      for (i = 0; i < filter_options.length; i++) {
        var filter = filter_options[i].firstElementChild.firstElementChild
        if (!filter.checked) {
          this.filter(filter.id)
        }
      }
    } else {
      eles.forEach(function (element) {
        filterElem(element, checkbox_id)
      })
    }
    // check if any filter is active in order to change the icon's color
    for (i = 0; i < filter_options.length; i++) {
      if (!filter_options[i].firstElementChild.firstElementChild.checked) {
        filter_options[i].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = 'rgb(81,149,199)'
        active = 1
        break
      }
    }
    if (!active) {
      filter_options[0].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = ''
    }

    function filterElem (element, option_id) {
      element.addClass('filtered ' + option_id)
      // Filter fake nodes!
      this_graph.cy.nodes('[parent_node_id = "' + element.id() + '"]').addClass('filtered ' + option_id)
      // ARCHI IN USCITA
      var selector = '[source = "' + element.data('id') + '"]'
      element.connectedEdges(selector).forEach(function (e) {
        // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        var sel2 = 'edge:visible[source = "' + e.target().id() + '"]'
        var sel3 = 'edge:visible[target = "' + e.target().id() + '"][type !== "input"]'
        var number_edges_in_out = e.target().connectedEdges(sel2).size() + e.target().connectedEdges(sel3).size()
        if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') === 'input')) {
          filterElem(e.target(), option_id)
        }
      })
      // ARCHI IN ENTRATA
      selector = '[target ="' + element.data('id') + '"]'
      element.connectedEdges(selector).forEach(function (e) {
        // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
        var sel2 = 'edge:visible[source = "' + e.source().id() + '"]'
        var sel3 = 'edge:visible[target = "' + e.source().id() + '"][type !== "input"]'
        var number_edges_in_out = e.source().connectedEdges(sel2).size() + e.source().connectedEdges(sel3).size()
        if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
          filterElem(e.source(), option_id)
        }
      })
    }
  }

  setTheme (theme) {
    this.cy.style(theme)
  }
}

Object.assign(GrapholscapeRenderer.prototype, { createUi, nodeToOwlString, edgeToOwlString })
