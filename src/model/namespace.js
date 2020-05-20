/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
export default class Namespace {
  /**
   * @param {string[]} prefixes - array of prefixes
   * @param {string} value - namespace lexical form
   * @param {boolean} standard - bool saying if the namespace is standard or user defined
   */
  constructor (prefixes = '', value, standard = false) {
    this.prefixes = prefixes
    this.value = value
    this.standard = standard
  }

  /**
   * Getter
   */
  get value() {
    return this._value
  }

  /**
   * Setter.
   * Auto adding final terminator if not present
   * @param {string} value - the string to set as value
   */
  set value(value) {
    if (!value.endsWith('/') && !value.endsWith('#'))
      value += '/'
    this._value = value
  }

  /**
   * Wether the namespace is standard (`true`) or user defined (`false`)
   * @returns {boolean}
   */
  isStandard () {
    return this.standard
  }
}