import { render } from "lit";
import { FloatyRendererState, Grapholscape } from "../../core";
import { LifecycleEvent, RendererStatesEnum } from "../../model";
import GscapeLayoutSettings from "./layout-settings";
import { GscapeLayout } from "../../model/renderers/layout";

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

  const autoRunLayout = (renderer: FloatyRendererState, forceInfinite?: boolean) => {
    if (renderer.gscapeLayout.canBeInfinite && (forceInfinite || (renderer.isLayoutInfinite && renderer.layoutRunning))) {
      renderer.runLayoutInfinitely()
    } else {
      renderer.runLayout()
    }
  }

  layoutSettingsComponent.onLayoutRunToggle = (isActive: boolean) => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState
    // if (!grapholscape.renderer.layoutStopped) {
    //   layoutSettingsComponent.useOriginalPositionsToggle.state = false
    //   grapholscape.renderer.useOriginalPositions = false
    // }

    if (!isActive) {
      renderer.stopLayout()
      renderer.gscapeLayout.infinite = false
      updateToggles(renderer.id)
    } else {
      autoRunLayout(renderer, true)
    }
  }

  layoutSettingsComponent.onDragAndPinToggle = () => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState

    renderer.dragAndPin = !renderer.dragAndPin
    updateToggles(renderer.id)
  }

  layoutSettingsComponent.addEventListener('layoutChange', (e: CustomEvent<GscapeLayout>) => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState
    renderer.gscapeLayout = e.detail
    const previousFitSetting = renderer.gscapeLayout.fit
    if (!renderer.isLayoutInfinite) {
      renderer.gscapeLayout.fit = true
    }
    autoRunLayout(renderer, layoutSettingsComponent.layoutRun)
    if (!renderer.isLayoutInfinite) {
      renderer.gscapeLayout.fit = previousFitSetting
    }
    updateToggles(renderer.id)
  })
  layoutSettingsComponent.addEventListener('layoutSettingChange', (e: CustomEvent) => {
    if (grapholscape.renderState !== RendererStatesEnum.FLOATY &&
      grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      return

    const renderer = grapholscape.renderer.renderState as FloatyRendererState
    autoRunLayout(renderer)
  })
  layoutSettingsComponent.addEventListener('randomize', (e: CustomEvent) => {
    (grapholscape.renderer.renderState as FloatyRendererState).randomizeLayout()
  })

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
      // layoutSettingsComponent.layoutRun = renderer.layoutRunning
      layoutSettingsComponent.selectedLayout = renderer.gscapeLayout
      layoutSettingsComponent.layouts = renderer.availableLayouts
      // layoutSettingsComponent.edgeLength = renderer.gscapeLayout.edgeLengthFactor
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