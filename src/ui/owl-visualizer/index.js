import GscapeOwlVisualizer from "./owl-visualizer";
import init from './controller'

export default GscapeOwlVisualizer

export const owlVisualizerComponent = new GscapeOwlVisualizer()

export const owlVisualizer = (grapholscape) => {
  init(owlVisualizerComponent, grapholscape)
  return owlVisualizerComponent
}