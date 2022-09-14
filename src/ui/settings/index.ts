import GscapeSettings from "./settings";
import init from "./controller"
import Grapholscape from '../../core';
import { WidgetEnum } from "../util/widget-enum";

export { GscapeSettings }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initSettings(grapholscape: Grapholscape) {
  const settingsComponent = new GscapeSettings()
  init(settingsComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.SETTINGS, settingsComponent)
}