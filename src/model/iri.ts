import Namespace from "./namespace"

export default class Iri {
  private _namespace?: Namespace
  private _remainder: string
  private _prefixes: string[]

  constructor(iri: string, namespaces: Namespace[]) {
    for (let namespace of namespaces) {
      // if iri contains namespace 
      if (iri.includes(namespace.toString())) {
        this.namespace = namespace
        this.remainder = iri.slice(namespace.toString().length)
      }
    }


    if (!this.namespace) {
      console.warn(`Namespace not found for [${iri}]. The prefix "undefined" has been assigned`)
      this.namespace = new Namespace(['undefined'], '')
      this.remainder = iri
    }
  }

  public set remainder(value: string) {
    this._remainder = value
  }

  public get remainder() {
    return this._remainder
  }

  private set namespace(value) {
    this._namespace = value
  }

  public get namespace() {
    return this.namespace?.toString()
  }

  public get prefix() {
    return this.namespace.prefixes[0]
  }

  public get fullIri() {
    return this.namespace + this.remainder
  }

  public get prefixed() {
    return `${this.prefix}:${this.remainder}`
  }

  public equals(iriToCheck: string) {
    return this.prefixed === iriToCheck || this.fullIri === iriToCheck
  }

  public hasPrefix(prefixToCheck: string) {
    return this.namespace.hasPrefix(prefixToCheck)
  }

  
}