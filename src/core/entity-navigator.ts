import { RendererStatesEnum, GrapholElement, Diagram } from "../model"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import { isGrapholNode } from "../model/graphol-elems/node"
import { LifecycleEvent } from "../model/lifecycle"
import Grapholscape from "./grapholscape"

/**
 * @internal
 */
export default class EntityNavigator {
  private _grapholscape: Grapholscape

  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }

  centerOnEntity(iri: string, diagramId?: number, zoom?: number) {
    this._centerSelectEntity(iri, diagramId, false, zoom)
  }

  selectEntity(iri: string, diagramId?: number, zoom?: number) {
    this._centerSelectEntity(iri, diagramId, true, zoom)
  }

  private _centerSelectEntity(iri: string, diagramId?: number, select = false, zoom?: number) {
    if (diagramId || diagramId === 0) {
      const entityOccurrence = this.getEntityOccurrenceInDiagram(iri, diagramId)

      if (entityOccurrence) {
        this._performCenterSelect(entityOccurrence, select, zoom)
      }
    }
    else {
      for (let diagram of this._grapholscape.ontology.diagrams) {
        const entityOccurrence = this.getEntityOccurrenceInDiagram(iri, diagram.id)

        if (entityOccurrence) {
          this._performCenterSelect(entityOccurrence, select, zoom)
          break
        }
      }
    }
  }

  private _performCenterSelect(grapholElement: GrapholElement, select?: boolean, zoom?: number) {

    if (this._grapholscape.diagramId !== grapholElement.diagramId) {
      this._grapholscape.showDiagram(grapholElement.diagramId)
    }

    this._grapholscape.renderer.centerOnElementById(grapholElement.id, zoom, select)

    if (select) {
      if (!grapholElement) return

      if (isGrapholNode(grapholElement)) {
        this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
      } else if (isGrapholEdge(grapholElement)) {
        this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
      }
    }
  }

  getEntityOccurrenceInDiagram(iri: string, diagramId: number) {
    if (!this._grapholscape.renderState)
      return

    const occurrences = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId)?.get(this._grapholscape.renderState)

    return occurrences ? occurrences[0] : undefined
  }

  updateEntitiesOccurrences() {
    if (!this._grapholscape.renderState || this._grapholscape.renderState === RendererStatesEnum.GRAPHOL)
      return

    this._grapholscape.ontology.diagrams.forEach(diagram => this.updateEntitiesOccurrencesFromDiagram(diagram))

    if (this._grapholscape.incremental?.diagram) {
      this.updateEntitiesOccurrencesFromDiagram(this._grapholscape.incremental.diagram)
    }
  }

  private updateEntitiesOccurrencesFromDiagram(diagram: Diagram) {
    diagram.representations.forEach((representation, rendererState) => {
      representation.cy?.$("[iri][!fake]").forEach(entityElement => {
        const grapholEntity = this._grapholscape.ontology.getEntity(entityElement.data('iri'))
        if (grapholEntity) {
          const grapholElement = representation.grapholElements.get(entityElement.id())
          if (grapholElement) {
            grapholEntity.addOccurrence(grapholElement, rendererState)
          }
        }
      })
    })
  }
}