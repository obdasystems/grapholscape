import { NodeSingular } from "cytoscape"
import { TypesEnum } from "../../../model"
import { NodeButton } from "../../../ui"

export function showButtons(targetNode: NodeSingular, nodeButtons: Map<string, NodeButton[]>) {
  const targetType = targetNode.data().type

  if (!targetNode.hasClass('unknown-parent-class') && (targetType === TypesEnum.CLASS || targetType === TypesEnum.CLASS_INSTANCE)) {
    const buttons: NodeButton[] = []
    nodeButtons.get(targetType)?.forEach((btn, i) => {
      // set position relative to default placemente (right)
      btn.cxtWidgetProps.offset = (info) => getButtonOffset(info, i, nodeButtons.get(targetType)!.length)
      btn.node = targetNode

      // save the function to attach the button in the scratch for later usage
      targetNode.scratch(`place-node-button-${i}`, () => btn.attachTo((targetNode as any).popperRef()))
      targetNode.on('position', targetNode.scratch(`place-node-button-${i}`)) // on position change, call the function in the scratch
      btn.attachTo((targetNode as any).popperRef())
      buttons.push(btn)
    })

    targetNode.scratch(`node-button-list`, buttons)
  }
}

export function hideButtons(targetNode: NodeSingular) {
  const nodeButtons = targetNode.scratch('node-button-list') as NodeButton[]

  nodeButtons.forEach((btn, i) => {
    btn.hide();
    const updatePosFunction = targetNode.scratch(`place-node-button-${i}`)
    if (updatePosFunction) {
      targetNode.removeListener('position', undefined, updatePosFunction)
      targetNode.removeScratch(`place-node-button-${i}`)
    }
  })
}

export function getButtonOffset(info: { popper: { height: number, width: number } }, buttonIndex = 0, numberOfButtons = 1): [number, number] {
  const btnHeight = info.popper.height + 4
  const btnWidth = info.popper.width
  return [
    -(btnHeight / 2) - (buttonIndex * btnHeight) + (btnHeight * (numberOfButtons / 2)), // y
    -btnWidth / 2 // x
  ]
}