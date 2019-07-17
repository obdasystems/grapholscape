import cytoscape from 'cytoscape'

export class Diagram {
  constructor (name, id, elements = {}) {
    this.name = name
    this.id = id

    let container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

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
    let nodes = this.cy.nodes()
    let edges = this.cy.edges()
    return nodes.union(edges)
  }
}

export default Diagram
