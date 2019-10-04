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
import * as config from '../config.json'

export default class GrapholscapeView {
  constructor (container) {
    this.container = container
    this.graph_container = document.createElement('div')
    this.container.appendChild(this.graph_container)
    this.onEdgeSelection = {}
    this.onNodeSelection = {}

    this.renderers = {
      default : new GrapholscapeRenderer(),
      lite: new EasyGscapeRenderer()
    }

    this.setRenderer(this.renderers.default)

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

    this.setTheme(this.getDefaultTheme())
  }

  createUi(ontology, diagrams, predicates) {
    console.log(this.renderers.default)
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
    btn_reset.onClick = this.resetView.bind(this)
    this.container.appendChild(btn_reset)
    this.widgets.add(btn_reset)

    this.filters_widget = new GscapeFilters(this.renderer.filters)
    this.filters_widget.onFilterOn = this.filter.bind(this)
    this.filters_widget.onFilterOff = this.unfilter.bind(this)
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
    zoom_widget.onZoomIn = this.zoomIn.bind(this)
    zoom_widget.onZoomOut = this.zoomOut.bind(this)
    this.container.appendChild(zoom_widget)
    this.widgets.add(zoom_widget)

    this.btn_lite_mode = new GscapeButton('flash_on', 'flash_off')
    this.btn_lite_mode.onClick = this.toggleLiteMode.bind(this)
    this.btn_lite_mode.highlight = true
    this.btn_lite_mode.style.bottom = '10px'
    this.btn_lite_mode.style.left = '94px'
    this.container.appendChild(this.btn_lite_mode)
    this.widgets.add(this.btn_lite_mode)

    this.registerEvents(this.renderers.default)
    this.registerEvents(this.renderers.lite)
  }

  registerEvents(renderer) {
    renderer.onEdgeSelection = this.onEdgeSelection
    renderer.onNodeSelection = this.onNodeSelection
    renderer.onBackgroundClick = this.blurAll.bind(this)
  }

  drawDiagram(diagramViewData) {
    this.diagram_selector.actual_diagram_id = diagramViewData.id
    this.renderer.drawDiagram(diagramViewData)
  }

  filter(filter_properties) {
    this.renderer.filter(filter_properties)
  }

  unfilter(filter_properties) {
    this.renderer.unfilter(filter_properties)
  }

  zoomIn() {
    this.renderer.zoomIn()
  }

  zoomOut() {
    this.renderer.zoomOut()
  }

  resetView() {
    this.renderer.resetView()
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
    if (!this.btn_lite_mode.active) {
      this.owl_translator.owl_text = text
      this.owl_translator.show()
    }
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

  setRenderer(renderer) {    
    if (this.renderer)
      this.renderer.unmount()

    renderer.mount(this.graph_container)
    this.renderer = renderer
  }

  toggleLiteMode() {
    if (this.renderer instanceof EasyGscapeRenderer) {
      this.setRenderer(this.renderers.default)
    } else {
      this.setRenderer(this.renderers.lite)
    }

    this.onDiagramChange(this.diagram_selector.actual_diagram_id)
  }
  
  setTheme(theme) {
    // Apply theme to graph
    Object.keys(this.renderers).map(key => {
      this.renderers[key].setTheme(theme)
    });

    // Apply theme to UI
    let prefix = '--theme-gscape-'
    Object.keys(theme).map(key => {
      let css_key = prefix + key.replace(/_/g,'-')
      this.container.style.setProperty(css_key, theme[key]) 
    })
  }

  getDefaultTheme() {
    Object.keys(themes).forEach(key => {
      if (config.rendering.theme.list[key].default)
        return themes[key]
    })

    return themes.gscape
  }
}