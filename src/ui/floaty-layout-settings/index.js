import GscapeLayoutSettings from "./layout-settings";
import init from "./controller"

export { GscapeLayoutSettings }

const layoutSettingsComponent = new GscapeLayoutSettings()

export function initLayoutSettings(grapholscape) {
  init(layoutSettingsComponent, grapholscape)
}

export default layoutSettingsComponent