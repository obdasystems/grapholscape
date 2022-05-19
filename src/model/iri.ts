import Namespace from "./namespace"

export default class Iri {
  private _namespace: Namespace;
  private _remainder: string;
  
  constructor(namespace: Namespace, remainder: string) {
    this.namespace = namespace
    this.remainder = remainder
  }

  private set remainder(value: string) {
    this._remainder = value
  }

  public get remainder() {
    return this._remainder
  }

  private set namespace(value) {
    this.namespace = value
  }

  public get namespace() {
    return this.namespace.toString()
  }

  public get prefix() {
    return this.namespace.prefixes[0]
  }

  public hasPrefix(prefixToCheck: string) {
    return this.namespace.hasPrefix(prefixToCheck)
  }

  
}