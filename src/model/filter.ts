import GrapholElement from "./graphol-elems/graphol-element"

/**
 * @type {Filter[]}
 */
let filters: any[]

/**
 * Change the state of a filter
 * @param {string} filterKey the unique key of a predefined filter
 * @param {boolean} state new state to assign to the filter
 */
export function setFilterState(filterKey: any, state: any) {
  getFilterByKey(filterKey).active = state
}

/**
 * 
 * @param {string} filterKey the unique key of a predefined filter to retrieve
 */
export function getFilterByKey(filterKey: any) {
  return filters.find(f => f.key === filterKey)
}

/**
 * Get an array of filters
 */
export function getFilters() {
  return filters
}

/**
 * 
 * @param {Filter[]} newFilters array of filters
 */
export function setFilters(newFilters: any) {
  filters = newFilters
}

export enum DefaultFilterKeyEnum {
  ALL = 'all',
  DATA_PROPERTY = 'data-property',
  VALUE_DOMAIN = 'value-domain',
  INDIVIDUAL = 'individual',
  UNIVERSAL_QUANTIFIER = 'for-all',
  COMPLEMENT = 'complement',
  HAS_KEY = 'has-key'
}


/** 
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active whether the filter is currently active or not
 * @property {boolean} Filter.activable whether the filter is currently activable
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key unique key to identify a filter
 */



export default class Filter {
  private _key: string
  private _compareFn: (grapholElement: GrapholElement) => boolean = () => false
  active: boolean = false
  private _locked: boolean = false

  /**
   * 
   * @param key Unique identifier
   * @param compareFn Function receiving a GrapholElement and returning true if the element should be filtered, false otherwise
   */
  constructor(key: string, compareFn: (grapholElement: GrapholElement) => boolean) {
    this._key = key
    this._compareFn = compareFn
  }

  get key() {
    return this._key
  }

  get filterTag() {
    return `filter-${this.key}`
  }

  get locked() { return this._locked }

  lock() {
    this._locked = true
  }

  unlock() {
    this._locked = false
  }

  shouldFilter(grapholElement: GrapholElement) {
    return this._compareFn(grapholElement)
  }
}