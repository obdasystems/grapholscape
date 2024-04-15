import { storeConfigEntry } from "../../config"
import Grapholscape from '../../core'
import FloatyRendererState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import IncrementalRendererState from "../../core/rendering/incremental/incremental-render-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { showMessage } from "../common/confirm-dialog"
import GscapeRenderSelector from "./render-selector"
import { rendererStates } from "./view-model"

export default function (rendererSelector: GscapeRenderSelector, grapholscape: Grapholscape) {
  rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey])
  if (grapholscape.renderState) {
    rendererSelector.currentRendererStateKey = grapholscape.renderState
  }

  rendererSelector.onRendererStateSelection = (rendererState) => {
    rendererStateSelectionCallback(rendererState, grapholscape)
  }

  rendererSelector.onIncrementalReset = () => {
    showMessage(
      'Are you sure? This action is irreversible and you will lose your current graph.', 
      'Confirm Reset',
      grapholscape.uiContainer,
      'warning'
    ).onConfirm(() => grapholscape.incremental?.reset())
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.currentRendererStateKey = newRendererState

    // if (newRendererState === RendererStatesEnum.FLOATY)
      // rendererSelector.layoutSettingsComponent.openPanel()
  })
}

export function rendererStateSelectionCallback(
  rendererState: RendererStatesEnum,
  grapholscape: Grapholscape) {

  if (rendererState !== grapholscape.renderState) {
    let isRenderValid = false
    switch (rendererState) {
      case RendererStatesEnum.GRAPHOL:
        grapholscape.setRenderer(new GrapholRendererState())
        isRenderValid = true
        break

      case RendererStatesEnum.GRAPHOL_LITE:
        grapholscape.setRenderer(new LiteRendererState())
        isRenderValid = true
        break

      case RendererStatesEnum.FLOATY:
        grapholscape.setRenderer(new FloatyRendererState())
        isRenderValid = true
        break

      case RendererStatesEnum.INCREMENTAL:
        grapholscape.setRenderer(new IncrementalRendererState())
        grapholscape.incremental?.showDiagram()
        isRenderValid = true
        break
    }

    if (isRenderValid)
      storeConfigEntry('selectedRenderer', rendererState)
  }
}