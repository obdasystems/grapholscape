import GscapeSettings from "./settings";
import init from "./controller"

export default GscapeSettings

export const settingsComponent = new GscapeSettings()

export const settings = (grapholscape) => {
  init(settingsComponent, grapholscape)
  return settingsComponent
}