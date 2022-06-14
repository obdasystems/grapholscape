import Grapholscape from "../../core/grapholscape";
import GscapeZoomTools from "./zoom-tools";

export { GscapeZoomTools }


/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initZoomTools(grapholscape: Grapholscape) {
  const zoomToolsComponent = new GscapeZoomTools()
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn(0.2)
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut(0.2)
  grapholscape.widgets.set('zoom-tools', zoomToolsComponent)
}