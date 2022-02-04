/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
class Namespace {
  /**
   * @param {string[]} prefixes - array of prefixes
   * @param {string} value - namespace lexical form
   * @param {boolean} standard - bool saying if the namespace is standard or user defined
   */
  constructor (prefixes, value, standard = false) {
    this.prefixes = prefixes || ['']
    this.value = value
    this.standard = standard
  }

  /**
   * Wether the namespace is standard (`true`) or user defined (`false`)
   * @returns {boolean}
   */
  isStandard () {
    return this.standard
  }

  /**
   * Check if the passed prefix is assigned to this namespace
   * @param {string} prefix the prefix to check
   */
  hasPrefix(prefix) {
    return this.prefixes.includes(prefix)
  }
}

export default Namespace
