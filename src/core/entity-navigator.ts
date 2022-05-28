import { LifecycleEvent } from "../model/lifecycle"
import { isGrapholEdge } from "../model/graphol-elems/edge"
import { isGrapholNode } from "../model/graphol-elems/node"
import Grapholscape from "./grapholscape"

export default class EntityNavigator {
  private _grapholscape: Grapholscape

  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }


  centerOnEntity = (iri: string, diagramId?: number, zoom?: number) => {
    this._centerSelectEntity(iri, diagramId, false, zoom)
  }

  selectEntity(iri: string, diagramId?: number, zoom?: number) {
    this._centerSelectEntity(iri, diagramId, true, zoom)
  }

  private _centerSelectEntity(iri: string, diagramId?: number, select = false, zoom?: number) {
    const occurrences = this._grapholscape.ontology.getEntityOccurrences(iri, diagramId, this._grapholscape.renderState)

    if (occurrences && occurrences.length > 0) {
      const occurrence = occurrences[0]

      if (this._grapholscape.diagramId !== occurrence.diagramId) {
        this._grapholscape.showDiagram(diagramId)
      }

      this._grapholscape.renderer.centerOnElementById(occurrence.elementId, zoom, select)

      if (select) {
        const grapholElement = this._grapholscape.ontology.getGrapholElement(
          occurrence.elementId,
          occurrence.diagramId,
          this._grapholscape.renderState
        )

        if (isGrapholNode(grapholElement)) {
          this._grapholscape.lifecycle.trigger(LifecycleEvent.NodeSelection, grapholElement)
        } else if (isGrapholEdge(grapholElement)) {
          this._grapholscape.lifecycle.trigger(LifecycleEvent.EdgeSelection, grapholElement)
        }
      }
    }
  }
}