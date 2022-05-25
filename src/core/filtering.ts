import Lifecycle, { LifecycleEvent } from "../lifecycle"
import { GrapholscapeState, GrapholTypesEnum } from "../model"
import Filter, { DefaultFilterKeyEnum } from "../model/filter"

export const filter = _filter
export const unfilter = _unfilter

function _filter(filter: string): void
function _filter(filter: Filter): void
/**
 * Apply a filter on every diagram
 * @param filter The key of a defined filter or the actual Filter object
 */
function _filter(filter: Filter | string) {
  const lifecycle: Lifecycle = this.lifecycle
  let _filter: Filter

  if (typeof filter === 'string') {
    _filter = getFilterByString(filter, this.filters)
    if (!_filter) return
  } else {
    _filter = filter
  }

  if (defaultFilterActivationLogic.call(this, _filter) && lifecycle.trigger(LifecycleEvent.FilterRequest, _filter)) {
    const actualState: GrapholscapeState = this.actualState

    actualState.ontology.diagrams.forEach(diagram => {
      diagram.filter(_filter)
    })

    _filter.active = true
    actualState.activeFilters.add(_filter)
    lifecycle.trigger(LifecycleEvent.Filter, _filter)
  }
}

/**
 * Actions and controls to perform before each filter activation.
 * I.E.: Activating data-properties filter should lock value-domain filter
 * @param filter Filter that wants to be activated
 * @returns whether the filter can be applied or not
 */
const defaultFilterActivationLogic = function (filter: Filter): boolean {
  if (filter.active) {
    console.warn(`Filter with key = "${filter.key} is already active`)
    return false
  }

  if (filter.locked) {
    console.warn(`Filter has been locked and cannot be applied at the moment`)
    return false
  }

  const filters: Map<string, Filter> = this.filters

  if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
    // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
    filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)?.lock()
  }

  return true
}

export function _unfilter(filter: Filter): void
export function _unfilter(filter: string): void
export function _unfilter(filter: Filter | string) {
  const lifecycle: Lifecycle = this.lifecycle
  let _filter: Filter

  if (typeof filter === 'string') {
    _filter = getFilterByString(filter, this.filters)
    if (!_filter) return
  } else {
    _filter = filter
  }

  if (defaultFilterDeactivationLogic.call(this, _filter) && lifecycle.trigger(LifecycleEvent.UnfilterRequest, _filter)) {
    const actualState: GrapholscapeState = this.actualState

    actualState.ontology.diagrams.forEach(diagram => {
      diagram.unfilter(_filter)
    })
  
    _filter.active = false
    actualState.activeFilters.delete(_filter)
  }
}

/**
 * Actions and controls to perform before each filter deactivation.
 * I.E.: Deactivating data-property filter should unlock value-domain filter
 * @param filter Filter that wants to be deactivated
 */
const defaultFilterDeactivationLogic = function (filter: Filter): boolean {
  if (!filter.active) {
    return false
  }

  if (filter.locked) {
    console.warn(`Filter has been locked and cannot be deactivated at the moment`)
    return false
  }

  const filters: Map<string, Filter> = this.filters

  if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
    // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
    filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)?.unlock()
  }

  return true
}

export const addFilter = function (newFilter: Filter) {
  const filters: Map<string, Filter> = this.filters
  filters.set(newFilter.key, newFilter)
}

// ------ DEFAULT FILTERS -------------


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

function getFilterByString(key: string, filters: Map<string, Filter>) {
  const filter = filters.get(key)

  if (!filter) {
    console.warn(`Can't find any filter with key = "${key}"`)
  }

  return filter
}