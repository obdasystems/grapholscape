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
}

export default Iri
