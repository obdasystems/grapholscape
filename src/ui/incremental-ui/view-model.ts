import { EntityViewData } from "../util/search-entities"

export interface IIncrementalDetails {
  // callbacks
  /** @internal */
  onObjectPropertySelection: (iri: string, objectPropertyIri: string, direct: boolean) => void
  /** @internal */
  onGetInstances: () => void
  /** @internal */
  onInstanceSelection: (iri: string) => void
  /** @internal */
  onEntitySearch: (searchText: string) => void
  /** @internal */
  onEntitySearchByDataPropertyValue: (dataPropertyIri: string, searchText: string) => void
  /** @internal */
  onInstanceObjectPropertySelection: (instanceIri: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) => void

  // populate the menu
  setObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  addObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  setDataProperties: (dataProperties: EntityViewData[]) => void
  addDataProperties: (dataProperties: EntityViewData[]) => void

  // data properties values
  /** @internal */
  setDataPropertiesValues: (dataPropertiesValues: Map<string, { values: string[]; loading?: boolean | undefined; }>) => void
  /** @internal */
  addDataPropertiesValues: (dataPropertyIri: string, values: string[]) => void
  /** @internal */
  setDataPropertyLoading: (dataPropertyIri: string, isLoading: boolean) => void

  // Object properties range instances
  /** @internal */
  setObjectPropertyRanges: (objectPropertyRanges: Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>) => void
  /** @internal */
  setObjectPropertyLoading: (objectPropertyIri: string, rangeClassIri: string, isLoading: boolean) => void
  /** @internal */
  addObjectPropertyRangeInstances: (objectPropertyIri: string, rangeClassIri: string, classInstances: EntityViewData[]) => void
  /** @internal */
  onGetRangeInstances: (objectPropertyIri: string, rangeClassIri: string) => void

  /** 
   * remove current instances and add the new ones
   * @internal 
   */
  setInstances: (instances: EntityViewData[]) => void
  /** 
   * append new instances to the existing ones
   * @internal
   */
  addInstances: (instances: EntityViewData[]) => void

  /** @internal */
  onLimitChange: (limitValue: number) => void

  /** @internal */
  onParentClassSelection: (iri: string) => void

  reset: () => void

  /** @internal */
  canShowInstances: boolean
  /** @internal */
  canShowDataPropertiesValues: boolean
  /** @internal */
  canShowObjectPropertiesRanges: boolean
  /** @internal */
  isInstanceCounterLoading: boolean
  /** @internal */
  areInstancesLoading: boolean
  /** @internal */
  instanceCount: number
  /** @internal */
  parentClasses?: EntityViewData[]
}

export interface INavigationMenu {
  // populate the menu
  setObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void

  // Object properties range instances
  /** @internal */
  setObjectPropertyRanges: (objectPropertyRanges: Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>) => void
  /** @internal */
  setObjectPropertyLoading: (objectPropertyIri: string, rangeClassIri: string, isLoading: boolean) => void
  /** @internal */
  addObjectPropertyRangeInstances: (objectPropertyIri: string, rangeClassIri: string, classInstances: EntityViewData[]) => void
  // /** @internal */
  // onGetRangeInstances: (objectPropertyIri: string, rangeClassIri: string) => void
}

export interface IClassInstancesExplorer {
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

export type ViewIncrementalObjectProperty = {
  objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  loading?:boolean,
  direct: boolean
}