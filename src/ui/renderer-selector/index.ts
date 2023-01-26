import GscapeRenderSelector from "./render-selector";
import init from "./controller"
import initLayoutSettings from "./floaty-layout-settings";
import Grapholscape from '../../core';
import { WidgetEnum } from "../util/widget-enum";

export { GscapeRenderSelector }

export * from './view-model'

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initRendererSelector(grapholscape: Grapholscape) {
  const rendererSelectorComponent = new GscapeRenderSelector()
  init(rendererSelectorComponent, grapholscape)
  rendererSelectorComponent.layoutSettingsComponent = initLayoutSettings(grapholscape)
  rendererSelectorComponent.requestUpdate()
  grapholscape.widgets.set(WidgetEnum.RENDERER_SELECTOR, rendererSelectorComponent)
  grapholscape.widgets.set(WidgetEnum.LAYOUT_SETTINGS, rendererSelectorComponent.layoutSettingsComponent)
}