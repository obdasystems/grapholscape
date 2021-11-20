import GscapeZoomTools from "./zoom-tools";

export default GscapeZoomTools

export const zoomTools = (grapholscape) => {
  const zoomToolsComponent = new GscapeZoomTools()
  zoomToolsComponent.onZoomIn = () => grapholscape.zoomIn()
  zoomToolsComponent.onZoomOut = () => grapholscape.zoomOut()
  return zoomToolsComponent
}