import GscapeRenderSelector from "./render-selector";
import init from "./controller"
import initLayoutSettings from "./floaty-layout-settings";
import Grapholscape from "../../core/grapholscape";

export { GscapeRenderSelector }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initRendererSelector(grapholscape: Grapholscape) {
  const rendererSelectorComponent = new GscapeRenderSelector()
  init(rendererSelectorComponent, grapholscape)
  //rendererSelectorComponent.layoutSettingsComponent = initLayoutSettings(grapholscape)
  rendererSelectorComponent.requestUpdate()
  grapholscape.widgets.set('renderer-selector', rendererSelectorComponent)
}