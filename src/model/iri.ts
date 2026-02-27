import Namespace from "./namespace"

export default class Iri {
  private _namespace?: Namespace
  private _remainder: string
  fullIri: string

  constructor(iri: string, namespaces: Namespace[], remainder?: string) {
    this.fullIri = iri

    let matchLength = 0
    for (let n of namespaces) {
      if (iri.startsWith(n.toString()) && n.value.length > matchLength) {
        this.namespace = n
        matchLength = n.value.length
      }
    }

    const lastSeparatorIndex = Math.max(this.fullIri.lastIndexOf('/'), this.fullIri.lastIndexOf('#'))
    this._remainder = this.fullIri.substring(lastSeparatorIndex + 1)
  }

  /** @readonly */
  public get remainder() {
    return this._remainder
  }

  private set namespace(value: Namespace | undefined) {
    this._namespace = value
  }

  public get namespace() {
    return this._namespace
  }

  public get prefix() {
    return this.namespace?.prefixes[0]
  }

  // public get fullIri() {
  //   return this.namespace?.toString() ? `${this.namespace.toString()}${this.remainder}` : this.remainder
  // }

  public get prefixed() {
    return this.prefix || this.prefix === ''
      ? `${this.prefix}:${this.fullIri.split(this.namespace!.value)[1]}`
      : `${this.fullIri}`
  }

  public equals(iriToCheck: string | Iri) {
    if (typeof iriToCheck !== 'string') {
      iriToCheck = iriToCheck.fullIri
    }
    if (this.fullIri === iriToCheck || this.prefixed === iriToCheck) return true
    if (!this.namespace) return false

    for (let prefix of this.namespace.prefixes) {
      if (`${prefix}:${this.remainder}` === iriToCheck) {
        return true
      }
    }

    return false
  }

  public hasPrefix(prefixToCheck: string) {
    return this.namespace?.hasPrefix(prefixToCheck) || false
  }

  public toString() {
    return this.fullIri
  }

}