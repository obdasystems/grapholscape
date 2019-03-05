export class Iri {
  constructor(prefix, value, dflt=false, project=false, standard=false) {
    this.prefix = prefix;
    this.value = value;
    this.default = dflt;
    this.project = project;
    this.standard = standard;
  }

  getFullIri() {
    return this.prefix+':'+this.value;
  }

  isDefault() {
    return this.default;
  }

  isProject() {
    return this.project;
  }

  isStandard() {
    return this.standard;
  }

}

export default Iri