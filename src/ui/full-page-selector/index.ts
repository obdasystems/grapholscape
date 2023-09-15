import { Grapholscape } from "../../core"
import { WidgetEnum } from "../util/widget-enum"
import init from './controller'
import GscapeFullPageSelector from "./full-page-selector"

export { GscapeFullPageSelector }

export function initInitialRendererSelector(grapholscape: Grapholscape) {
  const rendererSelectorComponent = new GscapeFullPageSelector()
  init(rendererSelectorComponent, grapholscape)

  grapholscape.widgets.set(WidgetEnum.INITIAL_RENDERER_SELECTOR, rendererSelectorComponent)

  if (grapholscape.renderers.length < 1 || grapholscape.renderState) {
    rendererSelectorComponent.disable()
  }
}