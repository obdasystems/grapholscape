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
        return edge.hasClass('role') ? 300 : 150
      },
      infinite: true,
    })

    

    layout.run()
  }
}