import { SVGTemplateResult } from "lit"
import { GscapeRenderSelector } from "."
import Grapholscape from "../../core/grapholscape"
import FloatyRendererState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { bubbles, graphol_icon, lite } from "../assets/icons"

export type RendererStateViewModel = {
  name: string,
  id: RendererStatesEnum,
  icon: SVGTemplateResult,
}

export type RendererStates = { [key in RendererStatesEnum]?: RendererStateViewModel }

const rendererStates: RendererStates = {}

rendererStates[RendererStatesEnum.GRAPHOL] = {
  name: 'Graphol',
  id: RendererStatesEnum.GRAPHOL,
  icon: graphol_icon,
}

rendererStates[RendererStatesEnum.GRAPHOL_LITE] = {
  name: 'Graphol-lite',
  id: RendererStatesEnum.GRAPHOL_LITE,
  icon: lite,
}

rendererStates[RendererStatesEnum.FLOATY] = {
  name: 'Floaty',
  id: RendererStatesEnum.FLOATY,
  icon: bubbles,
}

/**
 * 
 * @param {import('./index').default} rendererSelector 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (rendererSelector: GscapeRenderSelector, grapholscape: Grapholscape) {
  // Object.keys(grapholscape.renderersManager.renderers).forEach(key => {
  //   let renderer = grapholscape.renderersManager.renderers[key]
  //   rendererSelector.dict[key] = rendererModelToViewData(renderer)
  //   rendererSelector.dict[key].icon = icons[key]
  // })
  // rendererSelector.actual_mode = grapholscape.renderer.key
  // 
  rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey])
  rendererSelector.actualRendererStateKey = grapholscape.renderState

  rendererSelector.onRendererStateSelection = (rendererState) => {
    if (rendererState !== grapholscape.renderState) {
      switch(rendererState) {
        case RendererStatesEnum.GRAPHOL:
          grapholscape.setRenderer(new GrapholRendererState())
          break

        case RendererStatesEnum.GRAPHOL_LITE:
          grapholscape.setRenderer(new LiteRendererState())
          break

        case RendererStatesEnum.FLOATY:
          grapholscape.setRenderer(new FloatyRendererState())
          break
      }
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.actualRendererStateKey = newRendererState

    if (newRendererState === RendererStatesEnum.FLOATY)
      rendererSelector.layoutSettingsComponent.openPanel()
  })
}