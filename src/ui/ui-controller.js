/**
 * DRAFT - To be refactored
 */

import GscapeDiagramSelector from './widgets/gscape-diagram-selector'
import GscapeExplorer from './widgets/gscape-explorer';
import GscapeEntityDetails from './widgets/gscape-entity-details';
import GscapeButton from './widgets/common/gscape-button';
import GscapeFilters from './widgets/gscape-filters';
import GscapeOntologyInfo from './widgets/gscape-ontology-info';
import GscapeOwlTranslator from './widgets/gscape-owl-translator';
import GscapeZoomTools from './widgets/gscape-zoom-tools';

export default class GrapholscapeUiController {
  constructor (renderer, options) {
    this.renderer = renderer
    this.options = options || null
  }

  createUi() {
    this.widgets = new Set()

    this.diagram_selector = new GscapeDiagramSelector(this.renderer.ontology.diagrams)
    this.diagram_selector.onDiagramChange = this.renderer.drawDiagram.bind(this.renderer)
    this.renderer.container.appendChild(this.diagram_selector)
    this.widgets.add(this.diagram_selector)

    const explorer = new GscapeExplorer(this.renderer.ontology.getPredicates(), this.renderer.ontology.diagrams)
    explorer.onEntitySelect = this.showDetails.bind(this)
    explorer.onNodeSelect = this.renderer.centerOnNode.bind(this.renderer)
    this.renderer.container.appendChild(explorer)
    this.widgets.add(explorer)

    this.entity_details = new GscapeEntityDetails()
    this.renderer.container.appendChild(this.entity_details)
    this.widgets.add(this.entity_details)

    const btn_fullscreen = new GscapeButton('fullscreen', 'fullscreen_exit')
    btn_fullscreen.style.top = '10px'
    btn_fullscreen.style.right = '10px'
    btn_fullscreen.onClick = this.toggleFullscreen.bind(this)
    this.renderer.container.appendChild(btn_fullscreen)
    this.widgets.add(btn_fullscreen)

    const btn_reset = new GscapeButton('filter_center_focus')
    btn_reset.style.bottom = '10px'
    btn_reset.style.right = '10px'
    btn_reset.onClick = this.renderer.resetView.bind(this.renderer)
    this.renderer.container.appendChild(btn_reset)
    this.widgets.add(btn_reset)

    this.filters_widget = new GscapeFilters(this.renderer.filters)
    this.filters_widget.onFilterOn = this.renderer.filter.bind(this.renderer)
    this.filters_widget.onFilterOff = this.renderer.unfilter.bind(this.renderer)
    this.filters_widget.btn.onClick = () => {
      this.blurAll(this.filters_widget)
      this.filters_widget.toggleBody()
    }
    this.renderer.container.appendChild(this.filters_widget)
    this.widgets.add(this.filters_widget)

    this.ontology_info = new GscapeOntologyInfo(this.renderer.ontology)
    this.ontology_info.btn.onClick = () => {
      this.blurAll(this.ontology_info)
      this.ontology_info.toggleBody()
    }
    this.renderer.container.appendChild(this.ontology_info)
    this.widgets.add(this.ontology_info)

    this.owl_translator = new GscapeOwlTranslator()
    this.renderer.container.appendChild(this.owl_translator)
    this.widgets.add(this.owl_translator)


    const zoom_widget = new GscapeZoomTools()
    zoom_widget.onZoomIn = this.renderer.zoomIn.bind(this.renderer)
    zoom_widget.onZoomOut = this.renderer.zoomOut.bind(this.renderer)
    this.renderer.container.appendChild(zoom_widget)
    this.widgets.add(zoom_widget)
  }

  showDetails (target, unselect = false) {
    this.entity_details.entity = target.json()
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

  toggleFullscreen (button, x, y, event) {
    var c = this.renderer.container
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
}