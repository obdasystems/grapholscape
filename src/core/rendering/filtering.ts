import cytoscape from 'cytoscape'
import { GrapholTypesEnum } from '../../model'

export function cytoscapeFilter(elementId: string, filterTag: string, cy: cytoscape.Core) {
  const element = cy.$id(elementId)

  if (element.hasClass('filtered'))
    return

  const classesToAdd = ['filtered', filterTag]
  element.addClass(classesToAdd.join(' '))
  // Filter fake nodes!
  cy.nodes(`[parent_node_id = "${element.id()}"]`).addClass(classesToAdd.join(' '))

  // ARCHI IN USCITA
  //var selector = `[source = "${element.data('id')}"]`
  element.outgoers('edge').forEach(e => {
    let neighbour = e.target()

    // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
    let number_edges_in_out = getNumberEdgesInOut(neighbour)

    if (!e.target().hasClass(classesToAdd[0]) && (number_edges_in_out <= 0 || e.data('type') === GrapholTypesEnum.INPUT)) {
      cytoscapeFilter(e.target().id(), filterTag, cy)
    }
  })

  // ARCHI IN ENTRATA
  element.incomers('edge').forEach(e => {
    let neighbour = e.source()
    // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
    let number_edges_in_out = getNumberEdgesInOut(neighbour)

    if (!e.source().hasClass(classesToAdd[0]) && number_edges_in_out === 0) {
      cytoscapeFilter(e.source().id(), filterTag, cy)
    }
  })

  function getNumberEdgesInOut(neighbour: cytoscape.NodeSingular) {
    let count = neighbour.outgoers('edge').size() + neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).size()

    neighbour.outgoers('node').forEach(node => {
      if (node.hasClass(classesToAdd[0])) {
        count--
      }
    })

    neighbour.incomers(`edge[type != "${GrapholTypesEnum.INPUT}"]`).forEach(e => {
      if (e.source().hasClass(classesToAdd[0])) {
        count--
      }
    })

    return count
  }
}

export function cytoscapeUnfilter(elementId: string, filterTag: string, cy: cytoscape.Core) {
  const classToRemove = ['filtered', filterTag]
  const element = cy.$id(elementId)
  if (element.hasClass('filtered') && element.hasClass(filterTag)) {
    cy.$id(elementId).removeClass(classToRemove.join(' '))
    cy.$(`.${filterTag}`).removeClass(classToRemove.join(' '))
  }
}