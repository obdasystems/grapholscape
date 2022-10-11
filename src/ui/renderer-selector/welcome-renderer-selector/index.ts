import { Grapholscape } from "../../../core"
import init from './controller'
import GscapeWelcomeRendererSelector from "./welcome-renderer-selector"

export default function handleInitialRendererSelector(grapholscape: Grapholscape) {
  const rendererSelectorComponent = new GscapeWelcomeRendererSelector()
  init(rendererSelectorComponent, grapholscape)
  rendererSelectorComponent.requestUpdate()
  return rendererSelectorComponent
}