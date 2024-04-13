import GscapeLayoutSettings from "./layout-settings";
import Grapholscape from '../../core/grapholscape'
import init from "./controller"
import { WidgetEnum } from "../util/widget-enum";

export { GscapeLayoutSettings }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initLayoutSettings(grapholscape: Grapholscape) {
  const layoutSettingsComponent = new GscapeLayoutSettings()
  init(layoutSettingsComponent, grapholscape)

  grapholscape.widgets.set(WidgetEnum.LAYOUT_SETTINGS, layoutSettingsComponent)
  return layoutSettingsComponent
}