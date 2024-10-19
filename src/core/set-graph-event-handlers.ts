import { Diagram, Lifecycle, LifecycleEvent, Ontology, TypesEnum } from "../model"
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
          const grapholEntity = ontology.getEntity(e.target.data().iri) || (
            ontology.ontologyEntity?.iri.equals(e.target.data().iri) && ontology.ontologyEntity
          )
          if (grapholEntity) {
            lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity, grapholElement)
          }
        }
        
        if (grapholElement.isNode()) {
          lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
        }

        if (grapholElement.isEdge()) {
          lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
        }
      }
    })

    cy.on('tap', evt => {
      if (evt.target === cy) {
        lifecycle.trigger(LifecycleEvent.BackgroundClick)
      }
    })

    cy.on('cxttap', evt => lifecycle.trigger(LifecycleEvent.ContextClick, evt))

    cy.on('dbltap', evt => lifecycle.trigger(LifecycleEvent.DoubleTap, evt))

    cy.on('mouseover', '*', e => {
      const container = cy.container()
      if (container) {
        container.style.cursor = 'pointer'
      }
    })

    cy.on('mouseover', evt => lifecycle.trigger(LifecycleEvent.MouseOver, evt))

    cy.on('mouseout', '*', e => {
      const container = cy.container()
      if (container) {
        container.style.cursor = 'inherit'
      }
    })

    cy.on('mouseout', evt => lifecycle.trigger(LifecycleEvent.MouseOut, evt))

    cy.scratch('_gscape-graph-handlers-set', true)
  })
}