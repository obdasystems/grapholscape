import { BaseFilterManager, Filter, DefaultFilterKeyEnum } from "../../../model";

export default class LiteFilterManager extends BaseFilterManager {
  private _filters: Map<string, Filter>
  private lockedFilters = [
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
    DefaultFilterKeyEnum.COMPLEMENT,
    DefaultFilterKeyEnum.HAS_KEY,
  ]

  get filters() { return this._filters }
  set filters(filters) {
    this._filters = filters

    this.lockedFilters.forEach(lockedFilterKey => {
      this.filters.get(lockedFilterKey)?.lock()
    })
  }
}