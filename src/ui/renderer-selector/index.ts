import GscapeRenderSelector from "./render-selector";
import init from "./controller"
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
  rendererSelectorComponent.requestUpdate()
  grapholscape.widgets.set(WidgetEnum.RENDERER_SELECTOR, rendererSelectorComponent)
}