import cytoscape from 'cytoscape';
import edgeEditing from 'cytoscape-edge-editing';
import $ from "jquery";
import konva from "konva";
import Grapholscape from '../../core';
import { LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../model';
import * as UI from '../../ui';
import OntologyBuilder from '../ontology-builder';
import { addHierarchySuperClassEdge, addInputEdge, getCommandsByType, removeHierarchyByNode, removeHierarchyInputEdge, removeHierarchySuperClassEdge } from './commands';
import { initNewObjectPropertyUI } from './init-modals';
import GscapeNewElementModal from "./new-element-modal";
import GscapeDesignerToolbar from './toolbar';

const { GscapeContextMenu } = UI

edgeEditing(cytoscape, $, konva)
export { GscapeNewElementModal };
window['$'] = window['jQuery'] = $

export default function initBuilderUI(grapholscape: Grapholscape) {
  const commandsWidget = new GscapeContextMenu()
  const toolboxWidget = new GscapeDesignerToolbar(grapholscape)

  if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
    grapholscape.uiContainer?.appendChild(toolboxWidget)
  }

  grapholscape.on(LifecycleEvent.NodeSelection, n => {
    const elem = grapholscape.renderer.cy?.$id(n.id)
    toolboxWidget.lastSelectedElement = elem
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, e => {
    const elem = grapholscape.renderer.cy?.$id(e.id)
    toolboxWidget.lastSelectedElement = elem
  })

  grapholscape.on(LifecycleEvent.BackgroundClick, () => {
    toolboxWidget.lastSelectedElement = undefined
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
    toolboxWidget.lastSelectedElement = undefined
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
      } else {
        const grapholElement = grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(elem.id())
        if (grapholElement && grapholElement.isHierarchy()) {
          // For hierarchies there can be edges or nodes, manually add specific commands
          if (elem.isNode()) {
            commandsFunctions.push(addHierarchySuperClassEdge)
            commandsFunctions.push(addInputEdge)
            commandsFunctions.push(removeHierarchyByNode)
          }
          else {
            commandsFunctions.push(removeHierarchySuperClassEdge)
          }
        }
        else if (elem.data('type') === TypesEnum.INPUT && (elem.connectedNodes(`[type = "${TypesEnum.UNION}"]`).nonempty() || elem.connectedNodes(`[type = "${TypesEnum.DISJOINT_UNION}"]`).nonempty())) {
          commandsFunctions.push(removeHierarchyInputEdge)
        }
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
}
