import Grapholscape from '../../core';
import OntologyBuilder from '../../core/rendering/ontology-builder';
import { GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from '../../model';
import { addChildClassIcon, addDataPropertyIcon, addEntityIcon, addObjectPropertyIcon, addParentClassIcon } from '../assets';
import { GscapeButton } from '../common/button';
import GscapeContextMenu, { Command } from '../common/context-menu';
import getIconSlot from '../util/get-icon-slot';
import ontologyModelToViewData from '../util/get-ontology-view-data';
import { WidgetEnum } from "../util/widget-enum";
import GscapeNewElementModal from "./new-element-modal";


export { GscapeNewElementModal };


export default function initDrawingElements(grapholscape: Grapholscape) {
  const commandsWidget = new GscapeContextMenu()

  const edgeHandlesDefaults = {
    canConnect: function (sourceNode: any, targetNode: any) {
      const sourceType = sourceNode.data('type')
      const targetType = targetNode.data('type')

      switch (sourceType) {

        case GrapholTypesEnum.CLASS:
          return targetType === GrapholTypesEnum.CLASS

        default:
          return false
      }
    },
    edgeParams: function (sourceNode, targetNode) {

      let temp_id = 'temp_' + sourceNode.data('iri') + '-' + targetNode.data('iri')
      return {
        data: {
          id: temp_id,
          name: temp_id,
          source: sourceNode.id(),
          target: targetNode.id(),
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

  addClassBtn.style.top = '50px'
  addClassBtn.style.left = '10px'
  addClassBtn.style.position = 'absolute'
  addClassBtn.title = 'Add Entity'

  addClassBtn.onclick = () => {

    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Entity', GrapholTypesEnum.CLASS)
  }

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target

    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === 'class') {
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
          let myCy = grapholscape.renderer.cy as any
          let edgehandles = myCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)

          myCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
          })
        }
      })

      commands.push({
        content: 'Add Parent Class',
        icon: addParentClassIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Entity', GrapholTypesEnum.CLASS, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Child Class',
        icon: addChildClassIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Entity', GrapholTypesEnum.CLASS, null, elem.data('iri'))
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

  function initNewElementModal(newElementComponent: GscapeNewElementModal, title, entityType, sourceId = null, targetId = null) {

    newElementComponent.dialogTitle = title
    newElementComponent.show()

    newElementComponent.onConfirm = (iriString) => {
      newElementComponent.hide()
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (entityType === GrapholTypesEnum.CLASS) {
        if (sourceId) {
          ontologyBuilder.addNodeElement(iriString, entityType, sourceId, "superclass")
        }
        else if (targetId) {
          ontologyBuilder.addNodeElement(iriString, entityType, targetId, "subclass")
        } else {
          ontologyBuilder.addNodeElement(iriString, entityType)
        }
      }
      else if (entityType === GrapholTypesEnum.DATA_PROPERTY) {
        ontologyBuilder.addNodeElement(iriString, entityType, sourceId)
      }
      else if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
        ontologyBuilder.addEdgeElement(iriString, entityType, sourceId, targetId)
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
  //grapholscape.widgets.set(WidgetEnum.NEW_DATAPROPERTY, addDataPropertyBtn)
  //grapholscape.widgets.set(WidgetEnum.NEW_OBJECTPROPERTY, addObjectPropertyBtn)


}


