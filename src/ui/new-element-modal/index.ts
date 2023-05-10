import Grapholscape from '../../core';
import { addDataPropertyIcon, addEntityIcon, addObjectPropertyIcon } from '../assets';
import { GscapeButton } from '../common/button';
import getIconSlot from '../util/get-icon-slot';
import ontologyModelToViewData from '../util/get-ontology-view-data';
import { WidgetEnum } from "../util/widget-enum";
import GscapeNewElementModal from "./new-element-modal";

export { GscapeNewElementModal };


export default function initDrawingElements(grapholscape: Grapholscape) {

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
    initNewElementModal(newElementComponent, 'Add New Entity')
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
    initNewElementModal(newElementComponent, 'Add New Data Property')
  }

  const addObjectPropertyBtn = new GscapeButton()
  const objectpropertyIcon = getIconSlot('icon', addObjectPropertyIcon)
  addObjectPropertyBtn.appendChild(objectpropertyIcon)

  addObjectPropertyBtn.style.top = '120px'
  addObjectPropertyBtn.style.left = '10px'
  addObjectPropertyBtn.style.position = 'absolute'
  addObjectPropertyBtn.title = 'Add Object Property'

  addObjectPropertyBtn.onclick = () => {

    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Object Property')
  }


  function initNewElementModal(newElementComponent, title) {
    newElementComponent.dialogTitle = title
  
    newElementComponent.show()
    newElementComponent.onConfirm = (iri) => {
      newElementComponent.hide()
    }
    newElementComponent.onCancel = () => {
      newElementComponent.hide()
    }
  
  }

  grapholscape.widgets.set(WidgetEnum.NEW_CLASS, addClassBtn)
  grapholscape.widgets.set(WidgetEnum.NEW_DATAPROPERTY, addDataPropertyBtn)
  grapholscape.widgets.set(WidgetEnum.NEW_OBJECTPROPERTY, addObjectPropertyBtn)


}


