import { BaseFilterManager, Filter, DefaultFilterKeyEnum } from "../../../model"
import { filter } from "../../../ui/assets/icons"

export default class GrapholFilterManager extends BaseFilterManager {
  _filters: Map<string, Filter>


  filterActivation(filter: Filter) {
    if (!super.filterActivation(filter))
      return false

    if (filter.locked) {
      console.warn(`Filter has been locked and cannot be applied at the moment`)
      return false
    }

    if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
      // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
      this.filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)?.lock()
    }

    return true
  }


  filterDeactivation(filter: Filter) {
    if (!super.filterDeactivation(filter))
      return false

    if (filter.key === DefaultFilterKeyEnum.DATA_PROPERTY) {
      // VALUE DOMAIN filter cannot be changed if data-property filter has been activated
      this.filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)?.unlock()
    }

    return true
  }

  get filters() { return this._filters }
  set filters(filters) {
    this._filters = filters

    filters.forEach(filter => {
      filter.unlock()
    })

    if (filters.get(DefaultFilterKeyEnum.DATA_PROPERTY)?.active) {
      filters.get(DefaultFilterKeyEnum.VALUE_DOMAIN)?.lock()
    }
  }
}