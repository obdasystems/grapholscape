import GrapholscapeRenderer from './default-renderer'
import cola from 'cytoscape-cola'
import popper from 'cytoscape-popper'
import cytoscape from 'cytoscape'

export default class FloatingGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container)
    cytoscape.use(cola)
    cytoscape.use(popper)

    this.cy.style.textureOnViewport = true

    this.cy.autoungrabify(false)

    this.layoutStopped = false
    this.dragAndPin = false

    this.cy.on('free', (e) => {
      if (this.dragAndPin) {
        this.lockNode(e.target)
      }
    })
  }

  drawDiagram(diagram) {
    this.clearPoppers()
    super.drawDiagram(diagram)
    this.cy.nodes().addClass('float')
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

  unlockNode(node) {
    node.unlockButton.destroy()
    node.unlock()
  }

  lockNode(node) {
    node.lock()

    let unlockButton = node.popper({
      content: () => {
        let dimension =  node.data('width') / 9 * this.cy.zoom()
        let div = document.createElement('div')
        div.style.background = node.style('border-color')
        div.style.borderRadius = '100%'
        div.style.padding = '5px'
        div.style.color = 'white'
        div.style.cursor = 'pointer'
        div.setAttribute('title', 'Unlock Node')

        div.innerHTML = `<mwc-icon>lock_open</mwc_icon>`
        setStyle(dimension, div)

        div.onclick = () => this.unlockNode(node)
        document.body.appendChild(div)

        return div
      },
      //popper: {} // my popper options here
    })

    node.unlockButton = unlockButton

    let update = () => {
      let dimension =  node.data('width') / 9 * this.cy.zoom()
      setStyle(dimension, unlockButton.popper)
      unlockButton.scheduleUpdate()
    }

    node.on('position', update)
    this.cy.on('pan zoom resize', update)

    function setStyle(dim, div) {
      let icon = div.querySelector('mwc-icon')
      if (dim > 2) {
        if (dim < 8) {
          icon.style.display = 'none'
        } else {
          icon.style.display = 'inline'
          icon.style.fontSize = dim + 'px'
        }
        div.style.width = dim + 'px'
        div.style.height = dim + 'px'
        div.style.display = 'flex'
      } else {
        icon.style.display = 'none'
        div.style.display = 'none'
      }
    }
  }

  clearPoppers() {
    this.cy.nodes().each(node => {
      if (node.unlockButton) node.unlockButton.destroy()
    })
  }

  unmount() {
    super.unmount()

    this.clearPoppers()
  }

  get layout_settings() {
    return {
      name: 'cola',
      avoidOverlap: true,
      edgeLength: function(edge) {
        if (edge.hasClass('role')) {
          return 300 + edge.data('displayed_name').length * 4
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
    if (!active) this.cy.$(':locked').each(node => this.unlockNode(node))
  }

  get dragAndPin() { return this._dragAndPin }
}