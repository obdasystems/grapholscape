import { SVGTemplateResult } from "lit"
import { GscapeRenderSelector } from "."
import Grapholscape from "../../core/grapholscape"
import FloatyRenderState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import { GrapholscapeState, LifecycleEvent, RenderStatesEnum } from "../../model"
import { grapholLiteRenderer } from "../../rendering/renderers"
import { rendererModelToViewData } from "../../util/model-obj-transformations"
import { graphol_icon } from "../assets/icons"
import { bubbles, lite } from "../assets/icons"

export type RendererStateViewModel = {
  name: string,
  icon: SVGTemplateResult,
}

export type RendererStates = { [key in RenderStatesEnum]?: RendererStateViewModel }

const rendererStates: RendererStates = {}


rendererStates.graphol = {
  name: 'Graphol',
  icon: graphol_icon,
}

rendererStates.lite = {
  name: 'Graphol-lite',
  icon: lite,
}

rendererStates.floaty = {
  name: 'Floaty',
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
  rendererSelector.rendererStates = rendererStates
  rendererSelector.actualRendererStateKey = grapholscape.renderState

  rendererSelector.onRendererStateSelection = (rendererState) => {
    if (rendererState !== grapholscape.renderState) {
      switch(rendererState) {
        case RenderStatesEnum.GRAPHOL:
          grapholscape.setRenderer(new GrapholRendererState())
          break

        case RenderStatesEnum.GRAPHOL_LITE:
          grapholscape.setRenderer(new LiteRendererState())
          break

        case RenderStatesEnum.FLOATY:
          grapholscape.setRenderer(new FloatyRenderState())
          break
      }
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.actualRendererStateKey = newRendererState

    if (newRendererState === RenderStatesEnum.FLOATY)
      rendererSelector.layoutSettingsComponent.openPanel()
  })
}