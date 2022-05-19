import { GrapholscapeState } from "../model"
import Filter from "../model/filter"

export const filter = function(filter: Filter) {
  let actualState: GrapholscapeState = this.actualState
  let cy = actualState.diagram.cy
  let selector = `${filter.cytoscapeSelector }, .${filter.class}`

  cy.$(selector).forEach(element => {
    filterElem(element, filter.class, cy)
  })

  filter.active = true
}

function filterElem (element, filter_class, cy_instance) {
  let cy = cy_instance
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
      filterElem(e.target(), filter_class, cy)
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

export const unfilter = function(filter: Filter) {
  let actualState: GrapholscapeState = this.actualState
  let selector = `${filter.cytoscapeSelector}, .${filter.class}`
  let cy = actualState.diagram.cy

  cy.$(selector).removeClass('filtered')
  cy.$(selector).removeClass(filter.class)
  filter.active = false
}