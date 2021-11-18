import GscapeLayoutSettings from "./layout-settings"
import Grapholscape from "../../grapholscape"

/**
 * 
 * @param {GscapeLayoutSettings} layoutSettingsComponent 
 * @param {Grapholscape} grapholscape 
 */
export default function(layoutSettingsComponent, grapholscape) {
  layoutSettingsComponent.hide()

  grapholscape.onRendererChange( rendererKey => {
    if (rendererKey === 'float')
      layoutSettingsComponent.show()
    else
      layoutSettingsComponent.hide()
  })

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