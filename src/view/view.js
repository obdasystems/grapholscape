import GscapeDiagramSelector from './widgets/gscape-diagram-selector'
import GscapeExplorer from './widgets/gscape-explorer'
import GscapeEntityDetails from './widgets/gscape-entity-details'
import GscapeButton from './widgets/common/gscape-button'
import GscapeFilters from './widgets/gscape-filters'
import GscapeOntologyInfo from './widgets/gscape-ontology-info'
import GscapeOwlTranslator from './widgets/gscape-owl-translator'
import GscapeZoomTools from './widgets/gscape-zoom-tools'
import GrapholscapeRenderer from './render/default-renderer'
import LiteGscapeRenderer from './render/lite-renderer'
import * as themes from './style/themes'
import FloatingGscapeRenderer from './render/float-renderer'
import GscapeRenderSelector from './widgets/gscape-render-selector'
import GscapeLayoutSettings from './widgets/gscape-layout-settings'
import GscapeSettings from './widgets/gscape-settings'
import GscapeSpinner from  './widgets/common/spinner'
import GscapeDialog from './widgets/common/dialog'

export default class GrapholscapeView {
  constructor (container) {
    this.container = container
    this.graph_container = document.createElement('div')
    this.graph_container.style.width = '100%'
    this.graph_container.style.height = '100%'
    this.graph_container.style.position = 'relative'
    this.container.appendChild(this.graph_container)
    this.onEdgeSelection = {}
    this.onNodeSelection = {}
    // this.filters = config.widgets.filters.filter_list

    this.renderers = {
      default : new GrapholscapeRenderer(this.graph_container),
      lite: new LiteGscapeRenderer(this.graph_container),
      float: new FloatingGscapeRenderer(this.graph_container)
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

    this.spinner = new GscapeSpinner()
    this.container.appendChild(this.spinner)

    this.dialog = new GscapeDialog()
    this.container.appendChild(this.dialog)
  }

  createUi(ontology, diagrams, predicates, settings) {
    this.settings = settings
    this.filters = this.settings.widgets.filters.filter_list
    this.widgets = new Map()
    this.diagram_selector = new GscapeDiagramSelector(diagrams)
    this.diagram_selector.onDiagramChange = this.onDiagramChange
    this.widgets.set('diagram_selector', this.diagram_selector)

    this.explorer = new GscapeExplorer(predicates, diagrams)
    this.explorer.onEntitySelect = this.onEntitySelection
    this.explorer.onNodeNavigation = this.onNodeNavigation
    this.widgets.set('explorer', this.explorer)

    this.entity_details = new GscapeEntityDetails()
    this.widgets.set('details', this.entity_details)

    const btn_fullscreen = new GscapeButton('fullscreen', 'fullscreen_exit')
    btn_fullscreen.style.top = '10px'
    btn_fullscreen.style.right = '10px'
    btn_fullscreen.onClick = this.toggleFullscreen.bind(this)
    this.widgets.set('btn_fullscreen', btn_fullscreen)

    const btn_reset = new GscapeButton('filter_center_focus')
    btn_reset.style.bottom = '10px'
    btn_reset.style.right = '10px'
    btn_reset.onClick = this.resetView.bind(this)
    this.widgets.set('btn_reset', btn_reset)

    this.filters_widget = new GscapeFilters(this.filters)
    this.filters_widget.onFilterOn = this.filter.bind(this)
    this.filters_widget.onFilterOff = this.unfilter.bind(this)
    this.widgets.set('filters', this.filters_widget)

    this.ontology_info = new GscapeOntologyInfo(ontology)
    this.widgets.set('ontology_info', this.ontology_info)

    this.owl_translator = new GscapeOwlTranslator()
    this.widgets.set('owl_translator', this.owl_translator)


    const zoom_widget = new GscapeZoomTools()
    zoom_widget.onZoomIn = this.zoomIn.bind(this)
    zoom_widget.onZoomOut = this.zoomOut.bind(this)
    this.widgets.set('zoom_widget', zoom_widget)

    this.renderer_selector = new GscapeRenderSelector(this.renderers)
    this.renderer_selector.onRendererChange = this.changeRenderingMode.bind(this)
    this.widgets.set('simplifications', this.renderer_selector)

    this.layout_settings = new GscapeLayoutSettings()
    this.layout_settings.onLayoutRunToggle =
      () => this.renderer.layoutStopped = !this.renderer.layoutStopped

    this.layout_settings.onDragAndPinToggle =
      () => this.renderer.dragAndPin = !this.renderer.dragAndPin
    this.layout_settings.hide()
    this.widgets.set('layout_settings', this.layout_settings)

    // settings
    this.settings_widget = new GscapeSettings(this.settings)
    this.settings_widget.onEntityNameSelection = this.onEntityNameTypeChange.bind(this)
    this.settings_widget.onLanguageSelection = this.onLanguageChange.bind(this)
    this.settings_widget.onThemeSelection = this.onThemeSelection.bind(this)
    this.settings_widget.onWidgetEnabled = this.onWidgetEnabled.bind(this)
    this.settings_widget.onWidgetDisabled = this.onWidgetDisabled.bind(this)
    this.widgets.set('settings_widget', this.settings_widget)

    Object.keys(this.renderers).forEach(renderer =>
      this.registerEvents(this.renderers[renderer])
    )

    // disable widget that are disabled in settings
    for (let widget_name in this.settings.widgets) {
      if (!this.settings.widgets[widget_name].enabled)
        this.onWidgetDisabled(widget_name)
    }

    this.widgets.forEach( (widget, key) => {
      this.container.appendChild(widget)
      switch (key) {
        case 'filters':
        case 'ontology_info':
        case 'settings_widget':
        case 'simplifications':
          widget.onToggleBody = () => this.blurAll(widget)
          break

        case 'default':
          break
      }
    })

    if(this.settings.rendering.theme.selected != 'custom')
      this.setTheme(themes[this.settings.rendering.theme.selected])
  }

  registerEvents(renderer) {
    renderer.onEdgeSelection = this.onEdgeSelection
    renderer.onNodeSelection = this.onNodeSelection
    renderer.onBackgroundClick = this.blurAll.bind(this)
  }

  drawDiagram(diagramViewData) {
    this.diagram_selector.actual_diagram_id = diagramViewData.id
    this.renderer.drawDiagram(diagramViewData)

    // check if any filter is active and if yes, apply them
    if ( this.filters.all.active ) {
      this.filter('all')
    } else {
      this.applyActiveFilters()
    }
  }

  applyActiveFilters() {
    Object.keys(this.filters).map(key => {
      if (this.filters[key].active)
        this.renderer.filter(this.filters[key])
    })
  }

  filter(type) {
    this.filters[type].active = true
    this.onFilterToggle(type)
  }

  unfilter(type) {
    this.filters[type].active = false
    this.onFilterToggle(type)
  }

  onFilterToggle(type) {
    if (type == 'attributes') {
      this.filters.value_domain.disabled = this.filters.attributes.active
    }

    // if 'all' is toggled, it affect all other filters
    if (type == 'all') {
      Object.keys(this.filters).map(key => {
        if ( key != 'all' && !this.filters[key].disbaled) {
          this.filters[key].active = this.filters.all.active

          /**
           * if the actual filter is value-domain it means it's not disabled (see previous if condition)
           * but when filter all is active, filter value-domain must be disabled, let's disable it
           */
          if (key == 'value_domain')
            this.filters[key].disabled = this.filters.all.active

          this.executeFilter(key)
        }
      })
    } else if (!this.filters[type].active && this.filters.all.active) {
      // if one filter get deactivated while the 'all' filter is active
      // then make the 'all' toggle deactivated
      this.filters.all.active = false
    }

    /**
     * force the value_domain filter to stay disabled
     * (activating the attributes filter may able the value_domain filter
     *  which must stay always disabled in simplified visualization)
     */
    if (this.renderer_selector.actual_mode !== 'default') {
      this.filters.value_domain.disabled = true
    }

    this.executeFilter(type)
    this.widgets.get('filters').updateTogglesState()
  }

  executeFilter(type) {
    if (this.filters[type].active) {
      this.renderer.filter(this.filters[type])
    } else {
      this.renderer.unfilter(this.filters[type])
      // Re-Apply other active filters to resolve ambiguity
      this.applyActiveFilters()
    }
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
    if (this.renderer_selector.actual_mode == 'default') {
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
    for (name in this.renderers) {
      if (this.renderers[name])
        this.renderers[name].unmount()
    }

    renderer.mount(this.graph_container)
    this.renderer = renderer
  }

  changeRenderingMode(mode, remember_position = true) {

    let actual_position = this.renderer.getActualPosition()
    let old_renderer = this.renderer
    this.setRenderer(this.renderers[mode])

    switch (mode) {
      case 'float':
      case 'lite': {
        Object.keys(this.filters).map(key => {
          if (key != 'all' &&
              key != 'attributes' &&
              key != 'individuals') {
            // disable all unnecessary filters
            this.filters[key].disabled = true
          }
        })
        break
      }
      case 'default': {
        Object.keys(this.filters).map(key => {
          if (key != 'all' &&
              key != 'attributes' &&
              key != 'individuals') {

            // enable filters that may have been disabled by lite mode
            this.filters[key].disabled = false

            if (key == 'value_domain' && this.filters.attributes.active)
              this.filters.value_domain.disabled = true
          }
        })
        break
      }
    }

    this.onRenderingModeChange(mode, actual_position)

    if (mode == 'float') {
      this.layout_settings.show()
    } else {
      if (old_renderer == this.renderers.float) {
        /**when coming from float mode, always ignore actual position
         * ---
         * WHY TIMEOUT?
         * versions >3.2.22 of cytoscape.js apparently have glitches
         * in large graphs in floaty mode.
         * In cytoscape 3.2.22 mount and unmount are not available so the
         * mount and unmount for grapholscape renderers are based on style.display.
         * This means that at this time, cytoscape inner container has zero
         * for width and height and this prevent it to perform the fit().
         * After awhile dimensions get a value and the fit() works again.
         * */
        setTimeout(() => this.resetView(), 200)
        //this.resetView()
      }
      this.layout_settings.hide()
    }
    this.filters_widget.requestUpdate()
    this.blurAll()
  }

  setViewPort(state) {
    this.renderer.centerOnRenderedPosition(state.x, state.y, state.zoom)
  }

  updateEntitiesList(entitiesViewData) {
    this.explorer.predicates = entitiesViewData
    this.explorer.requestUpdate()
  }

  onThemeSelection(theme_name) {
    theme_name == 'custom' ? this.setTheme(this.custom_theme) : this.setTheme(themes[theme_name])
  }

  setTheme(theme) {
    // update theme with custom variables "--theme-gscape-[var]" values
    let theme_aux = {}

    let prefix = '--theme-gscape-'
    Object.keys(theme).map(key => {
      let css_key = prefix + key.replace(/_/g,'-')
      // normalize theme using plain strings
      let color = typeof theme[key] == 'string' ? theme[key] : theme[key].cssText
      this.container.style.setProperty(css_key, color)
      theme_aux[key] = color
    })

    this.graph_container.style.background = theme.background
    // Apply theme to graph
    Object.keys(this.renderers).map(key => {
      this.renderers[key].setTheme(theme_aux)
    });
  }

  setCustomTheme(new_theme) {
    this.custom_theme = JSON.parse(JSON.stringify(themes.gscape))
    Object.keys(new_theme).forEach( color => {
      if (this.custom_theme[color]) {
        this.custom_theme[color] = new_theme[color]
      }
    })
    this.setTheme(this.custom_theme)
  }

  onWidgetEnabled(widget_name) {
    this.widgets.get(widget_name).enable()
  }

  onWidgetDisabled(widget_name) {
    this.widgets.get(widget_name).disable()
  }

  get actual_diagram_id() {
    return this.diagram_selector.actual_diagram_id
  }

  showDialog(type, message) {
    this.dialog.show(type, message)
  }

  set onWikiClick(callback) {
    this.entity_details.onWikiClick = callback
  }
}