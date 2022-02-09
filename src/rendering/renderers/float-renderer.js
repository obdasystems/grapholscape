import { lock_open } from '../../ui/assets/icons'
import GrapholscapeRenderer from './default-renderer'

export default class FloatyGscapeRenderer extends GrapholscapeRenderer {
  constructor(container) {
    super(container)

    this.layoutStopped = false
    this.dragAndPin = false
    this.useOriginalPositions = false

    this.popperContainers = []
  }

  setCySettings() {
    this.cy.style.textureOnViewport = true

    this.cy.autoungrabify(false)

    this.cy.on('grab', (e) => {
      e.target.data('old_pos', JSON.stringify(e.target.position()))
    })

    this.cy.on('free', (e) => {
      let actual_pos = JSON.stringify(e.target.position())
      if (this.dragAndPin && e.target.data('old_pos') !== actual_pos) {
        this.pinNode(e.target)
      }

      e.target.removeData('old_pos')
    })

    this.cy.$('[?pinned]').each( n => {
      n.on('position', () => this.updatePopper(n))
      this.cy.on('pan zoom resize', () => this.updatePopper(n))
    })
  }

  addPopperContainer() {
    const popperContainer = document.createElement('div')
    popperContainer.setAttribute('id', this.actual_diagram)
    this.popperContainers[this.actual_diagram] = popperContainer
  }

  /** @param {import('../../model/index').Diagram} diagram*/
  drawDiagram(diagram) {
    super.drawDiagram(diagram)
   
    this.setCySettings()
    /**
     * At each diagram change, cy instance changes and everything
     * inside cy.container() is overwritten by cytoscape with 
     * the cy instance own container, inside this container we add 
     * the popper container related to the new diagram as the one
     * related to the previous diagram has been deleted.
     */
    this.cy.container().appendChild(this.popperContainer)

    this.cy.nodes().addClass('float')

    this.cy.$('[!pinned]').unlock()
    this.main_layout.removeAllListeners()

    if (this.useOriginalPositions) {
      this.activateOriginalPositions()
    } else {
      this.main_layout = this.layout() // apply layout on those not locked
      this.main_layout.run()
    }

    /**
     * hack: let layout run a bit and fit to it.
     * Prevent some diagrams to disappear from screen due to
     * automatic layout.
     */
    //setTimeout(() => this.cy.fit(), 100)
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
          setTimeout( () => this.centerOnModelPosition(node.position('x'), node.position('y'), zoom), 300)
          node.select()
        }
      }
  }

  layout(selector = '*') {
    return this.cy.$(selector).layout(this.layout_settings)
  }

  unpinNode(node) {
    this.removeUnlockButton(node)
    node.unlock()
    node.data("pinned", false)
  }

  pinNode(node) {
    node.lock()
    node.data("pinned", true)

    node.unlockButton = node.popper({
      content: () => {
        let dimension =  node.data('width') / 9 * this.cy.zoom()
        let div = document.createElement('div')
        div.style.background = node.style('border-color')
        div.style.borderRadius = '100%'
        div.style.padding = '5px'
        div.style.color = this.theme.on_secondary
        div.style.cursor = 'pointer'
        div.style.boxSizing = 'content-box'
        div.setAttribute('title', 'Unlock Node')

        div.innerHTML = `<span class="popper-icon">${lock_open}</span>`
        this.setPopperStyle(dimension, div)

        div.onclick = () => this.unpinNode(node)
        this.popperContainer.appendChild(div)

        return div
      },
    })

    node.on('position', () => this.updatePopper(node))
    this.cy.on('pan zoom resize', () => this.updatePopper(node))
  }

  updatePopper(node) {
    if (!node.unlockButton) return

    
    let unlockButton = node.unlockButton
    let dimension =  node.data('width') / 9 * this.cy.zoom()
    this.setPopperStyle(dimension, unlockButton.state.elements.popper)
    unlockButton.update()
  }

  setPopperStyle(dim, popper) {
    let icon = popper.querySelector('.popper-icon > svg')
    icon.style.display = 'inherit'
    if (dim > 2) {
      popper.style.width = dim + 'px'
      popper.style.height = dim + 'px'
      popper.style.display = 'flex'
      if (dim > 8) {
        icon.setAttribute('width', dim+'px')
        icon.setAttribute('height', dim+'px')
      } else if (dim - 10 > 0 ) {
        icon.setAttribute('width', (dim - 10)+'px')
        icon.setAttribute('height', (dim - 10)+'px')
      } else {
        icon.style.display = 'none'
      }
    } else {
      icon.style.display = 'none'
      popper.style.display = 'none'
    }
  }

  clearPoppers() {
    this.cy.nodes().each(node => this.removeUnlockButton(node))
  }

  unmount() {
    super.unmount()
  }

  removeUnlockButton(node) {
    if (node.unlockButton) {
      node.unlockButton.state.elements.popper.remove()
      node.unlockButton.destroy()
      node.unlockButton = null
    }
  }

  /**
   * Create a new layout with default edgeLength and allowing overlapping
   * Put concepts (not already pinned) in their original position and lock them
   * Run the new layout to place hierarchies nodes and attributes
   */
  activateOriginalPositions() {
    let layout_options = this.layout_settings
    // customize options
    delete layout_options.edgeLength
    layout_options.avoidOverlap = false
    delete layout_options.convergenceThreshold
    this.main_layout = this.cy.$('*').layout(layout_options)

    this.cy.$('.concept').forEach( node => {
      if (!node.data('pinned')) {
        node.position(JSON.parse(node.data('original-position')))
        node.lock()
      }
    })

    this.main_layout.run()
    /**
     * when the layout finishes placing attributes and hierarchy nodes, unlock all
     * nodes not already pinned somewhere
     */
    this.main_layout.on("layoutstop", () => this.cy.$('[!pinned]').unlock())
  }

  disableOriginalPositions() {
    this.cy.$('[type = "concept"][!pinned]').unlock()
    this.main_layout = this.layout()
  }
  
  get disabledFilters() { return ["not", "universal_quantifier", "value_domain", "key"] }

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
    if (!active) this.cy.$('[?pinned]').each(node => this.unpinNode(node))
  }

  get dragAndPin() { return this._dragAndPin }

  /**
   * lock concept(classes) nodes in their original positions
   */
  set useOriginalPositions(active) {
    this._useOriginalPoisions = active

    active ? this.activateOriginalPositions() : this.disableOriginalPositions()
  }

  get useOriginalPositions() { return this._useOriginalPoisions }

  set main_layout(new_layout) {
    this._main_layout?.stop()
    this._main_layout = new_layout
  }

  get main_layout() { return this._main_layout }

  /** 
   * Each diagram must have its own poppers in its own
   * popper container, if it's the first time we draw
   * a diagram we will create the popper container with
   * addPopperContainer() 
   * @returns {HTMLDivElement} 
   */
  get popperContainer() { 
    if (!this.popperContainers[this.actual_diagram])
      this.addPopperContainer()

    return this.popperContainers[this.actual_diagram]
  }
}