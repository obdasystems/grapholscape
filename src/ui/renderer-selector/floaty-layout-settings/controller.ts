import Grapholscape from "../../../core/grapholscape";
import FloatyRenderState from "../../../core/rendering/floaty/floaty-renderer-state";
import { LifecycleEvent, RendererStatesEnum } from "../../../model";
import GscapeLayoutSettings from "./layout-settings";

/**
 * 
 * @param {import('./layout-settings').default} layoutSettingsComponent 
 * @param {import('../../../grapholscape').default} grapholscape 
 */
export default function (layoutSettingsComponent: GscapeLayoutSettings, grapholscape: Grapholscape) {

  updateToggles(grapholscape.renderState)

  layoutSettingsComponent.onLayoutRunToggle = () => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRenderState
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
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRenderState

    renderer.dragAndPin = !renderer.dragAndPin
    updateToggles(renderer.id)
  }

  grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    updateToggles(rendererState)
  })

  function updateToggles(renderState: RendererStatesEnum) {
    if (renderState === RendererStatesEnum.FLOATY) {
      const renderer = grapholscape.renderer.renderState as FloatyRenderState
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