import GrapholscapeRenderer from './default-renderer'
import cola from 'cytoscape-cola'
import cytoscape from 'cytoscape'

export default class FloatingGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container)
    cytoscape.use(cola)
  }

  drawDiagram(diagram) {
    super.drawDiagram(diagram)
    this.cy.autoungrabify(false)

    let layout = this.cy.$('*').layout({
      name: 'cola',
      avoidOverlap: false,
      edgeLength: function(edge) {
        if (edge.hasClass('role')) 
          return 300 
        else if (edge.target().data('type') == 'attribute' ||
                 edge.source().data('type') == 'attribute' )
          return 150
        else 
          return 250
      },
      fit: true,
    })
    
    this.layoutReady = layout.pon('layoutstop')
    layout.run()
  }

  centerOnNode (node_id, zoom) {
    this.layoutReady.then(() => {
      let node = this.cy.$id(node_id)
      if (node) {
        this.cy.$(':selected').unselect()

        if ( node.data('type') == 'role') {
          let elems = node.connectedNodes()
          this.cy.fit(elems)
          node.select();
          elems.select();
        } else {
          this.centerOnPosition(node.position('x'), node.position('y'), zoom)
          node.select()
        }
      }
    })
  }
}