import GrapholscapeRenderer from './default-renderer'
import cola from 'cytoscape-cola'
import cytoscape from 'cytoscape'

export default class FloatingGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container)
    cytoscape.use(cola)

    this.cy.autoungrabify(false)

    this.layoutStopped = false
    this.dragAndPin = false

    this.cy.on('free', (e) => {
      if (this.dragAndPin) e.target.lock()
    })
  }

  drawDiagram(diagram) {
    super.drawDiagram(diagram)
    this.main_layout = this.layout() // apply layout on those not locked
    this.main_layout.run()
  }

  centerOnNode(node_id, zoom) {
      let node = this.cy.$id(node_id)
      if (node) {
        this.cy.$(':selected').unselect()

        if ( node.data('type') == 'role') {
          let elems = node.connectedNodes()
          setTimeout( () => this.cy.fit(elems), 300)
          node.select();
          elems.select();
        } else {
          setTimeout( () => this.centerOnPosition(node.position('x'), node.position('y'), zoom), 300)
          node.select()
        }
      }
  }

  layout(selector = ':unlocked') {
    return this.cy.$(selector).layout(this.layout_settings)
  }

  get layout_settings() {
    return {
      name: 'cola',
      avoidOverlap: true,
      edgeLength: function(edge) {
        if (edge.hasClass('role')) {
          return 300 + edge.data('label').length * 4
        }
        else if (edge.target().data('type') == 'attribute' ||
                 edge.source().data('type') == 'attribute' )
          return 150
        else
          return 250
      },
      fit : false,
      infinite: !this.layoutStopped,
      handleDisconnected: true, // if true, avoids disconnected components from overlapping
      convergenceThreshold: 0.000000001
    }
  }

  set layoutStopped(isStopped) {
    this._layoutStopped = isStopped

    if(this.main_layout) {
      this.main_layout.options.infinite = !isStopped
      isStopped ? this.main_layout.stop() : this.main_layout.run()
    }
  }

  get layoutStopped() { return this._layoutStopped}

  set dragAndPin(active) {
    this._dragAndPin = active
    if (!active) this.cy.$(':locked').unlock()
  }

  get dragAndPin() { return this._dragAndPin }
}