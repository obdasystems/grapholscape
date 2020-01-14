export class Iri {
  constructor (prefixes, value, standard = false) {
    this.prefixes = prefixes
    this.value = value
    this.standard = standard
  }

  getFullIri () {
    return this.prefixes[0] + ':' + this.value
  }
  
  isStandard () {
    return this.standard
  }
}

export default Iri
