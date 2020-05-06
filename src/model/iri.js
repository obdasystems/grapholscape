export class Iri {
  constructor (prefixes = '', value, standard = false) {
    this.prefixes = prefixes
    this.value = value
    this.standard = standard
  }

  get value() {
    return this._value
  }

  set value(value) {
    if (!value.endsWith('/') && !value.endsWith('#'))
      value += '/'
    this._value = value
  }

  isStandard () {
    return this.standard
  }

  static getNamespace(iri) {
    let namespace = iri.slice(0, iri.lastIndexOf('#') + 1)
    // if namespace is empty then use '/' as separator
    if (!namespace) {
      namespace = iri.slice(0, iri.lastIndexOf('/') + 1)
    }

    return namespace
  }

  static getRemainingChars(iri) {
    let rem_chars = iri.slice(iri.lastIndexOf('#') + 1)
    // if rem_chars has no '#' then use '/' as separator
    if (rem_chars.length == iri.length) {
      rem_chars = iri.slice(iri.lastIndexOf('/') + 1)
    }

    return rem_chars
  }
}

export default Iri
