import Grapholscape from '../../core';
import { WidgetEnum } from "../util/widget-enum";
import GscapeZoomTools from "./zoom-tools";

export { GscapeZoomTools }


/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initZoomTools(grapholscape: Grapholscape) {
  const zoomToolsComponent = new GscapeZoomTools()
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn(0.4)
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut(0.4)
  grapholscape.widgets.set(WidgetEnum.ZOOM_TOOLS, zoomToolsComponent)
}