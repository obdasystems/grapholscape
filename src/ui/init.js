import { default as diagramSelectorComponent, initDiagramSelector } from "./diagram-selector";
import { default as entityDetailsComponent, initEntityDetails } from "./entity-details";
import { default as filterComponent, initFilters } from "./filters";
import { default as layoutSettingsComponent, initLayoutSettings } from "./floaty-layout-settings";
import { default as fullscreenComponent, initFullscreenButton } from "./fullscreen";
import { default as ontologyExplorerComponent, initOntologyExplorer } from "./ontology-explorer";
import { default as ontologyInfoComponent, initOntologyInfo } from "./ontology-info";
import { default as owlVisualizerComponent, initOwlVisualizer } from "./owl-visualizer";
import { default as rendererSelectorComponent, initRendererSelector } from "./renderer-selector";
import { default as settingsComponent, initSettings } from "./settings";
import bottomRightContainer from "./util/bottom-right-container";
import { default as zoomToolsComponent, initZoomTools } from "./zoom-tools";
import { default as fitButtonComponent, initFitButton } from "./fit-button";
import widgetNames from "./util/widget-names";

/**
 * Initialize the UI
 * @param {import('../grapholscape').default} grapholscape 
 */
export default function (grapholscape) {
  const init = () => {
    let gui_container = document.createElement('div')
    gui_container.setAttribute('id', 'gscape-ui')
    grapholscape.container.appendChild(gui_container)

    initDiagramSelector(grapholscape)
    initEntityDetails(grapholscape)

    initZoomTools(grapholscape)
    initOntologyInfo(grapholscape.ontology)
    initFullscreenButton(grapholscape.container)
    initFitButton(grapholscape)
    initOntologyExplorer(grapholscape)
    initOwlVisualizer(grapholscape)
    initFilters(grapholscape)
    initSettings(grapholscape)
    initRendererSelector(grapholscape)
    initLayoutSettings(grapholscape)

    // USING GRAPHOLSCAPE CALLBACKS
    grapholscape.onBackgroundClick(() => {
      blurAll(gui_container)
    })

    gui_container.appendChild(diagramSelectorComponent)
    gui_container.appendChild(ontologyExplorerComponent)
    gui_container.appendChild(entityDetailsComponent)
    gui_container.appendChild(owlVisualizerComponent)
    gui_container.appendChild(fullscreenComponent)
    gui_container.appendChild(layoutSettingsComponent)

    let bottomContainer = bottomRightContainer()
    bottomContainer.setAttribute('id', 'gscape-ui-bottom-container')
    bottomContainer.appendChild(zoomToolsComponent)
    bottomContainer.appendChild(fitButtonComponent)
    bottomContainer.appendChild(filterComponent)
    bottomContainer.appendChild(ontologyInfoComponent)
    bottomContainer.appendChild(settingsComponent)
    bottomContainer.appendChild(rendererSelectorComponent)
    gui_container.appendChild(bottomContainer)

    bottomContainer.querySelectorAll('*').forEach(widget => {
      if (isGrapholscapeWidget(widget)) {
        widget.onToggleBody = () => blurAll(bottomContainer, [widget])
      }
    })

    disableWidgets(grapholscape.config.widgets)

    function blurAll(container, widgetsToSkip = []) {
      container.querySelectorAll('*').forEach(widget => {
        if (isGrapholscapeWidget(widget) && !widgetsToSkip.includes(widget)) {
          widget.blur()
          if ( widget.btn?.hasPanel ) {
            widget.btn.classList.remove('panel-open')
          }
        }
      })
    }

    function isGrapholscapeWidget(widget) {
      return widget?.nodeName?.toLowerCase().startsWith('gscape')
    }

    function disableWidgets(widgets) {
      for (let widget in widgets) {
        if (!widgets[widget].enabled)
          gui_container.querySelector(widgetNames[widget]).disable()
      }
    }
  }

  if (grapholscape.shouldSimplify && grapholscape.shouldWaitSimplifyPromise) {
    grapholscape.SimplifiedOntologyPromise.then( _ => {
      init()
    })
  } else
    init()
}