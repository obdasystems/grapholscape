import Filter, { DefaultFilterKeyEnum } from "./filter"

export default interface FilterManager {
  filters: Map<string, Filter>

  filterActivation: (filter: Filter) => boolean
  filterDeactivation: (filter: Filter) => boolean
}

export abstract class BaseFilterManager implements FilterManager {
  protected _filters: Map<string, Filter>
  protected lockedFilters: DefaultFilterKeyEnum[] = []

  filterActivation(filter: Filter) {
    if (filter.active) {
      console.warn(`Filter with key = "${filter.key} is already active`)
      return false
    }

    if (filter.locked) {
      console.warn(`Filter has been locked and cannot be applied at the moment`)
      return false
    }

    return true
  }

  filterDeactivation(filter: Filter) {
    if (!filter.active) {
      return false
    }

    if (filter.locked) {
      console.warn(`Filter has been locked and cannot be deactivated at the moment`)
      return false
    }

    return true
  }

  get filters() { return this._filters }
  set filters(filters) {
    this._filters = filters

    filters.forEach(filter => {
      if (this.lockedFilters.includes(filter.key as DefaultFilterKeyEnum))
        filter?.lock()
      else
        filter?.unlock()
    })
  }
}