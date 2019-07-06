import cytoscape from 'cytoscape'

export class Diagram {
  constructor (name, id, elements = {}) {
    this.name = name
    this.id = id
    this.cy = cytoscape()
    this._collection = this.cy.collection(elements)
  }

  addElems (elem) {
    this._collection = this.collection.union(this.cy.collection(elem))
  }

  set collection(collection) {
    this._collection = collection
  }

  get collection() {
    return this._collection
  }
}

export default Diagram
