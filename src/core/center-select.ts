import Lifecycle, { LifecycleEvent } from "../lifecycle"
import Ontology, { GrapholscapeState } from "../model"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import GrapholEntity, { EntityOccurrence } from "../model/graphol-elems/entity"
import GrapholElement from "../model/graphol-elems/graphol-element"
import GrapholNode, { isGrapholNode } from "../model/graphol-elems/node"

/**
 * Center the graph on a single element given its ID and its diagram's ID 
 * @param elementId The element's ID to center on
 * @param diagramId The diagram to which the element belongs
 * @param zoom 
 * @returns 
 */
export const centerOnElement = function (elementId: string, diagramId: number, zoom?: number) { centerSelectElement.call(this, elementId, diagramId, zoom, false) }

/**
 * Center the graph on a single element given its ID and its diagram's ID and select it
 * @param elementId The element's ID to center on
 * @param diagramId The diagram to which the element belongs
 * @param zoom 
 * @returns 
 */
export const selectElement = function (elementId: string, diagramId: number, zoom?: number) { centerSelectElement.call(this, elementId, diagramId, zoom, true) }

/**
 * Find an entity by its IRI in the ontology and center the graph on it
 * An entity can occur in multiple diagrams and even multiple times in
 * the same diagram.
 * If you don't specify a diagramId, the first occurrence will
 * be displayed.
 * If the diagram you specified has multiple occurrences, the first one
 * will be displayed and returned.
 * @param iri The IRI of the entity, in prefixed or full form 
 * (e.g.: prefix:remainer or fullNamespace/remained)
 * @param diagramId The diagram to which the entity belongs
 * @param zoom The level zoom to apply, if not specified, 
 * default value defined in GrapholscapeState will be used
 * @returns The entity that has been displayed if any, or null if it does not exists
 */
export const centerOnEntity = function (iri: string, diagramId?: number, zoom?: number) { centerSelectEntity.call(this, iri, diagramId, zoom, false) }

/**
 * Find an entity by its IRI in the ontology, center the graph on it
 * and also select it.
 * An entity can occur in multiple diagrams and even multiple times in
 * the same diagram.
 * If you don't specify a diagramId, the first occurrence will
 * be displayed.
 * If the diagram you specified has multiple occurrences, the first one
 * will be displayed and returned.
 * @param iri The IRI of the entity, in prefixed or full form 
 * (e.g.: prefix:remainer or fullNamespace/remained)
 * @param diagramId The diagram to which the entity belongs
 * @param zoom The level zoom to apply, if not specified, 
 * default value defined in GrapholscapeState will be used
 * @returns The entity that has been displayed if any, or null if it does not exists
 */
export const selectEntity = function (iri: string, diagramId?: number, zoom?: number) { centerSelectEntity.call(this, iri, diagramId, zoom, true) }

/**
 * Unselect the currently selected element
 */
export const unselect = function () {
  this.actualState.diagram.unselect()
  this.actualState.selectedElement = null
}


function centerSelectEntity(iri: string, diagramId?: number, zoom?: number, select?: boolean): GrapholEntity {
  const ontology: Ontology = this.actualState.ontology
  const grapholEntity = ontology.getEntity(iri)

  if (!grapholEntity) return null

  const entityOccurrence: EntityOccurrence = getFirstEntityOccurrence(grapholEntity, diagramId)

  if (!entityOccurrence) return null

  if (!diagramId) diagramId = entityOccurrence?.diagramId

  if (select) {
    this.selectElement(entityOccurrence.elementId, entityOccurrence.diagramId, zoom)
  } else
    this.centerOnElement(entityOccurrence.elementId, entityOccurrence.diagramId, zoom)

  if (select) {
    const lifecycle = this.lifecycle
    lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity)
  }

  return grapholEntity
}


function centerSelectElement(elementId: string, diagramId: number, zoom?: number, select?: boolean): GrapholElement {
  const actualState: GrapholscapeState = this.actualState

  const _zoom = zoom || actualState.focusedElementZoom

  const diagram = diagramId !== actualState.diagram.id ? actualState.ontology.getDiagram(diagramId) : actualState.diagram

  if (diagram) {
    const grapholElement = diagram.grapholElements.get(elementId)
    if (grapholElement) {
      this.showDiagram(diagramId)
      diagram.centerOnElementById(elementId, _zoom, select)

      if (select) {
        const lifecycle: Lifecycle = this.lifecycle

        if (isGrapholNode(grapholElement)) {
          lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
        } else if (isGrapholEdge(grapholElement)) {
          lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
        }
      }
      return grapholElement
    } else {
      console.warn(`Element id (${elementId}) not found in diagram ${diagram.name}`)
    }
  }
}


function getFirstEntityOccurrence(grapholEntity: GrapholEntity, diagramId: number) {
  let entityOccurrence: EntityOccurrence
  if (diagramId) {
    entityOccurrence = grapholEntity.getOccurrencesByDiagramId(diagramId)[0]
  } else {
    entityOccurrence = grapholEntity.occurrences[0]
  }

  if (!entityOccurrence) {
    console.warn(`Can't find any occurrence of the iri = "${grapholEntity.iri.prefixed}" in diagram "${diagramId}"`)
    return null
  }

  return entityOccurrence
}