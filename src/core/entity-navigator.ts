import { LifecycleEvent } from "../model/lifecycle"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import { isGrapholNode } from "../model/graphol-elems/node"
import Grapholscape from "./grapholscape"
import { Diagram, DiagramRepresentation, RenderStatesEnum } from "../model"
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
    const occurrencesMap = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId)

    const grapholOccurrences = occurrencesMap.get(RenderStatesEnum.GRAPHOL)
    // if no graphol occurrence, then cannot appear in any representation
    if (!grapholOccurrences || grapholOccurrences.length <= 0) return

    const diagram = this._grapholscape.ontology.getDiagram(grapholOccurrences[0].diagramId)
    const actualDiagramRepresentation = diagram.representations.get(this._grapholscape.renderState)

    // Search any original graphol occurrence in the actual representation
    for (let grapholOccurrence of grapholOccurrences) {
      if (actualDiagramRepresentation?.grapholElements.has(grapholOccurrence.elementId)) {
        this._performCenterSelect(grapholOccurrence, select, zoom)
        return
      }
    }

    // The original graphol occurrence may not be present in a new representation
    // Find first replicated occurrence
    const replicatedOccurrences = occurrencesMap.get(this._grapholscape.renderState)

    if (replicatedOccurrences && replicatedOccurrences.length > 0) {
      this._performCenterSelect(replicatedOccurrences[0], select, zoom)
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

  updateEntitiesOccurrences() {
    for (let [id, representation] of this._grapholscape.renderer.diagram.representations) {
      if (id === RenderStatesEnum.GRAPHOL) continue

      const replicatedElements = representation.cy.$("[originalId]")

      for (let entity of this._grapholscape.ontology.entities.values()) {
        const originalOccurrences = entity.getOccurrencesByDiagramId(this._grapholscape.diagramId).get(RenderStatesEnum.GRAPHOL)

        originalOccurrences?.forEach(occurrence => {
          const newOccurrences = replicatedElements.filter(elem =>
            representation.grapholElements.get(elem.id())?.originalId === occurrence.elementId
          )

          if (!newOccurrences.empty()) {
            newOccurrences.forEach(newOccurrence => {
              entity.addOccurrence(newOccurrence.id(), occurrence.diagramId, id)
            })
          }

        })
      }
    }
  }

  setGraphEventHandlers(diagram: Diagram) {

    diagram.representations.forEach(diagramRepresentation => {
      if (diagramRepresentation.hasEverBeenRendered) return

      const cy = diagramRepresentation.cy
      
      cy.on('select', e => {
        const grapholElement = diagramRepresentation.grapholElements.get(e.target.id())
        
        if (grapholElement) {
          if (grapholElement.isEntity()) {
            const grapholEntity = this._grapholscape.ontology.getEntity(e.target.data().iri)
            if (grapholEntity) {
              this._grapholscape.lifecycle.trigger(LifecycleEvent.EntitySelection, grapholEntity, grapholElement)
            }
          } else {
            if (isGrapholNode(grapholElement)) {
              this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
            }

            if (isGrapholEdge(grapholElement)) {
              this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
            }
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
    })
  }
}