import GscapeLayoutSettings from "./layout-settings";
import init from "./controller"

export { GscapeLayoutSettings }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initLayoutSettings(grapholscape) {
  const layoutSettingsComponent = new GscapeLayoutSettings()
  init(layoutSettingsComponent, grapholscape)
  return layoutSettingsComponent
}