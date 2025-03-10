import GscapeLayoutSettingsHub from "./layout-settings-hub";
import Grapholscape from '../../core/grapholscape'
import init from "./controller"
import { WidgetEnum } from "../util/widget-enum";
import GscapeLayoutSettings from "./layout-settings";

export { GscapeLayoutSettingsHub }
export { GscapeLayoutSettings }

export default function initLayoutSettings(grapholscape: Grapholscape) {
  const layoutSettingsComponent = new GscapeLayoutSettingsHub()
  init(layoutSettingsComponent, grapholscape)

  grapholscape.widgets.set(WidgetEnum.LAYOUT_SETTINGS, layoutSettingsComponent)
  return layoutSettingsComponent
}