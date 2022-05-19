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
    if (!rendererKey) {
      console.warn(`Renderer with key="${key}" does not exists`)
      return
    }
    let renderer = renderers[rendererKey]
    rendererManager.addRenderer(key, renderer.label, renderer.getObj())
  })

  if (Object.keys(rendererManager.renderers).length > 0 )
    rendererManager.setRenderer(Object.keys(rendererManager.renderers)[0])
  else {
    console.warn('Please specify at least one renderer. Default renderer will be used as fallback')
    rendererManager.addRenderer(
      renderers.grapholRenderer.key,
      renderers.grapholRenderer.label,
      renderers.grapholRenderer.getObj()
    )
    rendererManager.setRenderer(renderers.grapholRenderer.key)
  }
  return rendererManager
}