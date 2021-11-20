import { rendererModelToViewData } from "../../util/model-obj-transformations"
import graphol_icon from "../assets/graphol-icon"

let icons = {
  'default': graphol_icon,
  'lite': 'flash_on',
  'float': 'bubble_chart'
}

/**
 * 
 * @param {import('./index').default} rendererSelector 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(rendererSelector, grapholscape) {
  Object.keys(grapholscape.renderersManager.renderers).forEach(key => {
    let renderer = grapholscape.renderersManager.renderers[key]
    rendererSelector.dict[key] = rendererModelToViewData(renderer)
    rendererSelector.dict[key].icon = icons[key]
  })
  rendererSelector.actual_mode = grapholscape.renderer.key
  rendererSelector.onRendererChange = (rendererName) => grapholscape.setRenderer(rendererName)

  grapholscape.onRendererChange( rendererKey => rendererSelector.actual_mode = rendererKey)
}