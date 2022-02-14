import GscapeRenderSelector from "./render-selector";
import init from "./controller"
import { initLayoutSettings } from "./floaty-layout-settings";

export { GscapeRenderSelector }

const rendererSelectorComponent = new GscapeRenderSelector()

export function initRendererSelector(grapholscape) {
  init(rendererSelectorComponent, grapholscape)
  initLayoutSettings(grapholscape)
}

export default rendererSelectorComponent