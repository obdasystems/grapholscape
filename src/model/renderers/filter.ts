import GrapholElement from "../graphol-elems/graphol-element"
import { GrapholTypesEnum } from "../graphol-elems/node-enums"

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

export enum DefaultFilterKeyEnum {
  ALL = 'all',
  DATA_PROPERTY = 'data-property',
  VALUE_DOMAIN = 'value-domain',
  INDIVIDUAL = 'individual',
  UNIVERSAL_QUANTIFIER = 'for-all',
  COMPLEMENT = 'complement',
  HAS_KEY = 'has-key'
}

const dataPropertyFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.DATA_PROPERTY,
    (element) => element.is(GrapholTypesEnum.DATA_PROPERTY)
  )
}

const valueDomainFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.VALUE_DOMAIN,
    (element) => element.is(GrapholTypesEnum.VALUE_DOMAIN)
  )
}

const individualsFilter = () => {
  return new Filter(
    DefaultFilterKeyEnum.INDIVIDUAL,
    (element) => element.is(GrapholTypesEnum.INDIVIDUAL)
  )
}

const universalQuantifierFilter = () => new Filter(
  DefaultFilterKeyEnum.UNIVERSAL_QUANTIFIER,
  (element) => {
    return (element.is(GrapholTypesEnum.DOMAIN_RESTRICTION) || element.is(GrapholTypesEnum.RANGE_RESTRICTION)) &&
      element.displayedName === 'forall'
  }
)

const complementFilter = () => new Filter(
  DefaultFilterKeyEnum.COMPLEMENT,
  (element) => element.is(GrapholTypesEnum.COMPLEMENT)
)

const hasKeyFilter = () => new Filter(
  DefaultFilterKeyEnum.HAS_KEY,
  (element) => element.is(GrapholTypesEnum.KEY)
)

export const getDefaultFilters = () => {
  return {
    DATA_PROPERTY: dataPropertyFilter(),
    VALUE_DOMAIN: valueDomainFilter(),
    INDIVIDUAL: individualsFilter(),
    UNIVERSAL_QUANTIFIER: universalQuantifierFilter(),
    COMPLEMENT: complementFilter(),
    HAS_KEY: hasKeyFilter(),
  } as const
}