import { BaseFilterManager, Filter, DefaultFilterKeyEnum } from "../../../model";

export default class FloatyFilterManager extends BaseFilterManager {
  protected lockedFilters = [
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
    DefaultFilterKeyEnum.COMPLEMENT,
    DefaultFilterKeyEnum.HAS_KEY,
  ]
}