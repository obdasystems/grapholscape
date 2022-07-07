import Namespace from "./namespace"

export default class Iri {
  private _namespace?: Namespace
  private _remainder: string

  constructor(iri: string, namespaces: Namespace[]) {
    let isPrefixed = false
    this.namespace = namespaces.find(n => {
      if (iri.includes(n.toString()))
        return true

      for (let prefix of n.prefixes) {
        if (iri === `${prefix}:${iri.split(':')[1]}`) {
          isPrefixed = true
          return true
        }
      }
    })


    if (!this.namespace) {
      console.warn(`Namespace not found for [${iri}]. The prefix undefined has been assigned`)
      this.namespace = new Namespace(['undefined'], 'undefined')
      this.remainder = iri
    } else {
      this.remainder = isPrefixed ? iri.split(':')[1] : iri.slice(this.namespace.toString().length)
    }
  }

  public set remainder(value: string) {
    this._remainder = value
  }

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

  public get fullIri() {
    return this.namespace?.toString() ? `${this.namespace.toString()}${this.remainder}` : this.remainder
  }

  public get prefixed() {
    return this.prefix || this.prefix === '' ? `${this.prefix}:${this.remainder}` : `${this.remainder}`
  }

  public equals(iriToCheck: string) {
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


}