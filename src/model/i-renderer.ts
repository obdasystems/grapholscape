interface Renderer {
  render: (container?: Element) => void
  showEntity: (iri: string, zoom?: number) => void
  selectEntity: (iri: string, zoom?: number) => void
  centerOnModelPosition: (x: number, y: number, zoom?: number) => void
  centerOnRederedPosition: (x:number, y: number, zoom?: number) => void
  unselect: () => void
  fit: (padding: number) => void
  zoomIn: (level: number) => void
  zommOut: (level: number) => void
}