import { FloatyRendererState, Grapholscape } from "../../core";
import { LifecycleEvent, RendererStatesEnum } from "../../model";
import GscapeLayoutSettings from "./layout-settings";

/**
 * 
 * @param {import('./layout-settings').default} layoutSettingsComponent 
 * @param {import('../../../grapholscape').default} grapholscape 
 */
export default function (layoutSettingsComponent: GscapeLayoutSettings, grapholscape: Grapholscape) {

  if (grapholscape.renderState) {
    updateToggles(grapholscape.renderState)
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY && grapholscape.renderState !== RendererStatesEnum.INCREMENTAL) {
      layoutSettingsComponent.disable()
    } else {
      layoutSettingsComponent.enable()
    }
  }

  layoutSettingsComponent.onLayoutRunToggle = () => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY && 
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState
    // if (!grapholscape.renderer.layoutStopped) {
    //   layoutSettingsComponent.useOriginalPositionsToggle.state = false
    //   grapholscape.renderer.useOriginalPositions = false
    // }

    if (renderer.isLayoutInfinite) {
      renderer.stopLayout()
    } else {
      renderer.runLayoutInfinitely()
    }
    updateToggles(renderer.id)
  }

  layoutSettingsComponent.onDragAndPinToggle = () => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY && 
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState

    renderer.dragAndPin = !renderer.dragAndPin
    updateToggles(renderer.id)
  }

  grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    updateToggles(rendererState)
    if (rendererState !== RendererStatesEnum.FLOATY && rendererState !== RendererStatesEnum.INCREMENTAL) {
      layoutSettingsComponent.disable()
    } else {
      layoutSettingsComponent.enable()
    }
  })

  function updateToggles(renderState: RendererStatesEnum) {
    if (renderState === RendererStatesEnum.FLOATY || 
      grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      const renderer = grapholscape.renderer.renderState as FloatyRendererState
      layoutSettingsComponent.layoutRun = renderer.isLayoutInfinite
      layoutSettingsComponent.dragAndPin = renderer.dragAndPin
    }
  }

  // layoutSettingsComponent.onUseOriginalPositions = () => {
  //   if (!grapholscape.renderer.useOriginalPositions) {
  //     layoutSettingsComponent.layoutRunToggle.state = false
  //     grapholscape.renderer.layoutStopped = true
  //   }

  //   grapholscape.renderer.useOriginalPositions = !grapholscape.renderer.useOriginalPositions
  // }
}