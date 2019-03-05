import cytoscape from 'cytoscape';

export class Diagram {
  constructor(name, id, elements={}) {
    this.name = name;
    this.id = id;
    this.cy = cytoscape();
    this.collection = this.cy.collection(elements);
  }
    
  addElems(elem) {
    this.collection = this.collection.union(this.cy.collection(elem));
  }
}

export default Diagram