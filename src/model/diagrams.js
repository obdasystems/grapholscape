import cytoscape from 'cytoscape'

export class Diagram {
  constructor (name, id, elements = {}) {
    this.name = name
    this.id = id

    let container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    this.cy = cytoscape({
      container: container,
      style: [
        {
          selector: 'edge',
          style: {
            'width': 1,
            'target-arrow-shape': 'data(target_arrow)',
            'target-arrow-fill': 'data(arrow_fill)',
            'line-style': 'data(style)',
            'curve-style': 'bezier',
            'arrow-scale': 1.3
          }
        },
        {
          selector: '[segment_distances]',
          style: {
            'curve-style': 'segments',
            'segment-distances': 'data(segment_distances)',
            'segment-weights': 'data(segment_weights)',
            'edge-distances': 'node-position'
          }
        }
      ],
      layout: {
        name: 'preset'
      },
      styleEnabled: true,
    })

    this._collection = this.cy.collection(elements)
    //this.cy.add(this._collection)
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
