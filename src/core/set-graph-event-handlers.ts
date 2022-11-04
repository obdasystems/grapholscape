import { Diagram, Lifecycle, LifecycleEvent, Ontology } from "../model"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import { isGrapholNode } from "../model/graphol-elems/node"

export default function setGraphEventHandlers(diagram: Diagram, lifecycle: Lifecycle, ontology: Ontology) {

  diagram.representations.forEach(diagramRepresentation => {
    const cy = diagramRepresentation.cy
    if (cy.scratch('_gscape-graph-handlers-set')) return

    cy.on('select', e => {
      const grapholElement = diagramRepresentation.grapholElements.get(e.target.id())
      if (grapholElement) {
        if (grapholElement.isEntity()) {
          const grapholEntity = ontology.getEntity(e.target.data().iri)
          if (grapholEntity) {
            lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity, grapholElement)
          }
        }
        
        if (isGrapholNode(grapholElement)) {
          lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
        }

        if (isGrapholEdge(grapholElement)) {
          lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
        }
      }
    })

    cy.on('tap', evt => {
      if (evt.target === cy) {
        lifecycle.trigger(LifecycleEvent.BackgroundClick)
      }
    })

    cy.on('mouseover', '*', e => {
      const container = cy.container()
      if (container) {
        container.style.cursor = 'pointer'
      }
    })

    cy.on('mouseout', '*', e => {
      const container = cy.container()
      if (container) {
        container.style.cursor = 'inherit'
      }
    })

    cy.scratch('_gscape-graph-handlers-set', true)
  })
}