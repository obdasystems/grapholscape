import GscapeLayoutSettings from "./layout-settings";
import init from "./controller"

export default GscapeLayoutSettings

export const layoutSettings = (grapholscape) => {
  const layoutSettingsComponent = new GscapeLayoutSettings()
  init(layoutSettingsComponent, grapholscape)
  return layoutSettingsComponent
}