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
      randomize:false,
      fit: false,
      refresh:3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001
    })
    layout.run()
  }
}