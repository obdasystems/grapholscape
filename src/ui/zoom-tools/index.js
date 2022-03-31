import GscapeZoomTools from "./zoom-tools";

export { GscapeZoomTools }


/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initZoomTools(grapholscape) {
  const zoomToolsComponent = new GscapeZoomTools()
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn()
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut()
  grapholscape.widgets.ZOOM_TOOLS = zoomToolsComponent
}