import GscapeSettings from "./settings";
import init from "./controller"

export { GscapeSettings }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initSettings(grapholscape) {
  const settingsComponent = new GscapeSettings()
  init(settingsComponent, grapholscape)
  grapholscape.widgets.SETTINGS = settingsComponent
}