import Namespace from "./namespace"

export default class Iri {
  private _namespace?: Namespace
  private _remainder: string
  private _prefixes: string[]

  constructor(iri: string, namespaces: Namespace[]) {
    this.namespace = namespaces.find(n => iri.includes(n.toString()))


    if (!this.namespace) {
      console.warn(`Namespace not found for [${iri}]. The prefix undefined has been assigned`)
      this.namespace = new Namespace([undefined], undefined)
      this.remainder = iri
    } else {
      this.remainder = iri.slice(this.namespace.toString().length)
    }
  }

  public set remainder(value: string) {
    this._remainder = value
  }

  public get remainder() {
    return this._remainder
  }

  private set namespace(value: Namespace) {
    this._namespace = value
  }

  public get namespace() {
    return this._namespace
  }

  public get prefix() {
    return this.namespace.prefixes[0]
  }

  public get fullIri() {
    return this.namespace.toString() ? `${this.namespace.toString()}${this.remainder}` : this.remainder
  }

  public get prefixed() {
    return this.prefix ? `${this.prefix}:${this.remainder}` : `${this.remainder}`
  }

  public equals(iriToCheck: string) {
    return this.prefixed === iriToCheck || this.fullIri === iriToCheck
  }

  public hasPrefix(prefixToCheck: string) {
    return this.namespace.hasPrefix(prefixToCheck)
  }

  
}