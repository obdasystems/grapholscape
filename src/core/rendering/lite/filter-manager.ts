import { BaseFilterManager, Filter } from "../../../model";
import { DefaultFilterKeyEnum } from "../default-filters";

export default class LiteFilterManager extends BaseFilterManager {
  private _filters: Map<string, Filter>
  private lockedFilters = [
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
    DefaultFilterKeyEnum.COMPLEMENT
  ]

  get filters() { return this._filters }
  set filters(filters) {
    this._filters = filters

    this.lockedFilters.forEach(lockedFilterKey => {
      this.filters.get(lockedFilterKey)?.lock()
    })
  }
}