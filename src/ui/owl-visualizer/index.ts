import init from './controller'
import Grapholscape from '../../core';
import { WidgetEnum } from "../util/widget-enum";
import GscapeOwlVisualizer from './owl-visualizer';

export { GscapeOwlVisualizer }

export default function initOwlVisualizer(grapholscape: Grapholscape) {
  const owlVisualizerComponent = new GscapeOwlVisualizer()
  init(owlVisualizerComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.OWL_VISUALIZER, owlVisualizerComponent)
}