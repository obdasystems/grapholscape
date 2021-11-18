/**
 * @typedef {import('./renderers').GrapholscapeRenderer} GrapholscapeRenderer
 * @typedef {import('cytoscape').CollectionReturnValue} CollectionReturnValue
 */
import Diagram from "../model/diagram"

export default class RendererManager {
  constructor() {

    this.renderers = {}
    /** @type {GrapholscapeRenderer} */
    this.renderer = null
    /** @type {HTMLElement} */
    this.container = null
    /** @type {HTMLDivElement} */
    this.graphContainer = document.createElement('div')

    this.graphContainer.style.width = '100%'
    this.graphContainer.style.height = '100%'
    this.graphContainer.style.position = 'relative'

    this._onEdgeSelection = () => { }
    this._onNodeSelection = () => { }
    this._onBackgroundClick = () => { }

    this.actualDiagramID = undefined
  }

  setRenderer(rendererKey) {
    if (!this.renderers[rendererKey]) {
      console.warn(`renderer [${rendererKey}] not existing`)
      return
    }
    for (let key in this.renderers) {
      if (key != rendererKey)
        this.renderers[key].unmount()
    }

    let viewportState = this.actualViewportState

    this.renderer = this.renderers[rendererKey]
    this.renderer.setContainer(this.graphContainer)
  }

  /**
   * Register a new renderer in the renderers list
   * @param {string} key id of the renderer
   * @param {string} label name of the renderer
   * @param {GrapholscapeRenderer} renderer an object of the Class `GrapholscapeRenderer`
   */
  addRenderer(key, label, renderer) {
    if (this.renderers[key]) console.warn(`Renderer ${key} overwritten`)

    renderer.setContainer(this.graphContainer)
    renderer.onNodeSelection = this._onNodeSelection
    renderer.onEdgeSelection = this._onEdgeSelection
    renderer.onBackgroundClick = this._onBackgroundClick
    renderer.label = label
    renderer.key = key
    this.renderers[key] = renderer
  }

  /**
   * 
   * @param {Diagram} diagram The diagram to display
   * @param {boolean} shouldViewportFit whether to fit viewport to diagram or not
   */
  drawDiagram(diagram, shouldViewportFit) {
    //let diagramView = diagramModelToViewData(diagram)
    this.renderer.drawDiagram(diagram)
    if (shouldViewportFit) this.renderer.fitToDiagram()
    this.actualDiagramID = diagram.id
    diagram.hasEverBeenRendered = true
  }

  /** @param {import('./renderers/default-renderer').ViewportState} state*/
  setViewport(state) {
    if (state) this.renderer.centerOnRenderedPosition(state.x, state.y, state.zoom)
  }

  /**
   * Center the view port on a node given its ID and zoom on it
   * @param {number} nodeID
   * @param {number?} zoom level of zoom
   */
  centerOnNode(nodeID, zoom) {
    this.renderer.centerOnNode(nodeID, zoom)
  }

  /**
   * Set the container
   * @param {HTMLElement} container the container in which the renderer will draw the graph
   */
  setContainer(container) {
    if (this.container)
      this.container.remove()

    this.container = container
    this.container.style.overflow = 'hidden'
    this.container.appendChild(this.graphContainer)
  }

  /** @param {number} zoomValue */
  zoomIn(zoomValue) {
    this.renderer.zoomIn(zoomValue)
  }

  /** @param {number} zoomValue */
  zoomOut(zoomValue) {
    this.renderer.zoomOut(zoomValue)
  }

  /** @param {import("../grapholscape").Filter} filterObj*/
  filter(filterObj) {
    this.renderer.filter(filterObj)
  }

  /** @param {import("../grapholscape").Filter} filterObj*/
  unfilter(filterObj) {
    this.renderer.unfilter(filterObj)
  }

  /** @param {import("../style/themes-controller").Theme} theme */
  setTheme(theme) {
    // Apply theme to graph
    for (let name in this.renderers) {
      this.renderers[name].setTheme(theme)
    }
  }

  /**
   * 
   * @param {string} actualEntityNameType 
   * @param {import('../grapholscape').Languages} languages 
   */
  updateDisplayedNames(actualEntityNameType, languages) {
    this.renderer.cy.$('.predicate').forEach(entity => {
      let displayedName = ''
      switch (actualEntityNameType) {
        case 'label': {
          let labels = entity.data('annotations')?.label
          if (labels) {
            let first_label_key = Object.keys(labels)[0]
            displayedName =
              labels[languages.selected] ||
              labels[languages.default] ||
              labels[first_label_key]

            displayedName = displayedName[0]
          } else {
            displayedName = entity.data('iri').remainingChars
          }
          break
        }

        case 'prefixed': {
          displayedName = entity.data('iri').prefixed
          break
        }

        case 'full': {
          displayedName = entity.data('iri').fullIri
          break
        }
      }

      entity.data('displayed_name', displayedName)
    })
  }

  /** @returns {import('./renderers/default-renderer').ViewportState} */
  get actualViewportState() { return this.renderer?.actualViewportState }

  /** @callback backgroundClickCallback */

  /** @param {backgroundClickCallback} callback */
  onBackgroundClick(callback) {
    this._onBackgroundClick = callback
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onBackgroundClick = this._onBackgroundClick
    })
  }

  /**
   * @callback edgeSelectionCallbak
   * @param {CollectionReturnValue} selectedEdge
   */

  /** @param {edgeSelectionCallbak} callback */
  onEdgeSelection(callback) {
    this._onEdgeSelection = callback
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onEdgeSelection = this._onEdgeSelection
    })
  }

  /**
   * @callback nodeSelectionCallbak
   * @param {CollectionReturnValue} selectedNode
   */ 
   
  /** @param {nodeSelectionCallbak} callback */
  onNodeSelection(callback) {
    this._onNodeSelection = callback
    Object.keys(this.renderers).forEach(k => {
      this.renderers[k].onNodeSelection = this._onNodeSelection
    })
  }
}