import { BaseFilterManager, DefaultFilterKeyEnum } from "../../../model"

/**
 * Incremental should not allow any filter and widgtet should not even be visible
 */
export default class IncrementalFilterManager extends BaseFilterManager {
  protected lockedFilters: DefaultFilterKeyEnum[] = Object.keys(DefaultFilterKeyEnum).map(k =>DefaultFilterKeyEnum[k])
}