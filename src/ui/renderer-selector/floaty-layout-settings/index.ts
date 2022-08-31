import GscapeLayoutSettings from "./layout-settings";
import Grapholscape from '../../../core/grapholscape'
import init from "./controller"

export { GscapeLayoutSettings }

/**
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function initLayoutSettings(grapholscape: Grapholscape) {
  const layoutSettingsComponent = new GscapeLayoutSettings()
  init(layoutSettingsComponent, grapholscape)
  return layoutSettingsComponent
}