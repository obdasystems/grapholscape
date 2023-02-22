import { EntityViewData } from "../../../ui"

export default interface IClassInstancesExplorer {
  /** 
   * callback to be called when an instance is selected
   * @internal */
  onInstanceSelection: (iri: string) => void

  /** 
   * callback to be called when a text search is performed
   * @internal 
   */
  onEntitySearch: (searchText: string) => void

  /** 
   * callback to be called when a text search on a dataProperty is performed
   * @internal */
  onEntitySearchByDataPropertyValue: (dataPropertyIri: string, searchText: string) => void

  /** @internal */
  instances: EntityViewData[]
  /** @internal */
  areInstancesLoading: boolean
  // /** @internal */
  // areInstancesLoading: boolean
}