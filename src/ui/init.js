import { cyToGrapholElem } from "../util/model-obj-transformations";
import { diagramSelector } from "./diagram-selector";
import { entityDetails } from "./entity-details";
import { filters } from "./filters";
import { layoutSettings } from "./floaty-layout-settings";
import { fullscreenButton } from "./fullscreen";
import { ontologyExplorer } from "./ontology-explorer";
import { ontologyInfo } from "./ontology-info";
import { owlVisualizer } from "./owl-visualizer";
import { rendererSelector } from "./renderer-selector";
import { settings } from "./settings";
import bottomRightContainer from "./util/bottom-right-container";
import { zoomTools } from "./zoom-tools";
import { fitButton } from "./fit-button";
import { storeConfigEntry } from "../config/config-manager";


const widgetNames = {
  explorer: 'gscape-explorer',
  details: 'gscape-entity-details',
  owl_translator: 'gscape-owl-visualizer',
  filters: 'gscape-filters',
  simplifications: 'gscape-render-selector',
}

/**
 * Initialize the UI
 * @param {import('../grapholscape').default} grapholscape 
 */
export default function (grapholscape) {
  const init = () => {
    let gui_container = document.createElement('div')
    gui_container.setAttribute('id', 'gscape-ui')

    const diagramSelectorComponent = diagramSelector(grapholscape)
    const entityDetailsComponent = entityDetails(grapholscape)

    const zoomToolsComponent = zoomTools(grapholscape)
    const ontologyInfoComponent = ontologyInfo(grapholscape.ontology)
    const fullscreenComponent = fullscreenButton(grapholscape.container)
    const fitButtonComponent = fitButton(grapholscape)
    const ontologyExplorerComponent = ontologyExplorer(grapholscape)
    const owlVisualizerComponent = owlVisualizer(grapholscape)
    const filterComponent = filters(grapholscape)
    const settingsComponent = settings(grapholscape)
    settingsComponent.onWidgetEnabled = (widgetName) => {
      gui_container.querySelector(widgetNames[widgetName]).enable()
      storeConfigEntry(widgetName, true)
    }
    settingsComponent.onWidgetDisabled = (widgetName) => {
      gui_container.querySelector(widgetNames[widgetName]).disable()
      storeConfigEntry(widgetName, false)
    }
    const rendererSelectorComponent = rendererSelector(grapholscape)
    const layoutSettingsComponent = layoutSettings(grapholscape)

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
    grapholscape.container.appendChild(gui_container)

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