import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import Grapholscape from '../../core';
import OntologyBuilder from '../../core/rendering/ontology-builder';
import { GrapholTypesEnum } from '../../model';
import { addDataPropertyIcon, addEntityIcon, addObjectPropertyIcon } from '../assets';
import { GscapeButton } from '../common/button';
import getIconSlot from '../util/get-icon-slot';
import ontologyModelToViewData from '../util/get-ontology-view-data';
import { WidgetEnum } from "../util/widget-enum";
import GscapeNewElementModal from "./new-element-modal";


export { GscapeNewElementModal };
cytoscape.use(edgehandles);


export default function initDrawingElements(grapholscape: Grapholscape) {

  const edgeHandlesDefaults = {
    canConnect: function (sourceNode: any, targetNode: any ) {
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
  
      let temp_id = 'temp_' + sourceNode.id() + '-' + targetNode.id()
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

  const addDataPropertyBtn = new GscapeButton()
  const datapropertyIcon = getIconSlot('icon', addDataPropertyIcon)
  addDataPropertyBtn.appendChild(datapropertyIcon)

  addDataPropertyBtn.style.top = '85px'
  addDataPropertyBtn.style.left = '10px'
  addDataPropertyBtn.style.position = 'absolute'
  addDataPropertyBtn.title = 'Add Data Property'

  addDataPropertyBtn.onclick = () => {

    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Data Property', GrapholTypesEnum.DATA_PROPERTY)
  }

  const addObjectPropertyBtn = new GscapeButton()
  const objectpropertyIcon = getIconSlot('icon', addObjectPropertyIcon)
  addObjectPropertyBtn.appendChild(objectpropertyIcon)

  addObjectPropertyBtn.style.top = '120px'
  addObjectPropertyBtn.style.left = '10px'
  addObjectPropertyBtn.style.position = 'absolute'
  addObjectPropertyBtn.title = 'Add Object Property'

  addObjectPropertyBtn.onclick = () => {

    let myCy = grapholscape.renderer.cy as any
    let edgehandles = myCy.edgehandles(edgeHandlesDefaults)
    edgehandles.enableDrawMode()

    myCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge)=> {
      grapholscape.uiContainer?.appendChild(newElementComponent)
      initNewElementModal(newElementComponent, 'Add New Object Property', GrapholTypesEnum.OBJECT_PROPERTY, sourceNode.data('id'), targetNode.data('id'))
      edgehandles.disableDrawMode()
    })
    
  }


  function initNewElementModal(newElementComponent: GscapeNewElementModal, title, entityType, sourceId = null, targetId = null) {

    newElementComponent.dialogTitle = title
    newElementComponent.show()

    newElementComponent.onConfirm = (iriString) => {
      newElementComponent.hide()
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (entityType === GrapholTypesEnum.CLASS || entityType === GrapholTypesEnum.DATA_PROPERTY) { 
        ontologyBuilder.addNodeElement(iriString, entityType)
      }
      else if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
        ontologyBuilder.addEdgeElement(iriString, entityType, sourceId, targetId)
      }
    }

    newElementComponent.onCancel = () => {
      newElementComponent.hide()
      if (entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()}
    }
  }

grapholscape.widgets.set(WidgetEnum.NEW_CLASS, addClassBtn)
grapholscape.widgets.set(WidgetEnum.NEW_DATAPROPERTY, addDataPropertyBtn)
grapholscape.widgets.set(WidgetEnum.NEW_OBJECTPROPERTY, addObjectPropertyBtn)


}


