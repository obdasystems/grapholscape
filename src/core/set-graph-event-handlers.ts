import { Diagram, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Lifecycle, LifecycleEvent, MultipleSelectionEventDetail, Ontology } from "../model"

export default function setGraphEventHandlers(diagram: Diagram, lifecycle: Lifecycle, ontology: Ontology) {

  diagram.representations.forEach(diagramRepresentation => {
    const cy = diagramRepresentation.cy
    if (cy.scratch('_gscape-graph-handlers-set')) return

    // cy.on('box', () => console.log(cy.$(':selected')))
    cy.on('select box', e => {
      const selectedElements = cy.$(':selected').union(e.target)
      const eventDetail: MultipleSelectionEventDetail = {
        elements: {
          nodes: [] as GrapholNode[],
          edges: [] as GrapholEdge[],
        },
        entities: [] as {
          grapholElement: GrapholElement,
          entity: GrapholEntity,
        }[],
      }
      selectedElements.forEach(cyElem => {
        const grapholElement = diagramRepresentation.grapholElements.get(cyElem.id())
        if (grapholElement) {
          if (grapholElement.isNode()) {
            eventDetail.elements.nodes.push(grapholElement)
          } else if (grapholElement.isEdge()) {
            eventDetail.elements.edges.push(grapholElement)
          }

          if (grapholElement.isEntity()) {
            const grapholEntity = ontology.getEntity(grapholElement.iri) || (
              ontology.ontologyEntity?.iri.equals(grapholElement.iri) && ontology.ontologyEntity
            )

            if (grapholEntity) {
              eventDetail.entities.push({ entity: grapholEntity, grapholElement })
            }
          }
        }
      })

      if (eventDetail.elements.nodes.length + eventDetail.elements.edges.length === 1) {
        if (eventDetail.entities.length === 1) {
          lifecycle.trigger(LifecycleEvent.EntitySelection, eventDetail.entities[0].entity, eventDetail.entities[0].grapholElement)
        }

        if (eventDetail.elements.nodes.length === 1) {
          lifecycle.trigger(LifecycleEvent.NodeSelection, eventDetail.elements.nodes[0])
        }
        
        if (eventDetail.elements.edges.length === 1) {
          lifecycle.trigger(LifecycleEvent.EdgeSelection, eventDetail.elements.edges[0])
        }
      } else {
        lifecycle.trigger(LifecycleEvent.MultipleSelection, eventDetail)
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