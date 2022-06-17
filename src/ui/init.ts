import initDiagramSelector from "./diagram-selector";
import initEntityDetails from "./entity-details";
import initFilters from "./filters";
import initFullscreenButton from "./fullscreen";
import initOntologyExplorer from "./ontology-explorer";
import initOntologyInfo from "./ontology-info";
import initOwlVisualizer from "./owl-visualizer";
import initRendererSelector from "./renderer-selector";
import initSettings from "./settings";
import bottomRightContainer from "./util/bottom-right-container";
import initZoomTools from "./zoom-tools";
import initFitButton from "./fit-button";
import { WidgetEnum, widgetTagNames } from "./util/widget-enum";
import Grapholscape from "../core/grapholscape";
import GscapeActionListItem from "./common/list-item/action-list-item";
import GscapeToggle from "./common/toggle/gscape-toggle";
import { LifecycleEvent } from "../model";
import { hasDropPanel } from "./common/drop-panel-mixin";

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


  grapholscape.widgets.forEach((widget, key) => {
    switch (key) {
      default:
        buttonsTray.appendChild(widget)
        break

      case WidgetEnum.FULLSCREEN_BUTTON:
      case WidgetEnum.DIAGRAM_SELECTOR:
      case WidgetEnum.ENTITY_DETAILS:
        guiContainer.appendChild(widget)
    }

    if (hasDropPanel(widget)) {
      widget.onTogglePanel = () => blurAll([widget])
    }
  })

  grapholscape.on(LifecycleEvent.BackgroundClick, blurAll)

  function blurAll(widgetsToSkip: HTMLElement[] = []) {
    grapholscape.widgets.forEach(widget => {
      if (!widgetsToSkip.includes(widget))
        widget.blur()
    })
  }
  // const init = () => {
  //   let gui_container = document.createElement('div')
  //   gui_container.setAttribute('id', 'gscape-ui')
  //   grapholscape.container.appendChild(gui_container)

  //   initDiagramSelector(grapholscape)
  //   initEntityDetails(grapholscape)
  //   initZoomTools(grapholscape)
  //   initOntologyInfo(grapholscape)
  //   initFullscreenButton(grapholscape)
  //   initFitButton(grapholscape)
  //   initOntologyExplorer(grapholscape)
  //   initOwlVisualizer(grapholscape)
  //   initFilters(grapholscape)
  //   initSettings(grapholscape)
  //   initRendererSelector(grapholscape)

  //   // USING GRAPHOLSCAPE CALLBACKS
  //   grapholscape.onBackgroundClick(() => {
  //     blurAll(gui_container)
  //   })

  //   let bottomContainer = bottomRightContainer()
  //   bottomContainer.setAttribute('id', 'gscape-ui-bottom-container')

  //   Object.entries(grapholscape.widgets).forEach(widgetEntry => {
  //     const widget = widgetEntry[1]
  //     const widgetKey = widgetEntry[0]
  //     if (widget) {
  //       switch(widgetEnum[widgetKey]) {
  //         case widgetEnum.ZOOM_TOOLS:
  //         case widgetEnum.FIT_BUTTON:
  //         case widgetEnum.FILTERS:
  //         case widgetEnum.ONTOLOGY_INFO:
  //         case widgetEnum.SETTINGS:
  //         case widgetEnum.RENDERER_SELECTOR:
  //           bottomContainer.appendChild(widget)
  //           widget.onToggleBody = () => blurAll(bottomContainer, [widget])
  //           break

  //         default:
  //           gui_container.appendChild(widget)
  //       }

  //       // Reflect manual disabling/enabling widgets in config and update settings widget
  //       widget.onEnabled = () => {
  //         const configEntry = grapholscape.config.widgets[widgetEnum[widgetKey]]
  //         if (configEntry) {
  //           configEntry.enabled = true
  //           grapholscape.widgets.SETTINGS.requestUpdate()
  //         }
  //       }

  //       widget.onDisabled = () => {
  //         const configEntry = grapholscape.config.widgets[widgetEnum[widgetKey]]
  //         if (configEntry) {
  //           configEntry.enabled = false
  //           grapholscape.widgets.SETTINGS.requestUpdate()
  //         }
  //       }
  //     }
  //   })
  //   gui_container.appendChild(bottomContainer)

  //   grapholscape.widgets.RENDERER_SELECTOR.layoutSettingsComponent.onToggleBody = () => 
  //     blurAll(bottomContainer, [ grapholscape.widgets.RENDERER_SELECTOR.layoutSettingsComponent])

  //   disableWidgets(grapholscape.config.widgets)

  //   function blurAll(container, widgetsToSkip = []) {
  //     const layoutSettingsComponent = grapholscape.widgets.RENDERER_SELECTOR.layoutSettingsComponent
  //     container.querySelectorAll('*').forEach(widget => {
  //       if (isGrapholscapeWidget(widget) && !widgetsToSkip.includes(widget)) {
  //         performBlur(widget)
  //       }
  //     })

  //     if (layoutSettingsComponent && !widgetsToSkip.includes(layoutSettingsComponent))
  //       performBlur(layoutSettingsComponent)

  //     function performBlur(widget) {
  //       widget.blur()
  //       if ( widget.btn?.hasPanel ) {
  //         widget.btn.classList.remove('panel-open')
  //       }
  //     }
  //   }

  //   function isGrapholscapeWidget(widget) {
  //     return widget?.nodeName?.toLowerCase().startsWith('gscape')
  //   }

  //   function disableWidgets(widgets) {
  //     for (let widget in widgets) {
  //       if (!widgets[widget].enabled)
  //         gui_container.querySelector(widgetTagNames[widget]).disable()
  //     }
  //   }
  // }

  // if (grapholscape.shouldSimplify && grapholscape.shouldWaitSimplifyPromise) {
  //   await grapholscape.SimplifiedOntologyPromise.then( _ => {
  //     init()
  //   })
  // } else
  //   init()
}