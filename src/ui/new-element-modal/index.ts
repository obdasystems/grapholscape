import Grapholscape from '../../core';
import OntologyBuilder from '../../core/rendering/ontology-builder';
import { FunctionalityEnum, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from '../../model';
import { addChildClassIcon, addClassInstanceIcon, addDataPropertyIcon, addDiagramIcon, addEntityIcon, addISAIcon, addInputIcon, addObjectPropertyIcon, addParentClassIcon, addSubhierarchyIcon } from '../assets';
import { GscapeButton } from '../common/button';
import GscapeContextMenu, { Command } from '../common/context-menu';
import getIconSlot from '../util/get-icon-slot';
import ontologyModelToViewData from '../util/get-ontology-view-data';
import { WidgetEnum } from "../util/widget-enum";
import GscapeNewElementModal from "./new-element-modal";
import edgeEditing from 'cytoscape-edge-editing'
import $ from "jquery";
import konva from "konva";
import cytoscape from 'cytoscape'
import GrapholParser from '../../parsing/parser';

edgeEditing(cytoscape, $, konva)
export { GscapeNewElementModal };
window['$'] = window['jQuery'] = $


export default function initDrawingElements(grapholscape: Grapholscape) {
  const commandsWidget = new GscapeContextMenu()

  const edgeHandlesDefaults = {
    canConnect: function (sourceNode: any, targetNode: any) {
      const sourceType = sourceNode.data('type')
      const targetType = targetNode.data('type')

      switch (sourceType) {

        case GrapholTypesEnum.CLASS:
        case GrapholTypesEnum.UNION:
        case GrapholTypesEnum.DISJOINT_UNION:
          return targetType === GrapholTypesEnum.CLASS

        case GrapholTypesEnum.DATA_PROPERTY:
          return targetType === GrapholTypesEnum.DATA_PROPERTY

        default:
          return false
      }
    },
    edgeParams: function (sourceNode, targetNode) {

      let temp_id = 'temp_' + sourceNode.data('iri') + '-' + targetNode.data('iri')
      if (sourceNode.data('type') === GrapholTypesEnum.UNION || sourceNode.data('type') === GrapholTypesEnum.DISJOINT_UNION){
        temp_id = 'temp_' + sourceNode.data('id') + '-' + targetNode.data('iri')
      }
      return {
        data: {
          id: temp_id,
          name: temp_id,
          source: sourceNode.id(),
          target: targetNode.id(),
          type: grapholscape.renderer.cy?.scratch('edge-creation-type')
        }
      }
    },
    hoverDelay: 150, // time spent hovering over a target node before it is considered selected
    snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  } as Object

  const newElementComponent = new GscapeNewElementModal()
  newElementComponent.ontology = ontologyModelToViewData(grapholscape.ontology)

  const addClassBtn = new GscapeButton()
  const classIcon = getIconSlot('icon', addEntityIcon)
  addClassBtn.appendChild(classIcon)

  addClassBtn.style.top = '90px'
  addClassBtn.style.left = '10px'
  addClassBtn.style.position = 'absolute'
  addClassBtn.title = 'Add Class'

  addClassBtn.onclick = () => {
    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Class', GrapholTypesEnum.CLASS)
  }

  const addDiagramBtn = new GscapeButton()
  const diagramIcon = getIconSlot('icon', addDiagramIcon)
  addDiagramBtn.appendChild(diagramIcon)

  addDiagramBtn.style.top = '50px'
  addDiagramBtn.style.left = '10px'
  addDiagramBtn.style.position = 'absolute'
  addDiagramBtn.title = 'Add Diagram'

  addDiagramBtn.onclick = () => {
    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Diagram', 'Diagram')
  }

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
    if(currentCy.edgeEditing('get') === undefined){
      currentCy.edgeEditing({
        initAnchorsAutomatically: false,
        undoable: true,
        validateEdge: function (edge, newSource, newTarget) {
          const edgeType  = edge.data('type')
          switch (edgeType) {
            case 'attribute-edge':
              if (newSource.data('type') === 'class' && newTarget.id() === edge.data('target')){
                return 'valid'
              }
              return 'invalid';
            case 'inclusion':
              if ((newSource.data('type') === 'class' && newTarget.data('type') === 'class') || (newSource.data('type') === 'data-property' && newTarget.data('type') === 'data-property')){
                return 'valid'
              }
              return 'invalid';
            case 'object-property':
              if (newSource.data('type') === 'class' && newTarget.data('type') === 'class'){
                return 'valid'
              }
              return 'invalid';
            case 'union':
              if (newSource.data('type') === 'union' && newTarget.data('type') === 'class'){
                return 'valid'
              }
              return 'invalid';
            case 'disjoint-union':
              if (newSource.data('type') === 'disjoint-union' && newTarget.data('type') === 'class'){
                return 'valid'
              }
              return 'invalid';
            case 'input':
              if (newSource.data('type') === 'class' && (newTarget.data('type') === 'disjoint-union' || newTarget.data('type') === 'union')){
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
      if (addedEdge.data('type') === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.uiContainer?.appendChild(newElementComponent)
        initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
      }
      currentCy.removeScratch('edge-creation-type')
    })
  })

  grapholscape.on(LifecycleEvent.DoubleTap, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === GrapholTypesEnum.DATA_PROPERTY) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleFunctionality(elem.data('iri'))
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && !(elem.group() === 'edges') && (elem.data('type') === GrapholTypesEnum.DISJOINT_UNION || elem.data('type') === GrapholTypesEnum.UNION)){
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleUnion(elem)
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.group() === 'edges') && (elem.data('type') === GrapholTypesEnum.DISJOINT_UNION || elem.data('type') === GrapholTypesEnum.UNION)){
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleComplete(elem)
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === GrapholTypesEnum.DATA_PROPERTY) {
      const commands: Command[] = []

      // Logica per aggiungere comandi

      commands.push({
        content: 'Add Inclusion Edge',
        icon: addISAIcon,
        select: () => {
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', GrapholTypesEnum.INCLUSION)

        }
      })

      try {
        const htmlNodeReference = (elem as any).popperRef()
        if (htmlNodeReference && commands.length > 0) {
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      } catch (e) { console.error(e) }
    }
    else if(grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.data('type') === GrapholTypesEnum.UNION || elem.data('type') === GrapholTypesEnum.DISJOINT_UNION) ){
      const commands: Command[] = []
      // Logica per aggiungere comandi
      commands.push({
        content: 'Add Inclusion Edge',
        icon: addISAIcon,
        select: () => {
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', elem.data('type'))

        }
      })

      commands.push({
        content: 'Add Input Edge',
        icon: addInputIcon,
        select: () => {
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', GrapholTypesEnum.INPUT)

        }
      })

      try {
        const htmlNodeReference = (elem as any).popperRef()
        if (htmlNodeReference && commands.length > 0) {
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      } catch (e) { console.error(e) }
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === GrapholTypesEnum.CLASS) {
      const commands: Command[] = []

      // Logica per aggiungere comandi
      commands.push({
        content: 'Add Data Property',
        icon: addDataPropertyIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Data Property', GrapholTypesEnum.DATA_PROPERTY, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Object Property',
        icon: addObjectPropertyIcon,
        select: () => {
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', GrapholTypesEnum.OBJECT_PROPERTY)

        }
      })

      commands.push({
        content: 'Add Parent Class',
        icon: addParentClassIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Class', GrapholTypesEnum.CLASS, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Child Class',
        icon: addChildClassIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Class', GrapholTypesEnum.CLASS, undefined, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Subclass Edge',
        icon: addISAIcon,
        select: () => {
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', GrapholTypesEnum.INCLUSION)

        }
      })

      commands.push({
        content: 'Add Class Instance',
        icon: addClassInstanceIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Individual', GrapholTypesEnum.INDIVIDUAL, undefined, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Subhierarchy',
        icon: addSubhierarchyIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Subhierarchy', undefined, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Disjoint Subhierarchy',
        icon: addSubhierarchyIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Disjoint Subhierarchy', undefined, elem.data('iri'))
        }
      })

      try {
        const htmlNodeReference = (elem as any).popperRef()
        if (htmlNodeReference && commands.length > 0) {
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      } catch (e) { console.error(e) }
    }
  })

  function initNewElementModal(newElementComponent: GscapeNewElementModal, title, entityType, sourceId?: string, targetId?: string) {

    newElementComponent.dialogTitle = title
    newElementComponent.withoutPrefix = entityType === 'Diagram' ? 'none' : 'inline'
    newElementComponent.enableMore = entityType === 'Subhierarchy' || entityType === 'Disjoint Subhierarchy' ? 'inline' : 'none'
    newElementComponent.functionalities = []
    if (entityType === GrapholTypesEnum.DATA_PROPERTY) {
      newElementComponent.functionalities.push(FunctionalityEnum.functional)
    }
    else if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
      newElementComponent.functionalities.push(FunctionalityEnum.asymmetric, FunctionalityEnum.functional, FunctionalityEnum.inverseFunctional, FunctionalityEnum.irreflexive, FunctionalityEnum.reflexive, FunctionalityEnum.symmetric, FunctionalityEnum.transitive)
    }
    newElementComponent.show()

    newElementComponent.onConfirm = (iriString, functionalities = [], complete = false, datatype= '') => {
      newElementComponent.hide()
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (entityType === GrapholTypesEnum.CLASS) {
        if (sourceId) {
          ontologyBuilder.addNodeElement(iriString[0], entityType, sourceId, "superclass")
        }
        else if (targetId) {
          ontologyBuilder.addNodeElement(iriString[0], entityType, targetId, "subclass")
        } else {
          ontologyBuilder.addNodeElement(iriString[0], entityType)
        }
      }
      else if (entityType === GrapholTypesEnum.DATA_PROPERTY) {
        ontologyBuilder.addNodeElement(iriString[0], entityType, sourceId, undefined, functionalities, datatype)
      } else if (entityType === GrapholTypesEnum.INDIVIDUAL && targetId) {
        ontologyBuilder.addNodeElement(iriString[0], entityType, targetId)
      }
      else if (entityType === GrapholTypesEnum.OBJECT_PROPERTY && targetId && sourceId) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
        ontologyBuilder.addEdgeElement(iriString[0], entityType, sourceId, targetId, GrapholTypesEnum.CLASS, functionalities)
      }
      else if (entityType === 'Diagram') {
        ontologyBuilder.addDiagram(iriString[0])
      }
      else if (entityType === 'Subhierarchy' && targetId) {
        ontologyBuilder.addSubhierarchy(iriString, targetId, false, complete)
      }
      else if (entityType === 'Disjoint Subhierarchy' && targetId) {
        ontologyBuilder.addSubhierarchy(iriString, targetId, true, complete)
      }
    }

    newElementComponent.onCancel = () => {
      newElementComponent.hide()
      if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
      }
    }
  }

  grapholscape.widgets.set(WidgetEnum.NEW_CLASS, addClassBtn)
  grapholscape.widgets.set(WidgetEnum.NEW_DIAGRAM, addDiagramBtn)
}


