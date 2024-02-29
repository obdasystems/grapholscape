import { BaseFilterManager, DefaultFilterKeyEnum } from "../../../model";

export default class LiteFilterManager extends BaseFilterManager {
  protected lockedFilters = [
    DefaultFilterKeyEnum.ANNOTATION_PROPERTY,
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
    DefaultFilterKeyEnum.COMPLEMENT,
    DefaultFilterKeyEnum.HAS_KEY,
  ]
}