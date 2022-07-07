import { LifecycleEvent } from "../model/lifecycle"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import { isGrapholNode } from "../model/graphol-elems/node"
import Grapholscape from "./grapholscape"
import { Diagram, DiagramRepresentation, RendererStatesEnum } from "../model"
import { EntityOccurrence } from "../model/graphol-elems/entity"

export default class EntityNavigator {
  private _grapholscape: Grapholscape

  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }


  centerOnEntity = (iri: string, diagramId?: number, zoom?: number) => {
    this._centerSelectEntity(iri, diagramId, false, zoom)
  }

  selectEntity = (iri: string, diagramId?: number, zoom?: number) => {
    this._centerSelectEntity(iri, diagramId, true, zoom)
  }

  private _centerSelectEntity(iri: string, diagramId?: number, select = false, zoom?: number) {
    diagramId = diagramId || this._grapholscape.diagramId
    if (diagramId) {
      const entityOccurrence = this.getEntityOccurrenceInDiagram(iri, diagramId)

      if (entityOccurrence) {
        this._performCenterSelect(entityOccurrence, select, zoom)
      }
    }
  }

  private _performCenterSelect(occurrence: EntityOccurrence, select?: boolean, zoom?: number) {

    if (this._grapholscape.diagramId !== occurrence.diagramId) {
      this._grapholscape.showDiagram(occurrence.diagramId)
    }

    this._grapholscape.renderer.centerOnElementById(occurrence.elementId, zoom, select)

    if (select) {
      const grapholElement = this._grapholscape.ontology.getGrapholElement(
        occurrence.elementId,
        occurrence.diagramId,
        this._grapholscape.renderState
      )

      if (!grapholElement) return

      if (isGrapholNode(grapholElement)) {
        this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
      } else if (isGrapholEdge(grapholElement)) {
        this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
      }
    }
  }

  getEntityOccurrenceInDiagram(iri: string, diagramId: number) {
    const occurrencesMap = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId)

    if (!occurrencesMap) return

    const grapholOccurrences = occurrencesMap.get(RendererStatesEnum.GRAPHOL)
    // if no graphol occurrence, then cannot appear in any representation
    if (!grapholOccurrences || grapholOccurrences.length <= 0) return

    const diagram = this._grapholscape.ontology.getDiagram(diagramId)

    if (!diagram) return

    const actualDiagramRepresentation = diagram.representations.get(this._grapholscape.renderState)

    // Search any original graphol occurrence in the actual representation
    for (let grapholOccurrence of grapholOccurrences) {
      if (actualDiagramRepresentation?.grapholElements.has(grapholOccurrence.elementId)) {
        return grapholOccurrence
      }
    }

    // The original graphol occurrence may not be present in a new representation
    // Find first replicated occurrence
    const replicatedOccurrences = occurrencesMap.get(this._grapholscape.renderState)

    if (replicatedOccurrences && replicatedOccurrences.length > 0) {
      return replicatedOccurrences[0]
    }
  }

  updateEntitiesOccurrences() {
    if (this._grapholscape.renderState === RendererStatesEnum.GRAPHOL)
      return

    this._grapholscape.ontology.diagrams.forEach(diagram => {
      // const diagram = this._grapholscape.renderer.diagram
      const replicatedElements = diagram.representations.get(this._grapholscape.renderState)?.cy?.$("[originalId]")

      if (replicatedElements && !replicatedElements.empty()) {
        replicatedElements.forEach(replicatedElement => {
          const grapholEntity = this._grapholscape.ontology.getEntity(replicatedElement.data('iri'))

          if (grapholEntity) {
            grapholEntity.getOccurrencesByDiagramId(diagram.id, this._grapholscape.renderState)
            replicatedElement.data('iri', grapholEntity.iri.fullIri)
            grapholEntity.addOccurrence(replicatedElement.id(), diagram.id, this._grapholscape.renderState)
          }
        })
      }
    })
  }

  setGraphEventHandlers(diagram: Diagram) {

    diagram.representations.forEach(diagramRepresentation => {
      const cy = diagramRepresentation.cy
      if (cy.scratch('_gscape-graph-handlers-set')) return

      cy.on('select', e => {
        const grapholElement = diagramRepresentation.grapholElements.get(e.target.id())
        if (grapholElement) {
          if (grapholElement.isEntity()) {
            const grapholEntity = this._grapholscape.ontology.getEntity(e.target.data().iri)
            if (grapholEntity) {
              this._grapholscape.lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity, grapholElement)
            }
          }
          
          if (isGrapholNode(grapholElement)) {
            this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
          }

          if (isGrapholEdge(grapholElement)) {
            this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
          }
        }
      })

      cy.on('tap', evt => {
        if (evt.target === cy) {
          this._grapholscape.lifecycle.trigger(LifecycleEvent.BackgroundClick)
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
}