/** 
 * @typedef {object} Filter
 * @property {string} Filter.selector Cytoscape selector identifying the elements to filter out
 * [cytoscape selectors](https://js.cytoscape.org/#selectors)
 * @property {boolean} Filter.active whether the filter is currently active or not
 * @property {boolean} Filter.activable whether the filter is currently activable
 * @property {string} Filter.class the class to add to filtered elems to easily retrieve them later on
 * @property {string} Filter.key unique key to identify a filter
 */

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


export default class Filter {
  private _key: string
  private _class: string
  private _cytoscapeSelector: string
  active: boolean
  activable: boolean

  constructor(key: string, cyClass: string, selector: string, active = false, activable = true ) {
    this._key = key
    this._class = cyClass
    this._cytoscapeSelector = selector
    this.active = active
    this.activable = activable
  }


  get cytoscapeSelector() {
    return this._cytoscapeSelector
  }

  get key() {
    return this._key
  }

  get class() {
    return this._class
  }
}