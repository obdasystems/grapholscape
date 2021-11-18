import Grapholscape from "../grapholscape";
import GscapeButton from "./common/gscape-button";
import { diagramSelector } from "./diagram-selector";
import { entityDetails } from "./entity-details";
import { entityOccurrences } from "./entity-occurrences";
import { filters } from "./filters";
import { layoutSettings } from "./floaty-layout-settings";
import { fullscreenButton } from "./fullscreen";
import { ontologyExplorer } from "./ontology-explorer";
import { ontologyInfo } from "./ontology-info";
import { owlVisualizer } from "./owl-visualizer";
import { rendererSelector } from "./renderer-selector";
import { settings } from "./settings";
import bottomLeftContainer from "./util/bottom-left-container";
import { zoomTools } from "./zoom-tools";
import { cyToGrapholElem, diagramModelToViewData, entityModelToViewData, ontologyModelToViewData } from "../util/model-obj-transformations";

const widgetNames = {
  explorer: 'gscape-explorer',
  details: 'gscape-entity-details',
  owl_translator: 'gscape-owl-visualizer',
  filters: 'gscape-filters',
  simplifications: 'gscape-render-selector',
  occurrences_list: 'gscape-entity-occurrences'
}
/**
 * Initialize the UI
 * @param {Grapholscape} grapholscape 
 */
export default function main(grapholscape) {
  /**
   * Create the various controller for each widget
   * 
   * usage example: diagramSelector.onDiagramChange = grapholscape.drawDiagram
   */
  let gui_container = document.createElement('div')
  let diagramsViewData = grapholscape.ontology.diagrams.map(diagram => diagramModelToViewData(diagram))

  diagramSelector.diagrams = diagramsViewData
  diagramSelector.onDiagramChange = (diagram) => grapholscape.showDiagram(diagram)

  entityDetails.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
  entityOccurrences.onNodeNavigation = (nodeID) => grapholscape.centerOnNode(nodeID)

  zoomTools.onZoomIn = () => grapholscape.zoomIn()
  zoomTools.onZoomOut = () => grapholscape.zoomOut()

  ontologyInfo.ontology = ontologyModelToViewData(grapholscape.ontology)

  const fullscreenComponent = fullscreenButton(grapholscape.container)

  const fitViewToGraphButton = new GscapeButton('filter_center_focus')
  fitViewToGraphButton.style.bottom = '10px'
  fitViewToGraphButton.style.right = '10px'
  fitViewToGraphButton.onClick = () => grapholscape.fit()

  const ontologyExplorerComponent = ontologyExplorer(grapholscape)
  const owlVisualizerComponent = owlVisualizer(grapholscape)
  const filterComponent = filters(grapholscape)
  const settingsComponent = settings(grapholscape)
  settingsComponent.onWidgetEnabled = (widgetName) => gui_container.querySelector(widgetNames[widgetName]).enable()
  settingsComponent.onWidgetDisabled = (widgetName) => gui_container.querySelector(widgetNames[widgetName]).disable()
  const rendererSelectorComponent = rendererSelector(grapholscape)
  const layoutSettingsComponent = layoutSettings(grapholscape)

  // USING GRAPHOLSCAPE CALLBACKS
  grapholscape.onDiagramChange(newDiagram => diagramSelector.actual_diagram_id = newDiagram.id)
  grapholscape.onEntitySelection(entity => {
    let entityViewData = entityModelToViewData(entity, grapholscape.languages)
    entityDetails.entity = entityViewData
    entityDetails.show()

    let entityOccurrencesViewData = grapholscape.ontology.getEntityOccurrences(entityViewData.iri.fullIri).map(elem => {
      let grapholElem = cyToGrapholElem(elem)
      return {
        id: grapholElem.data.id,
        id_xml: grapholElem.data.id_xml,
        diagram_id: grapholElem.data.diagram_id,
        diagram_name: grapholscape.ontology.getDiagram(grapholElem.data.diagram_id).name
      }
    })

    entityOccurrences.occurrences = entityOccurrencesViewData
    entityOccurrences.show()
  })
  grapholscape.onBackgroundClick(() => {
    blurAll(gui_container)
  })
  grapholscape.onNodeSelection(node => {
    let grapholNode = cyToGrapholElem(node)
    if (!grapholNode.classes.includes('predicate')) hideEntityRelatedWidgets()
  })

  grapholscape.onEdgeSelection(edge => {
    let grapholEdge = cyToGrapholElem(edge)
    if (!grapholEdge.classes.includes('predicate')) hideEntityRelatedWidgets()
  })

  gui_container.appendChild(diagramSelector)
  gui_container.appendChild(ontologyExplorerComponent)
  gui_container.appendChild(entityDetails)
  gui_container.appendChild(zoomTools)
  gui_container.appendChild(entityOccurrences)
  gui_container.appendChild(owlVisualizerComponent)
  gui_container.appendChild(fullscreenComponent)
  gui_container.appendChild(fitViewToGraphButton)
  gui_container.appendChild(layoutSettingsComponent)

  let bottomContainer = bottomLeftContainer()
  bottomContainer.appendChild(filterComponent)
  bottomContainer.appendChild(ontologyInfo)
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
    return widget.nodeName.toLowerCase().startsWith('gscape')
  }

  function disableWidgets(widgets) {
    for ( let widget in widgets ) {
      if (!widgets[widget].enabled)
        gui_container.querySelector(widgetNames[widget]).disable()
    }
  }
}

function hideEntityRelatedWidgets() {
  entityDetails.hide()
  entityOccurrences.hide()
}
