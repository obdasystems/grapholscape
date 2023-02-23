import { GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../../model";
import { icons } from "../../../ui";
import getIconSlot from "../../../ui/util/get-icon-slot";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import NodeButton from "./node-button";

export function NodeButtonsFactory(incrementalController: IncrementalController) {

  const instancesButton = new NodeButton()
  instancesButton.appendChild(getIconSlot('icon', icons.entityIcons["class-instance"]))
  instancesButton.style.setProperty('--gscape-border-radius-btn', '50%')

  const objectPropertyButton = new NodeButton()
  objectPropertyButton.appendChild(getIconSlot('icon', icons.entityIcons["object-property"]))
  objectPropertyButton.style.setProperty('--gscape-border-radius-btn', '50%')

  const nodeButtonsMap = new Map<GrapholTypesEnum, NodeButton[]>()
  nodeButtonsMap.set(GrapholTypesEnum.CLASS, [instancesButton, objectPropertyButton])
  nodeButtonsMap.set(GrapholTypesEnum.CLASS_INSTANCE, [objectPropertyButton])


  instancesButton.onclick = () => {
    alert('show instances explorer')
  }

  objectPropertyButton.onclick = () => {
    alert('show navigation menu')
  }

  if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
    setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
  }

  incrementalController.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
      setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
    }
  })

  incrementalController.on(IncrementalEvent.Reset, () => {
    if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
      setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
    }
  })

}

function setHandlersOnIncrementalCytoscape(cy: cytoscape.Core, nodeButtons: Map<GrapholTypesEnum, NodeButton[]>) {
  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  cy.on('mouseover', 'node', e => {
    const targetNode = e.target
    const targetType = targetNode.data().type

    if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {
      nodeButtons.get(targetType)?.forEach((btn, i) => {
        btn.cxtWidgetProps.offset = (info) => {
          const btnHeight = info.popper.height + 4
          const btnWidth = info.popper.width
          return [
            -(btnHeight / 2) - (i * btnHeight) + (btnHeight * (nodeButtons.get(targetType)!.length / 2)), // y
            -btnWidth / 2 // x
          ]
        }
        btn.attachTo(targetNode.popperRef())
      })
    }
  })

  cy.on('mouseout', 'node', e => {
    nodeButtons.forEach((buttons, _) => buttons.forEach(btn => btn.hide()))
  })

  cy.scratch('_gscape-graph-incremental-handlers-set', true)
}