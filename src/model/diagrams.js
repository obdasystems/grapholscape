import cytoscape from 'cytoscape'

export class Diagram {
  constructor (name, id, elements = null) {
    this.name = name
    this.id = id
    this.cy = cytoscape()
    if (elements)
      this.addElems(elements)
  }

  addElems (elems) {
    this.cy.add(elems)
  }

  getElems() {
    return this.nodes.union(this.edges)
  }

  get nodes() {
    return this.cy.nodes().jsons()
  }

  get edges() {
    return this.cy.edges().jsons()
  }

  get elems() {
    return this.nodes.union(this.edges)
  }
}

export default Diagram
