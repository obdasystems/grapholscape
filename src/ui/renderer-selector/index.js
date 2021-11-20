import GscapeRenderSelector from "./render-selector";
import init from "./controller"

export default GscapeRenderSelector

export const rendererSelectorComponent = new GscapeRenderSelector()

export const rendererSelector = (grapholscape) => {
  init(rendererSelectorComponent, grapholscape)
  return rendererSelectorComponent
}