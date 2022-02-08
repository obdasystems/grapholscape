import GscapeOwlVisualizer from "./owl-visualizer";
import init from './controller'

export { GscapeOwlVisualizer }

const owlVisualizerComponent = new GscapeOwlVisualizer()

export function initOwlVisualizer(grapholscape) {
  init(owlVisualizerComponent, grapholscape)
}

export default owlVisualizerComponent