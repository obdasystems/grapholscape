import GscapeDiagramSelector from "./diagram-selector";
import init from './controller'

export { GscapeDiagramSelector }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initDiagramSelector(grapholscape) {
  const diagramSelectorComponent = new GscapeDiagramSelector()
  init(diagramSelectorComponent, grapholscape)
  grapholscape.widgets.DIAGRAM_SELECTOR = diagramSelectorComponent
}