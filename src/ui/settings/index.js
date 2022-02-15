import GscapeSettings from "./settings";
import init from "./controller"

export { GscapeSettings }

const settingsComponent = new GscapeSettings()

export function initSettings(grapholscape) {
  init(settingsComponent, grapholscape)
}

export default settingsComponent