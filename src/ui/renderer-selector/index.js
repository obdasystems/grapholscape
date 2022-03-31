import GscapeRenderSelector from "./render-selector";
import init from "./controller"
import initLayoutSettings from "./floaty-layout-settings";

export { GscapeRenderSelector }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initRendererSelector(grapholscape) {
  const rendererSelectorComponent = new GscapeRenderSelector()
  init(rendererSelectorComponent, grapholscape)
  rendererSelectorComponent.layoutSettingsComponent = initLayoutSettings(grapholscape)
  rendererSelectorComponent.requestUpdate()
  grapholscape.widgets.RENDERER_SELECTOR = rendererSelectorComponent
}