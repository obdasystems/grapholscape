import cytoscape from 'cytoscape'
import { Filter } from '../../model'
import { GrapholTypesEnum } from '../../model'


export enum DefaultFilterKeyEnum {
  ALL = 'all',
  DATA_PROPERTY = 'data-property',
  VALUE_DOMAIN = 'value-domain',
  INDIVIDUAL = 'individual',
  UNIVERSAL_QUANTIFIER = 'for-all',
  COMPLEMENT = 'complement',
  HAS_KEY = 'has-key'
}

const dataPropertyFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.DATA_PROPERTY,
    (element) => element.is(GrapholTypesEnum.DATA_PROPERTY)
  )
}

const valueDomainFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    (element) => element.is(GrapholTypesEnum.VALUE_DOMAIN)
  )
}

const individualsFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.INDIVIDUAL,
    (element) => element.is(GrapholTypesEnum.INDIVIDUAL)
  )
}

const universalQuantifierFilter = () => new Filter(
  DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
  (element) => {
    return (element.is(GrapholTypesEnum.DOMAIN_RESTRICTION) || element.is(GrapholTypesEnum.RANGE_RESTRICTION)) &&
      element.displayedName === 'forall'
  }
)

const complementFilter = () => new Filter(
  DefaultFilterKeyEnum.COMPLEMENT,
  (element) => element.is(GrapholTypesEnum.COMPLEMENT)
)

const hasKeyFilter = () => new Filter(
  DefaultFilterKeyEnum.HAS_KEY,
  (element) => element.is(GrapholTypesEnum.KEY)
)

export const getDefaultFilters = () => {
  return {
    DATA_PROPERTY: dataPropertyFilter(),
    VALUE_DOMAIN: valueDomainFilter(),
    INDIVIDUAL: individualsFilter(),
    UNIVERSAL_QUANTIFIER: universalQuantifierFilter(),
    COMPLEMENT: complementFilter(),
    HAS_KEY: hasKeyFilter(),
  } as const
}


export function cytoscapeFilter(elementId: string, filterTag: string, cy: cytoscape.Core) {
  const element = cy.$id(elementId)
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
  cy.$id(elementId).removeClass(classToRemove.join(' '))
  cy.$(`.${filterTag}`).removeClass(classToRemove.join(' '))
}