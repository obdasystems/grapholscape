export function zoomIn(zoomValue: number) {
  const diagram = this.actualState.diagram
  diagram.cy.zoom({
    level: this.cy.zoom() + zoomValue,
    renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
  })
}

export function zoomOut(zoomValue: number) {
  const diagram = this.actualState.diagram
  diagram.cy.zoom({
    level: this.cy.zoom() - zoomValue,
    renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
  })
}