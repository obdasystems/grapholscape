import GscapeDiagramSelector from "./diagram-selector";
import init from './controller'

export { GscapeDiagramSelector }

export const diagramSelector = (grapholscape) => {
  const diagramSelectorComponent = new GscapeDiagramSelector()
  init(diagramSelectorComponent, grapholscape)
  return diagramSelectorComponent
}