import cytoscape from 'cytoscape';
import edgeEditing from 'cytoscape-edge-editing';
import $ from "jquery";
import konva from "konva";
import Grapholscape from '../../core';
import OntologyBuilder from '../../core/ontology-builder';
import { LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../model';
import { addDiagramIcon, addEntityIcon } from '../assets';
import { GscapeButton } from '../common/button';
import GscapeContextMenu from '../common/context-menu';
import getIconSlot from '../util/get-icon-slot';
import { WidgetEnum } from "../util/widget-enum";
import { addInclusionEdge, addInputEdge, getCommandsByType, removeHierarchyByNode, removeHierarchyInputEdge, removeHierarchySuperClassEdge } from './commands';
import { initNewDiagramUI, initNewEntityUI, initNewObjectPropertyUI } from './init-modals';
import GscapeNewElementModal from "./new-element-modal";

edgeEditing(cytoscape, $, konva)
export { GscapeNewElementModal };
window['$'] = window['jQuery'] = $

export default function initDrawingElements(grapholscape: Grapholscape) {
  const commandsWidget = new GscapeContextMenu()

  const addClassBtn = new GscapeButton()
  const classIcon = getIconSlot('icon', addEntityIcon)
  addClassBtn.appendChild(classIcon)

  addClassBtn.style.top = '90px'
  addClassBtn.style.left = '10px'
  addClassBtn.style.position = 'absolute'
  addClassBtn.title = 'Add Class'

  addClassBtn.onclick = () => initNewEntityUI(grapholscape, TypesEnum.CLASS)

  const addDiagramBtn = new GscapeButton()
  const diagramIcon = getIconSlot('icon', addDiagramIcon)
  addDiagramBtn.appendChild(diagramIcon)

  addDiagramBtn.style.top = '50px'
  addDiagramBtn.style.left = '10px'
  addDiagramBtn.style.position = 'absolute'
  addDiagramBtn.title = 'Add Diagram'

  addDiagramBtn.onclick = () => initNewDiagramUI(grapholscape)

  if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
    grapholscape.uiContainer?.appendChild(addDiagramBtn)
    grapholscape.uiContainer?.appendChild(addClassBtn)
  }

  grapholscape.on(LifecycleEvent.RendererChange, (renderer) => {
    if (renderer === RendererStatesEnum.FLOATY) {
      grapholscape.uiContainer?.appendChild(addDiagramBtn)
      grapholscape.uiContainer?.appendChild(addClassBtn)
    } else {
      addDiagramBtn.remove()
      addClassBtn.remove()
    }
  })

  grapholscape.on(LifecycleEvent.DiagramChange, () => {
    let currentCy = grapholscape.renderer.cy as any
    if (currentCy.edgeEditing('get') === undefined) {
      currentCy.edgeEditing({
        initAnchorsAutomatically: false,
        undoable: true,
        validateEdge: function (edge, newSource, newTarget) {
          const edgeType = edge.data('type')
          const sourceType = newSource.data('type')
          const targetType = newTarget.data('type')
          switch (edgeType) {
            case TypesEnum.ATTRIBUTE_EDGE:
              if (sourceType === TypesEnum.CLASS && newTarget.id() === edge.data('target')) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.INCLUSION:
              if (sourceType === targetType && (sourceType === TypesEnum.CLASS || sourceType === TypesEnum.DATA_PROPERTY)) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.OBJECT_PROPERTY:
              if (sourceType === targetType && sourceType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.UNION:
              if (sourceType === TypesEnum.UNION && targetType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.DISJOINT_UNION:
              if (sourceType === TypesEnum.DISJOINT_UNION && targetType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.INPUT:
              if (sourceType === TypesEnum.CLASS && (targetType === TypesEnum.DISJOINT_UNION || targetType === TypesEnum.UNION)) {
                return 'valid'
              }
              return 'invalid';
            default:
              return 'valid'
          }
        }
      })
      // avoid konvajs to put div over grapholscape's UI
      document.getElementById('cy-node-edge-editing-stage0')?.remove()
    }
    currentCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
      if (addedEdge.data('type') === TypesEnum.OBJECT_PROPERTY) {
        addedEdge.remove()
        initNewObjectPropertyUI(grapholscape, sourceNode.data().iri, targetNode.data().iri)
        // grapholscape.uiContainer?.appendChild(newElementComponent)
        // initNewElementModal(newElementComponent, 'Add New Object Property', TypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
      }
      currentCy.removeScratch('edge-creation-type')
    })
  })

  grapholscape.on(LifecycleEvent.DoubleTap, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === TypesEnum.DATA_PROPERTY) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleFunctionality(elem.data('iri'))
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && !(elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleUnion(elem)
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleComplete(elem)
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
      const commandsByType = getCommandsByType()
      // get commands for this elem type
      let commandsFunctions = commandsByType.get(elem.data('type')) || []

      if (elem.data().iri) {
        const entity = grapholscape.ontology.getEntity(elem.data().iri)
        if (entity) {
          commandsFunctions.push(...(commandsByType.get('Entity') || []))
        }
      }
      else if ((elem.data('type') === TypesEnum.UNION || elem.data('type') === TypesEnum.DISJOINT_UNION)) {
        // For hierarchies there can be edges or nodes, manually add specific commands
        if (elem.isNode()) {
          commandsFunctions.push(addInclusionEdge)
          commandsFunctions.push(addInputEdge)
          commandsFunctions.push(removeHierarchyByNode)
        }
        else {
          commandsFunctions.push(removeHierarchySuperClassEdge)
        }
      }
      else if (elem.data('type') === TypesEnum.INPUT && (elem.connectedNodes(`[type = "${TypesEnum.UNION}"]`) || elem.connectedNodes(`[type = "${TypesEnum.DISJOINT_UNION}"]`))) {
        commandsFunctions.push(removeHierarchyInputEdge)
      }

      try {
        const htmlNodeReference = (elem as any).popperRef()
        if (htmlNodeReference && commandsFunctions.length > 0) {
          // each command function is a function taking grapholscape and the selected element
          // use map to get array of commands calling the command function
          const commands = commandsFunctions.map(cf => cf(grapholscape, elem))
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      } catch (e) { console.error(e) }
    }
  })

  grapholscape.widgets.set(WidgetEnum.NEW_CLASS, addClassBtn)
  grapholscape.widgets.set(WidgetEnum.NEW_DIAGRAM, addDiagramBtn)
}
