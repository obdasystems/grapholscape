import GscapeDiagramSelector from './widgets/gscape-diagram-selector'
import GscapeExplorer from './widgets/gscape-explorer'
import GscapeEntityDetails from './widgets/gscape-entity-details'
import GscapeButton from './widgets/common/gscape-button'
import GscapeFilters from './widgets/gscape-filters'
import GscapeOntologyInfo from './widgets/gscape-ontology-info'
import GscapeOwlTranslator from './widgets/gscape-owl-translator'
import GscapeZoomTools from './widgets/gscape-zoom-tools'
import GrapholscapeRenderer from './render/grapholscape_renderer'
import EasyGscapeRenderer from './render/easy-gscape-renderer'
import * as themes from './style/themes'

export default class GrapholscapeView {
  constructor (container) {
    this.container = container
    this.renderer = new GrapholscapeRenderer(container)

    this.container.requestFullscreen =
    this.container.requestFullscreen ||
    this.container.mozRequestFullscreen || // Mozilla
    this.container.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
    this.container.webkitRequestFullscreen || // Webkit
    this.container.msRequestFullscreen // IE

    document.cancelFullscreen =
    document.exitFullscreen ||
    document.cancelFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitCancelFullScreen ||
    document.msExitFullscreen

    this.setTheme(themes.gscape)
  }


  createUi(ontology, diagrams, predicates) {
    this.widgets = new Set()

    this.diagram_selector = new GscapeDiagramSelector(diagrams)
    this.diagram_selector.onDiagramChange = this.onDiagramChange
    this.container.appendChild(this.diagram_selector)
    this.widgets.add(this.diagram_selector)

    const explorer = new GscapeExplorer(predicates, diagrams)
    explorer.onEntitySelect = this.onEntitySelection
    explorer.onNodeNavigation = this.onNodeNavigation
    this.container.appendChild(explorer)
    this.widgets.add(explorer)

    this.entity_details = new GscapeEntityDetails()
    this.container.appendChild(this.entity_details)
    this.widgets.add(this.entity_details)

    const btn_fullscreen = new GscapeButton('fullscreen', 'fullscreen_exit')
    btn_fullscreen.style.top = '10px'
    btn_fullscreen.style.right = '10px'
    btn_fullscreen.onClick = this.toggleFullscreen.bind(this)
    this.container.appendChild(btn_fullscreen)
    this.widgets.add(btn_fullscreen)
    
    const btn_reset = new GscapeButton('filter_center_focus')
    btn_reset.style.bottom = '10px'
    btn_reset.style.right = '10px'
    btn_reset.onClick = this.renderer.resetView.bind(this.renderer)
    this.container.appendChild(btn_reset)
    this.widgets.add(btn_reset)

    this.filters_widget = new GscapeFilters(this.renderer.filters)
    this.filters_widget.onFilterOn = this.renderer.filter.bind(this.renderer)
    this.filters_widget.onFilterOff = this.renderer.unfilter.bind(this.renderer)
    this.filters_widget.btn.onClick = () => {
      this.blurAll(this.filters_widget)
      this.filters_widget.toggleBody()
    }
    this.container.appendChild(this.filters_widget)
    this.widgets.add(this.filters_widget)

    this.ontology_info = new GscapeOntologyInfo(ontology)
    this.ontology_info.btn.onClick = () => {
      this.blurAll(this.ontology_info)
      this.ontology_info.toggleBody()
    }
    this.container.appendChild(this.ontology_info)
    this.widgets.add(this.ontology_info)

    this.owl_translator = new GscapeOwlTranslator()
    this.container.appendChild(this.owl_translator)
    this.widgets.add(this.owl_translator)


    const zoom_widget = new GscapeZoomTools()
    zoom_widget.onZoomIn = this.renderer.zoomIn.bind(this.renderer)
    zoom_widget.onZoomOut = this.renderer.zoomOut.bind(this.renderer)
    this.container.appendChild(zoom_widget)
    this.widgets.add(zoom_widget)

    this.renderer.onEdgeSelection = this.onEdgeSelection
    this.renderer.onNodeSelection = this.onNodeSelection
    this.renderer.onBackgroundClick = this.blurAll.bind(this)
  }

  drawDiagram(diagramViewData) {
    this.diagram_selector.actual_diagram_id = diagramViewData.id
    this.renderer.drawDiagram(diagramViewData)
  }

  centerOnNode(nodeViewData, zoom) {
    this.renderer.centerOnNode(nodeViewData.id, zoom)
  }

  showDetails(entityViewData, unselect = false) {
    this.entity_details.entity = entityViewData
    this.entity_details.show()
  
    if (unselect)
      this.renderer.cy.$(':selected').unselect()
  }

  hideDetails() {
    this.entity_details.hide()
  }

  showOwlTranslation(text) {
    this.owl_translator.owl_text = text
    this.owl_translator.show()
  }

  hideOwlTranslation() {
    this.owl_translator.hide()
  }

  toggleFullscreen () {
    var c = this.container
    if (this.isFullscreen()) {
      document.cancelFullscreen()
    } else {
      c.requestFullscreen()
    }
  }

  isFullscreen () {
    return document.fullScreenElement ||
      document.mozFullScreenElement || // Mozilla
      document.webkitFullscreenElement || // Webkit
      document.msFullscreenElement // IE
  }

  blurAll(widgtet_to_skip) {
    this.widgets.forEach(widget => {
      if (!Object.is(widget,widgtet_to_skip))
        widget.blur()
    })
  }

  createRenderer(type) {
    switch(type) {
      case 'default' :
        return new GrapholscapeRenderer(this.container, this.gscape_instance.ontology, this)
      case 'easy' :
        return new EasyGscapeRenderer(this.container, this.gscape_instance.ontology, this)
    }
  }
  
  setTheme(theme) {
    this.renderer.setTheme(theme)

    let prefix = '--theme-gscape-'
    Object.keys(theme).map(key => {
      let css_key = prefix + key.replace(/_/g,'-')
      this.container.style.setProperty(css_key, theme[key]) 
    })
  }
}