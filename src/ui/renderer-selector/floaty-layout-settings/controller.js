/**
 * 
 * @param {import('./layout-settings').default} layoutSettingsComponent 
 * @param {import('../../../grapholscape').default} grapholscape 
 */
export default function(layoutSettingsComponent, grapholscape) {

  layoutSettingsComponent.onLayoutRunToggle = () => {
    if (!grapholscape.layoutStopped) {
      layoutSettingsComponent.useOriginalPositionsToggle.state = false
      grapholscape.renderer.useOriginalPositions = false
    }

    grapholscape.renderer.layoutStopped = !grapholscape.renderer.layoutStopped
  }
  layoutSettingsComponent.onDragAndPinToggle =
    () => grapholscape.renderer.dragAndPin = !grapholscape.renderer.dragAndPin

  layoutSettingsComponent.onUseOriginalPositions = () => {
    if (!grapholscape.renderer.useOriginalPositions) {
      layoutSettingsComponent.layoutRunToggle.state = false
      grapholscape.renderer.layoutStopped = true
    }

    grapholscape.renderer.useOriginalPositions = !grapholscape.renderer.useOriginalPositions
  }
}