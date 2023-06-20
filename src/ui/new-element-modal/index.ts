import Grapholscape from '../../core';
import OntologyBuilder from '../../core/rendering/ontology-builder';
import { FunctionalityEnum, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from '../../model';
import { addChildClassIcon, addClassInstanceIcon, addDataPropertyIcon, addDiagramIcon, addEntityIcon, addISAIcon, addObjectPropertyIcon, addParentClassIcon, addSubhierarchyIcon } from '../assets';
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

        case GrapholTypesEnum.DATA_PROPERTY:
          return targetType === GrapholTypesEnum.DATA_PROPERTY

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

  grapholscape.on(LifecycleEvent.DoubleTap, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === "data-property") {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleFunctionality(elem.data('iri'))
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === "data-property") {
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

          currentCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
            if (addedEdge.data('type') === GrapholTypesEnum.OBJECT_PROPERTY) {
              grapholscape.uiContainer?.appendChild(newElementComponent)
              initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
            }
            else if(addedEdge.data('type') === GrapholTypesEnum.INCLUSION){
              const ontologyBuilder = new OntologyBuilder(grapholscape)
              const sourceId = sourceNode.data('iri')
              const targetId = targetNode.data('iri')
              grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
              ontologyBuilder.addEdgeElement(null, GrapholTypesEnum.INCLUSION, sourceId, targetId)
            }
            currentCy.removeScratch('edge-creation-type')
          })
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
          let currentCy = grapholscape.renderer.cy as any
          let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
          edgehandles.start(elem)
          currentCy.scratch('edge-creation-type', GrapholTypesEnum.OBJECT_PROPERTY)

          currentCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
            if (addedEdge.data('type') === GrapholTypesEnum.OBJECT_PROPERTY) {
              grapholscape.uiContainer?.appendChild(newElementComponent)
              initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
            }
            else if(addedEdge.data('type') === GrapholTypesEnum.INCLUSION){
              const ontologyBuilder = new OntologyBuilder(grapholscape)
              const sourceId = sourceNode.data('iri')
              const targetId = targetNode.data('iri')
              grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
              ontologyBuilder.addEdgeElement(null, GrapholTypesEnum.INCLUSION, sourceId, targetId)
            }
            currentCy.removeScratch('edge-creation-type')
          })
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
          initNewElementModal(newElementComponent, 'Add New Class', GrapholTypesEnum.CLASS, null, elem.data('iri'))
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

          currentCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
            if (addedEdge.data('type') === GrapholTypesEnum.OBJECT_PROPERTY) {
              grapholscape.uiContainer?.appendChild(newElementComponent)
              initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
            }
            else if(addedEdge.data('type') === GrapholTypesEnum.INCLUSION){
              const ontologyBuilder = new OntologyBuilder(grapholscape)
              const sourceId = sourceNode.data('iri')
              const targetId = targetNode.data('iri')
              grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
              ontologyBuilder.addEdgeElement(null, GrapholTypesEnum.INCLUSION, sourceId, targetId)
            }
            currentCy.removeScratch('edge-creation-type')
          })
        }
      })

      commands.push({
        content: 'Add Class Instance',
        icon: addClassInstanceIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Individual', GrapholTypesEnum.INDIVIDUAL, null, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Subhierarchy',
        icon: addSubhierarchyIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Subhierarchy', null, elem.data('iri'))
        }
      })

      commands.push({
        content: 'Add Disjoint Subhierarchy',
        icon: addSubhierarchyIcon,
        select: () => {
          grapholscape.uiContainer?.appendChild(newElementComponent)
          initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Disjoint Subhierarchy', null, elem.data('iri'))
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
        ontologyBuilder.addNodeElement(iriString[0], entityType, sourceId, null, functionalities, datatype)
      } else if (entityType === GrapholTypesEnum.INDIVIDUAL) {
        ontologyBuilder.addNodeElement(iriString[0], entityType, targetId)
      }
      else if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
        ontologyBuilder.addEdgeElement(iriString[0], entityType, sourceId, targetId, functionalities)
      }
      else if (entityType === 'Diagram') {
        ontologyBuilder.addDiagram(iriString[0])
      }
      else if (entityType === 'Subhierarchy') {
        ontologyBuilder.addSubhierarchy(iriString, targetId, false, complete)
      }
      else if (entityType === 'Disjoint Subhierarchy') {
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


