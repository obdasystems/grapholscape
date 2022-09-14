import Grapholscape from "../core";
import { CSS_PROPERTY_NAMESPACE, LifecycleEvent } from "../model";
import { IBaseMixin } from "./common/base-widget-mixin";
import { hasDropPanel } from "./common/drop-panel-mixin";
import initDiagramSelector from "./diagram-selector";
import initEntityDetails from "./entity-details";
import initFilters from "./filters";
import initFitButton from "./fit-button";
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
  grapholscape.container.appendChild(guiContainer)

  const buttonsTray = bottomRightContainer()
  buttonsTray.classList.add('gscape-ui-buttons-tray')
  guiContainer.appendChild(buttonsTray)

  initDiagramSelector(grapholscape)
  initFullscreenButton(grapholscape)
  initFitButton(grapholscape)
  initZoomTools(grapholscape)
  initRendererSelector(grapholscape)
  initFilters(grapholscape)
  initOntologyInfo(grapholscape)
  initEntityDetails(grapholscape)
  initOntologyExplorer(grapholscape)
  initOwlVisualizer(grapholscape)
  initSettings(grapholscape)

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
        guiContainer.appendChild(widget)
        break

      case WidgetEnum.LAYOUT_SETTINGS:
        break
    }

    if (hasDropPanel(widget)) {
      widget.onTogglePanel = () => {
        const entityDetailsComponent = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS)
        if (entityDetailsComponent) {
          blurAll([widget, entityDetailsComponent])
        } else {
          blurAll([widget])
        }
      }
    }

    const _widget = widget as unknown as IBaseMixin

    _widget.onStateChange = () => {
      if (settingsComponent) {
        settingsComponent.widgetStates[key] = _widget.enabled
        settingsComponent.requestUpdate()
      }
    }

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
      if ((key === WidgetEnum.ENTITY_DETAILS || key === WidgetEnum.OWL_VISUALIZER) && !widgetsToSkip.includes(widget)) {
        (widget as unknown as IBaseMixin).hide()
      } else if (!widgetsToSkip.includes(widget)) {
        widget.blur()
      }
    })
  }
}