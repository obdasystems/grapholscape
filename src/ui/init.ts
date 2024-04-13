import Grapholscape from "../core";
import { CSS_PROPERTY_NAMESPACE, LifecycleEvent } from "../model";
import { IBaseMixin } from "./common/mixins";
import initDiagramSelector from "./diagram-selector";
import initEntityColors from "./entity-colors";
import initEntityDetails from "./entity-details";
import initFilters from "./filters";
import initFitButton from "./fit-button";
import initLayoutSettings from "./floaty-layout-settings";
import { initInitialRendererSelector } from "./full-page-selector";
import initFullscreenButton from "./fullscreen";
import initOntologyExplorer from "./ontology-explorer";
import initOntologyInfo from "./ontology-info";
import initOwlVisualizer from "./owl-visualizer";
import initRendererSelector from "./renderer-selector";
import initSettings, { GscapeSettings } from "./settings";
import bottomRightContainer from "./util/bottom-right-container";
import { WidgetEnum } from "./util/widget-enum";
import initZoomTools from "./zoom-tools";

/**
 * Initialize the UI
 */
export default function (grapholscape: Grapholscape) {
  const guiContainer = document.createElement('div')
  guiContainer.classList.add('gscape-ui')
  guiContainer.style.height = '100%'
  guiContainer.style.width = '100%'
  guiContainer.style.position = 'absolute'
  guiContainer.style.top = '0'
  guiContainer.style.pointerEvents = 'none'

  grapholscape.container.appendChild(guiContainer)

  const buttonsTray = bottomRightContainer()
  buttonsTray.classList.add('gscape-ui-buttons-tray')
  guiContainer.appendChild(buttonsTray)

  initDiagramSelector(grapholscape)
  initFullscreenButton(grapholscape)
  initFitButton(grapholscape)
  initZoomTools(grapholscape)
  initFilters(grapholscape)
  initOntologyInfo(grapholscape)
  initEntityDetails(grapholscape)
  initOntologyExplorer(grapholscape)
  initOwlVisualizer(grapholscape)
  initSettings(grapholscape)
  // initEntitySelector(grapholscape)
  initRendererSelector(grapholscape)
  initLayoutSettings(grapholscape)
  initInitialRendererSelector(grapholscape)
  initEntityColors(grapholscape)

  const settingsComponent = grapholscape.widgets.get(WidgetEnum.SETTINGS) as GscapeSettings

  grapholscape.widgets.forEach((widget, key) => {
    switch (key) {
      default:
        buttonsTray.appendChild(widget)
        break

      case WidgetEnum.FULLSCREEN_BUTTON:
      case WidgetEnum.DIAGRAM_SELECTOR:
      case WidgetEnum.ENTITY_DETAILS:
      case WidgetEnum.OWL_VISUALIZER:
      case WidgetEnum.ENTITY_SELECTOR:
      case WidgetEnum.ENTITY_COLOR_LEGEND:
        guiContainer.appendChild(widget)
        break
      
      case WidgetEnum.INITIAL_RENDERER_SELECTOR:
        grapholscape.container.appendChild(widget)
        break
    }

    const _widget = widget as unknown as IBaseMixin

    if (grapholscape.widgetsInitialStates && grapholscape.widgetsInitialStates[key] === false) {
      _widget.disable()
    }
  })

  if (!grapholscape.container.style.getPropertyValue('--gscape-border-radius'))
    grapholscape.container.style.setProperty('--gscape-border-radius', '8px')

  if (!grapholscape.container.style.getPropertyValue('--gscape-border-radius-btn'))
    grapholscape.container.style.setProperty('--gscape-border-radius-btn', '6px')

  if (!grapholscape.container.style.getPropertyValue('--gscape-font-size'))
    grapholscape.container.style.setProperty('--gscape-font-size', '14px')

  grapholscape.container.style.color = `var(${CSS_PROPERTY_NAMESPACE}-fg-default)`
  grapholscape.container.style.fontSize = `var(--gscape-font-size)`

  grapholscape.on(LifecycleEvent.BackgroundClick, blurAll)

  function blurAll(widgetsToSkip: HTMLElement[] = []) {
    grapholscape.widgets.forEach((widget, key) => {
      if (
        (key === WidgetEnum.ENTITY_DETAILS || key === WidgetEnum.OWL_VISUALIZER)
        && !widgetsToSkip.includes(widget)) {
        (widget as unknown as IBaseMixin).hide()
      } else if (!widgetsToSkip.includes(widget) && key !== WidgetEnum.ENTITY_SELECTOR) {
        widget.blur()
      }
    })
  }
}