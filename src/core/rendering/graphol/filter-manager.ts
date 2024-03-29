import { BaseFilterManager, DefaultFilterKeyEnum, Filter } from "../../../model"

export default class GrapholFilterManager extends BaseFilterManager {
  _filters: Map<string, Filter>

  protected lockedFilters = [
    DefaultFilterKeyEnum.ANNOTATION_PROPERTY,
  ]

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
}