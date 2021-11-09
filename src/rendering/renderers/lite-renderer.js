import GrapholscapeRenderer from './default-renderer'

export default class LiteGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container)
  }

  drawDiagram(diagram) {
    super.drawDiagram(diagram)
    this.cy.autoungrabify(false)
    this.cy.nodes().lock()
    this.cy.nodes('.repositioned').unlock()

    let layout = this.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
      name: 'cola',
      randomize:false,
      fit: false,
      refresh:3,
      maxSimulationTime: 8000,
      convergenceThreshold: 0.0000001
    })
    layout.run()
  }

  get disabledFilters() { return ["not", "universal_quantifier", "value_domain"] }
}