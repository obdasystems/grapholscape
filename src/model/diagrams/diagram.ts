import { Position } from 'cytoscape'
import GrapholEntity from '../graphol-elems/entity'
import GrapholElement from '../graphol-elems/graphol-element'
import { RendererStatesEnum } from '../renderers/i-render-state'
import DiagramRepresentation from './diagram-representation'
import Iri from '../iri'
import { Diagram as IDiagram } from '../rdf-graph/swagger'
export type ViewportState = {
  pan: Position,
  zoom: number,
}

/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 */
class Diagram implements IDiagram {
  name: string
  id: number
  representations: Map<RendererStatesEnum, DiagramRepresentation> = new Map([[RendererStatesEnum.GRAPHOL, new DiagramRepresentation()]])
  lastViewportState: ViewportState

  /**
   * @param {string} name
   * @param {number} id
   */
  constructor(name: string, id: number) {
    this.name = name
    this.id = id
    this.representations.set(RendererStatesEnum.GRAPHOL, new DiagramRepresentation())
  }

  /**
   * Add a new element (node or edge) to the diagram's representation
   * @param newElement the GrapholElement to add to the diagram
   */
  addElement(newElement: GrapholElement, grapholEntity?: GrapholEntity) {
    this.representations.get(RendererStatesEnum.GRAPHOL)?.addElement(newElement, grapholEntity)
  }

  /**
   * Delete every element from a diagram
   * @param rendererState optional, if you pass a particular rendererState, only its representation will be cleared.
   * If you don't pass any rendererState, all representations will be cleared
   */
  clear(rendererState?: RendererStatesEnum) {
    rendererState
      ? this.representations.get(rendererState)?.clear()
      : this.representations.forEach(r => r.clear())
  }

  containsEntity(iriOrGrapholEntity: Iri | GrapholEntity, rendererState: RendererStatesEnum) {
    return this.representations.get(rendererState)?.containsEntity(iriOrGrapholEntity)
  }
}

export default Diagram
