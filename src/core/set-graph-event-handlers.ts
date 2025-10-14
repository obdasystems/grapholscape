import { Collection, EventObject, NodeSingular } from "cytoscape"
import { Diagram, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Lifecycle, LifecycleEvent, MultipleSelectionEventDetail, Ontology } from "../model"

export default function setGraphEventHandlers(diagram: Diagram, lifecycle: Lifecycle, ontology: Ontology) {

  diagram.representations.forEach(diagramRepresentation => {
    const cy = diagramRepresentation.cy
    if (cy.scratch('_gscape-graph-handlers-set')) return
    let timeout: number | NodeJS.Timeout = setTimeout(() => { }, 100)
    let selection: Collection = cy.collection()
    cy.on('tap box', _evt => {
      if (_evt.type === 'tap' && _evt.target === cy) {
        lifecycle.trigger(LifecycleEvent.BackgroundClick)
        return
      }
      if (_evt.type === 'box') {
        selection.merge(_evt.target)
      } else {
        selection = _evt.originalEvent?.ctrlKey ? cy.$(':selected').union(_evt.target) : _evt.target
      }
      clearTimeout(timeout)

      timeout = setTimeout((evt: EventObject, selectedElements: Collection) => {
        if (!evt.type.startsWith('box')) {
          cy.nodes().difference(selectedElements).forEach(n => {
            if (selectedElements.nodes().some((elem: NodeSingular) => {
              const d = Math.sqrt(
                Math.pow(Number(n.renderedPosition('x')) - Number(elem.renderedPosition('x')), 2) +
                Math.pow(Number(n.renderedPosition('y')) - Number(elem.renderedPosition('y')), 2)
              )

              return d < (50 * cy.zoom())
            })) {
              selectedElements = selectedElements.union(n)
            }
          })
        }
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
        const entitiesSet = new Set<string>()
        selectedElements.forEach(cyElem => {
          const grapholElement = diagramRepresentation.grapholElements.get(cyElem.id())
          if (grapholElement) {
            if (grapholElement.isNode()) {
              eventDetail.elements.nodes.push(grapholElement)
            } else if (grapholElement.isEdge()) {
              eventDetail.elements.edges.push(grapholElement)
            }

            if (grapholElement.isEntity() && !entitiesSet.has(grapholElement.iri)) {
              const grapholEntity = ontology.getEntity(grapholElement.iri) || (
                ontology.ontologyEntity?.iri.equals(grapholElement.iri) && ontology.ontologyEntity
              )

              if (grapholEntity) {
                eventDetail.entities.push({ entity: grapholEntity, grapholElement })
                entitiesSet.add(grapholEntity.iri.fullIri)
                if (evt.target === cyElem) {
                  eventDetail.target = grapholElement
                }
              }
            }

          }
        })

        if (!eventDetail.target) {
          eventDetail.target = eventDetail.entities[0]?.grapholElement
        }

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

        selection = cy.collection()
      }, 100, ...[_evt, selection])
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