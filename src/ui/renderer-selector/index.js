import GscapeRenderSelector from "./render-selector";
import init from "./controller"

export { GscapeRenderSelector }

const rendererSelectorComponent = new GscapeRenderSelector()

export function initRendererSelector(grapholscape) {
  init(rendererSelectorComponent, grapholscape)
}

export default rendererSelectorComponent