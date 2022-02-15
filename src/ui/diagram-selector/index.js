import GscapeDiagramSelector from "./diagram-selector";
import init from './controller'

export { GscapeDiagramSelector }

const diagramSelectorComponent = new GscapeDiagramSelector()

export function initDiagramSelector(grapholscape) {
  init(diagramSelectorComponent, grapholscape)
}

export default diagramSelectorComponent