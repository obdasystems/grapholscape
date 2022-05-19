/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
class Namespace {
  private _prefixes: string[]
  private _value: string
  private _standard: boolean

  constructor (prefixes: string[], value: string, standard = false) {
    this.prefixes = prefixes
    this.value = value
    this.standard = standard
  }

  public get prefixes() {
    return Array.from(this._prefixes)
  }

  private set prefixes(value) {
    this._prefixes = value
  }

  private set value(val: string) {
    this._value = val
  }

  public toString() {
    return this._value
  }

  private set standard(value: boolean) {
    this._standard = value
  }

  /**
   * Wether the namespace is standard (`true`) or user defined (`false`)
   */
  public isStandard (): boolean {
    return this._standard ? true : false
  }

  /**
   * Check if the passed prefix is assigned to this namespace
   * @param prefix the prefix to check
   */
  public hasPrefix(prefix: string) {
    return this.prefixes.includes(prefix)
  }
}

export default Namespace
