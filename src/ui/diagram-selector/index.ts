import GscapeDiagramSelector from "./diagram-selector";
import init from './controller'
import Grapholscape from "../../core/grapholscape";

export { GscapeDiagramSelector }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initDiagramSelector(grapholscape: Grapholscape) {
  const diagramSelectorComponent = new GscapeDiagramSelector()
  init(diagramSelectorComponent, grapholscape)
  grapholscape.widgets.set('diagram-selector', diagramSelectorComponent)
}