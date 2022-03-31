import GscapeOwlVisualizer from "./owl-visualizer";
import init from './controller'

export { GscapeOwlVisualizer }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initOwlVisualizer(grapholscape) {
  const owlVisualizerComponent = new GscapeOwlVisualizer()
  init(owlVisualizerComponent, grapholscape)
  grapholscape.widgets.OWL_VISUALIZER = owlVisualizerComponent
}