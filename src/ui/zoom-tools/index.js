import GscapeZoomTools from "./zoom-tools";

export { GscapeZoomTools }

const zoomToolsComponent = new GscapeZoomTools()

export function initZoomTools(grapholscape) {
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn()
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut()
}

export default zoomToolsComponent