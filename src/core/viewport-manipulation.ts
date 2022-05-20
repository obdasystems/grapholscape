import { Diagram } from "../model"

export const zoomIn = function (zoomValue: number) {
  const diagram: Diagram = this.actualState.diagram
  diagram.cy.zoom({
    level: this.cy.zoom() + zoomValue,
    renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
  })
}

export const zoomOut = function (zoomValue: number) {
  const diagram: Diagram = this.actualState.diagram
  diagram.cy.zoom({
    level: this.cy.zoom() - zoomValue,
    renderedPosition: { x: this.cy.width() / 2, y: this.cy.height() / 2 }
  })
}