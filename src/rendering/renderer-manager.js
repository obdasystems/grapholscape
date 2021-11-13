import Diagram from "../model/diagram"
import { diagramModelToViewData, entityModelToViewData } from "../util/model-to-view-data"
import GrapholscapeRenderer from "./renderers/default-renderer"

export default class RendererManager {
  constructor() {

    this.renderers = {}
    /**
     * @type {GrapholscapeRenderer} 
     */
    this.renderer = null
    this.container = null
    this.graphContainer = document.createElement('div')

    this.graphContainer.style.width = '100%'
    this.graphContainer.style.height = '100%'
    this.graphContainer.style.position = 'relative'

    this._onEdgeSelection = () => {}
    this._onNodeSelection = () => {}
    this._onBackgroundClick = () => {}

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

    this.renderers[rendererKey].setContainer(this.graphContainer)
    this.renderer = this.renderers[rendererKey]
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
  
  // getRenderers() { return this.renderers}
  
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
   * 
   * @param {number} nodeID
   * @param {number?} zoom
   */
  centerOnNode(nodeID, zoom) {
    this.renderer.centerOnNode(nodeID, zoom)
  }
  
  /**
   * Set the container
   * @param {Element} container the container in which the renderer will draw the graph
   */
  setContainer(container) {
    if(this.container)
      this.container.remove()
      
    this.container = container
    this.container.style.overflow = 'hidden'
    this.container.appendChild(this.graphContainer)
  }

  zoomIn() {
    this.renderer.zoomIn()
  }

  zoomOut() {
    this.renderer.zoomOut()
  }
  
  filter(filterObj) {
    this.renderer.filter(filterObj)
  }

  unfilter(filterObj) {
    this.renderer.unfilter(filterObj)
  }

  setTheme(theme) {
    // Apply theme to graph
    for (let name in this.renderers) {
      this.renderers[name].setTheme(theme)
    }
  }

  updateDisplayedNames(actualEntityNameType, languages) {
    this.renderer.cy.$('.predicate').forEach( entity => {
      let displayedName = ''
      switch(actualEntityNameType) {
        case 'label' : {
          let first_label_key = Object.keys(entity.data('label'))[0]
          displayedName = 
            entity.data('label')[languages.selected] ||
            entity.data('label')[languages.default] ||
            entity.data('label')[first_label_key]
          break
        }

        case 'prefixed': {
          let iri = entity.data('iri')
          displayedName = iri.prefix + iri.remaining_chars
          break
        }

        case 'full': {
          displayedName = entity.data('iri').full_iri
          break
        }
      }

      entity.data('displayed_name', displayedName)
    })
  }

  get actualViewportState() { return this.renderer?.actualViewportState }

  /**
   * @param {function} callback
   */
  set onBackgroundClick( callback) {
    this._onBackgroundClick = callback
    Object.keys(this.renderers).forEach( k => {
      this.renderers[k].onBackgroundClick = this._onBackgroundClick
    })
  }
    
  /**
   * @param {function} callback
   */
  set onEdgeSelection( callback) {
    this._onEdgeSelection = callback
    Object.keys(this.renderers).forEach( k => {
      this.renderers[k].onEdgeSelection = this._onEdgeSelection
    })
  }

  /**
   * @param {function} callback
   */
  set onNodeSelection( callback) {
    this._onNodeSelection = callback
    Object.keys(this.renderers).forEach( k => {
      this.renderers[k].onNodeSelection = this._onNodeSelection
    })
  }
}