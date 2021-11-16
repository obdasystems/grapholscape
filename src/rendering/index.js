import RendererManager from "./renderer-manager"
import * as renderers from "./renderers"

export default function(container, renderersKeys = ['default']) {
  let rendererManager = new RendererManager()
  
  rendererManager.setContainer(container)
  
  renderersKeys.forEach( key => {
    let rendererKey = Object.keys(renderers).find( k => {
      if (k === 'GrapholscapeRenderer') return false
      return renderers[k].key === key
    })

    let renderer = renderers[rendererKey]
    rendererManager.addRenderer(key, renderer.label, renderer.getObj())
  })

  rendererManager.setRenderer('default')
  return rendererManager
}