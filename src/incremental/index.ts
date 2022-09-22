import { SingularElementReturnValue } from "cytoscape";
import IncrementalRendererState from "../core/rendering/incremental/incremental-render-state";
import { DiagramRepresentation, EntityOccurrence, GrapholEntity, GrapholTypesEnum, Ontology, RendererStatesEnum } from "../model";
import GrapholEdge, { isGrapholEdge } from "../model/graphol-elems/edge";
import { isGrapholNode } from "../model/graphol-elems/node";

/**
 * Given a selected class compute the neighbourhood across all diagrams
 * and merge it all in the single incremental diagram
 * @param selectedElement 
 * @param ontology 
 * @param rendererState 
 */
export function addClassNeighbourhood(selectedElement: SingularElementReturnValue, ontology: Ontology, rendererState: IncrementalRendererState) {
  /**
   * Add neighbourhood of an entity occurrence to the incremental diagram
   * @param occurrence 
   */
  const processOccurrenceNeighbourhoods = (occurrence: EntityOccurrence) => {
    const floatyRepr = ontology.getDiagram(occurrence.diagramId).representations.get(RendererStatesEnum.FLOATY)
    const cyElement = floatyRepr.cy.$id(occurrence.elementId)

    /**
     * First all nodes, cause we need to know all nodes available before adding edges.
     * Otherwise we might try to add an edge between two nodes that are not yet present in
     * the diagram leading to an exception from cytoscape.
     */ 
    cyElement.openNeighborhood('node').forEach(element => addElementFromFloatyToIncremental(element, floatyRepr, occurrence.diagramId))
    cyElement.openNeighborhood('edge').forEach(element => addElementFromFloatyToIncremental(element, floatyRepr, occurrence.diagramId))
  }

  /**
   * Function adding a single element to incremental diagram.
   * If element is not an entity then add also its neighbourhood (i.e. hierarchies!)
   * @param element 
   * @param floatyRepr 
   * @param floatyDiagramId
   */
  const addElementFromFloatyToIncremental = (element: SingularElementReturnValue, floatyRepr: DiagramRepresentation, floatyDiagramId: number) => {
    const neighbourGrapholElement = floatyRepr.grapholElements.get(element.id())
    let neighbourGrapholEntity: GrapholEntity | undefined


    if (neighbourGrapholElement.isEntity()) {
      if (rendererState.diagramRepresentation.cy.$(`[iri = "${element.data().iri}"]`).nonempty()) {
        return
      }
      neighbourGrapholEntity = ontology.getEntity(element.data().iri)
    } 
    /**
     * If it's an edge, must set source and target id to match occurrences in incremental diagram
     **/
    if (isGrapholEdge(neighbourGrapholElement)) {
      // if (neighbourGrapholElement.targetId === occurrence.elementId) {
      //   neighbourGrapholElement.targetId = incrementalDiagramOccurrenceId
      // } else {
      //   neighbourGrapholElement.sourceId = incrementalDiagramOccurrenceId
      // }
      recomputeSourceTargetEntitiesIds(neighbourGrapholElement, floatyRepr, rendererState.diagramRepresentation)
    }
    
    // Add new element to diagram
    rendererState.diagramRepresentation.addElement(neighbourGrapholElement, neighbourGrapholEntity)


    if (!neighbourGrapholElement.isEntity() && isGrapholNode(neighbourGrapholElement)) {
      processOccurrenceNeighbourhoods({ elementId: neighbourGrapholElement.id, diagramId: floatyDiagramId })
    }
  }

  const grapholElement = rendererState.diagramRepresentation.grapholElements.get(selectedElement.id())

  if (grapholElement.isEntity() && grapholElement.is(GrapholTypesEnum.CLASS)) {
    const grapholEntity = ontology.getEntity(selectedElement.data().iri)

    // Get all occurrences for the selected entity + replicated occurrences in floaty
    const occurrences = JSON.parse(JSON.stringify(grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)))
    const floatyOccurrences = grapholEntity.occurrences.get(RendererStatesEnum.FLOATY)
    if (floatyOccurrences) {
      occurrences.push(JSON.parse(JSON.stringify(floatyOccurrences)))
    }

    occurrences.forEach((occurrence: EntityOccurrence) => processOccurrenceNeighbourhoods(occurrence))

    rendererState.runLayout()
  }
}

function recomputeSourceTargetEntitiesIds(
  edge: GrapholEdge,
  floatyDiagramRepresentation: DiagramRepresentation,
  incrementalDiagramRepresentation: DiagramRepresentation
) {

  const source = floatyDiagramRepresentation.grapholElements.get(edge.sourceId)
  const target = floatyDiagramRepresentation.grapholElements.get(edge.targetId)

  if (source && target) {
    if (source.isEntity()) {
      const sourceIri = floatyDiagramRepresentation.cy.$id(edge.sourceId).data().iri
      const sourceInIncremental = incrementalDiagramRepresentation.cy.$(`[ iri = "${sourceIri}"]`).first()
      edge.sourceId = sourceInIncremental.id()
    }

    if (target.isEntity()) {
      const targetIri = floatyDiagramRepresentation.cy.$id(edge.targetId).data().iri
      const targetInIncremental = incrementalDiagramRepresentation.cy.$(`[ iri = "${targetIri}"]`).first()
      edge.targetId = targetInIncremental.id()
    }
  }
}
