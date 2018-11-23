class Ontology {

	constructor(name, version, iriSet= new Set(), diagrams = []) {
		this.name = name;
		this.version = version;
		this.iriSet = iriSet;
		this.diagrams = diagrams;
	}

	// @param {Iri} iri 
	addIri(iri) {
		this.iriSet.add(iri);
	}

  // @param {Diagram} diagram
	addDiagram(diagram) {
		this.diagrams.push(diagram);
	}

  // return a collection with all the predicates in the ontology
	getPredicates() {
    var predicates = cytoscape().collection();
		this.diagrams.forEach(diagram => {
			predicates = predicates.union(diagram.collection.filter('.predicate'));
    });
    
    return predicates;
  }
  
  getDefaultIri() {
    let return_iri = null;
    this.iriSet.forEach(iri => {
      if (iri.isDefault()) {
        return_iri = iri;
        return;
      }
    });

    return return_iri;
  }
}