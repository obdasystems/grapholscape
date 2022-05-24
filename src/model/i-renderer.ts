export default interface Renderer {
  render: (container?: Element) => void
  centerOnElementById: (elementsId: string, zoom?: number) => void
  centerOnModelPosition: (x: number, y: number, zoom?: number) => void
  centerOnRenderedPosition: (x: number, y: number, zoom?: number) => void
  unselect: () => void
  fit: (padding: number) => void
  zoomIn: (level: number) => void
  zoomOut: (level: number) => void
}