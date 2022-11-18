import { NodeSingular, SingularElementReturnValue } from "cytoscape";
import { Grapholscape } from "../core";
import IncrementalRendererState from "../core/rendering/incremental/incremental-render-state";
import setGraphEventHandlers from "../core/set-graph-event-handlers";
import { DiagramRepresentation, EntityOccurrence, GrapholEdge, GrapholEntity, GrapholTypesEnum, IncrementalDiagram, isGrapholEdge, isGrapholNode, RendererStatesEnum } from "../model";
import { WidgetEnum } from "../ui";
import GscapeIncrementalMenu from "../ui/incremental-menu/incremental-menu";
import NeighbourhoodFinder from "./neighbourhood-finder";
import DiagramBuilder from "./diagram-builder";
import { vKGApiStub as vKGApi } from "./kg-api";
import { dataPropertyIcon } from "../ui/assets";

/**
 * Given a selected class compute the neighbourhood across all diagrams
 * and merge it all in the single incremental diagram
 * @param selectedElement 
 * @param grapholscape
 */
export function addClassNeighbourhood(selectedElement: SingularElementReturnValue, grapholscape: Grapholscape) {
  /**
   * Add neighbourhood of an entity occurrence to the incremental diagram
   * @param occurrence 
   */
  const processOccurrenceNeighbourhoods = (occurrence: EntityOccurrence) => {
    const floatyRepr = grapholscape.ontology.getDiagram(occurrence.diagramId).representations.get(RendererStatesEnum.FLOATY)
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
    const neighbourGrapholElement = floatyRepr.grapholElements.get(element.id()).clone()
    let neighbourGrapholEntity: GrapholEntity | undefined

    if (neighbourGrapholElement.isEntity()) {
      // Properties can be duplicated, classes instead must be unique
      if (
        (neighbourGrapholElement.is(GrapholTypesEnum.CLASS) || neighbourGrapholElement.is(GrapholTypesEnum.INDIVIDUAL)) &&
        incrementalDiagramRepresentation.cy.$(`[iri = "${element.data().iri}"]`).nonempty()
      ) {
        return
      }

      neighbourGrapholEntity = grapholscape.ontology.getEntity(element.data().iri)
    }
    /**
     * If it's an edge, must set source and target id to match occurrences in incremental diagram
     **/
    if (isGrapholEdge(neighbourGrapholElement)) {
      // if source and target are entities, we need to find their new IDs in the incremental diagram
      recomputeSourceTargetEntitiesIds(neighbourGrapholElement, floatyRepr, incrementalDiagramRepresentation, floatyDiagramId)
    }
    // make id unique adding the original diagram-id, we are sure there can't be two same IDs in the same diagram
    neighbourGrapholElement.id = `${neighbourGrapholElement.id}-${floatyDiagramId}`
    // Add new element to diagram
    incrementalDiagramRepresentation.addElement(neighbourGrapholElement, neighbourGrapholEntity)

    if (!neighbourGrapholElement.isEntity() && isGrapholNode(neighbourGrapholElement)) {
      processOccurrenceNeighbourhoods({ elementId: element.id(), diagramId: floatyDiagramId })
    }
  }

  const incrementalDiagramRepresentation = grapholscape
    .renderer
    .diagram
    .representations.get(RendererStatesEnum.INCREMENTAL)

  if (!incrementalDiagramRepresentation) return

  selectedElement.addClass('incremental-expanded-class')
  const expandedClasses = incrementalDiagramRepresentation.cy.$('.incremental-expanded-class')
  let elementsToRemove = incrementalDiagramRepresentation.
    cy.elements().difference(expandedClasses.union(expandedClasses.edgesTo(expandedClasses)))

  /**
   * Union nodes with the superclass of the union, must not be removed if
   * there is a path between two expanded classes through a union.
   */
  incrementalDiagramRepresentation.cy.nodes('[!iri]').forEach(unionNode => {
    if (unionNode.edgesWith(expandedClasses).size() >= 2) {
      elementsToRemove = elementsToRemove
        .difference(unionNode.union(unionNode.edgesWith(expandedClasses)))
        .difference(getUnionSuperClass(unionNode))
    }
  })

  elementsToRemove.forEach(element => {
    (grapholscape.renderer.renderState as IncrementalRendererState).unpinNode(element)
    incrementalDiagramRepresentation.removeElement(element.id())
  })
  const grapholElement = incrementalDiagramRepresentation.grapholElements.get(selectedElement.id())

  if (grapholElement.isEntity() && grapholElement.is(GrapholTypesEnum.CLASS)) {
    const grapholEntity = grapholscape.ontology.getEntity(selectedElement.data().iri)

    // Get all occurrences for the selected entity + replicated occurrences in floaty
    const occurrences = JSON.parse(JSON.stringify(grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)))
    const floatyOccurrences = grapholEntity.occurrences.get(RendererStatesEnum.FLOATY)
    if (floatyOccurrences) {
      occurrences.push(JSON.parse(JSON.stringify(floatyOccurrences)))
    }

    occurrences.forEach((occurrence: EntityOccurrence) => processOccurrenceNeighbourhoods(occurrence))
  }
}

function recomputeSourceTargetEntitiesIds(
  edge: GrapholEdge,
  floatyDiagramRepresentation: DiagramRepresentation,
  incrementalDiagramRepresentation: DiagramRepresentation,
  floatyDiagramId: number,
) {

  const source = floatyDiagramRepresentation.grapholElements.get(edge.sourceId)
  const target = floatyDiagramRepresentation.grapholElements.get(edge.targetId)

  if (source && target) {
    if (source.isEntity()) {
      const sourceIri = floatyDiagramRepresentation.cy.$id(edge.sourceId).data().iri
      const sourceInIncremental = incrementalDiagramRepresentation.cy.$(`[ iri = "${sourceIri}"]`).first()
      edge.sourceId = sourceInIncremental.id()
    } else {
      // Source surely changed its IDs adding diagram id
      edge.sourceId = `${edge.sourceId}-${floatyDiagramId}`
    }

    if (target.isEntity()) {
      const targetIri = floatyDiagramRepresentation.cy.$id(edge.targetId).data().iri
      const targetInIncremental = incrementalDiagramRepresentation.cy.$(`[ iri = "${targetIri}"]`).first()
      edge.targetId = targetInIncremental.id()
    } else {
      // Target surely changed its IDs adding diagram id
      edge.targetId = `${edge.targetId}-${floatyDiagramId}`
    }
  }
}

export function addFirstClassInIncremental(iri: string, grapholscape: Grapholscape) {
  // const grapholEntity = grapholscape.ontology.getEntity(iri)
  // const entityOccurrence = grapholscape.ontology.getEntityOccurrences(iri).get(RendererStatesEnum.GRAPHOL)[0]
  // const floatyDiagramRepresentation = grapholscape.ontology.getDiagram(entityOccurrence.diagramId).representations.get(RendererStatesEnum.FLOATY)
  // const grapholElement = floatyDiagramRepresentation.grapholElements.get(entityOccurrence.elementId).clone()
  // grapholElement.id = `${grapholElement.id}-${entityOccurrence.diagramId}`
  // incrementalDiagramRepresentation.addElement(grapholElement, grapholEntity);
  // (grapholscape.renderer.renderState as IncrementalRendererState).pinNode(incrementalDiagramRepresentation.cy.$id(grapholElement.id))
  //addClassNeighbourhood(incrementalDiagramRepresentation.cy.$id(grapholElement.id), grapholscape)
  const diagramBuilder = new DiagramBuilder(grapholscape.ontology, grapholscape.renderer.diagram as IncrementalDiagram)
  diagramBuilder.addEntity(iri)
  grapholscape.renderer.renderState.runLayout()
}

export function initIncremental(incrementalRendererState: IncrementalRendererState, grapholscape: Grapholscape) {
  const neighbourhoodFinder = new NeighbourhoodFinder(grapholscape.ontology)
  const diagramBuilder = new DiagramBuilder(grapholscape.ontology, incrementalRendererState.incrementalDiagram)

  incrementalRendererState.onEntityExpansion((selectedElement) => {
    //addClassNeighbourhood(selectedElement, grapholscape)
    incrementalRendererState.runLayout()
  })

  incrementalRendererState.onContextClick(target => {
    const targetIri = target.data().iri
    diagramBuilder.diagram = incrementalRendererState.incrementalDiagram
    diagramBuilder.referenceNodeId = target.id()
    const incrementalMenu = grapholscape.widgets.get(WidgetEnum.INCREMENTAL_MENU) as GscapeIncrementalMenu

    if (incrementalMenu) {
      const dataProperties = neighbourhoodFinder.getDataProperties(targetIri)
      incrementalMenu.showDataPropertyToggle = dataProperties.length > 0
      // check if data properties are shown
      if (dataProperties.length > 0) {
        incrementalMenu.dataPropertyEnabled = target.neighborhood(`[iri = "${dataProperties[0].iri.fullIri}"]`).nonempty()
        incrementalMenu.onDataPropertyToggle = (enabled) => {
          if (enabled) {
            dataProperties.forEach(dataProperty => diagramBuilder.addEntity(dataProperty.iri.fullIri))
          } else {
            dataProperties.forEach(dataProperty => diagramBuilder.removeEntity(dataProperty.iri.fullIri))
          }

          if (dataProperties.length > 0)
            incrementalRendererState.runLayout()
        }
      }


      const suggestedObjectProperties = neighbourhoodFinder.getObjectProperties(targetIri)
      incrementalMenu.objectProperties = Array.from(suggestedObjectProperties).map(v => {
        return {
          objectPropertyIri: v[0].iri.prefixed,
          classesIris: v[1].connectedClasses.map(c => c.iri.prefixed)
        }
      })

      incrementalMenu.attachTo((target as any).popperRef())
      incrementalMenu.onEntitySelection = (entityIri, objectPropertyIri) => {
        if (objectPropertyIri) {
          const objectPropertyEntity = grapholscape.ontology.getEntity(objectPropertyIri)
          const direct = suggestedObjectProperties.get(objectPropertyEntity).direct
          diagramBuilder.addEntity(objectPropertyIri, entityIri, direct)
        }
        else {
          diagramBuilder.addEntity(entityIri)
        }

        incrementalRendererState.runLayout()
      }

      incrementalMenu.onInstanceSelection = (instanceIri) => {
        diagramBuilder.addClassInstance(instanceIri)
        incrementalRendererState.runLayout()
      }

      incrementalMenu.onShowInstances = () => {
        incrementalMenu.instances = vKGApi.getInstances(targetIri).map(classInstance => {
          return classInstance.label || classInstance.iri
        })
      }

      incrementalMenu.onShowSuperClasses = () => {
        // neighbourhoodFinder.getSuperClassesHierarchies(targetIri).forEach(superClassHierarchy => {
        //   if (isHierarchy(superClassHierarchy)) {
        //     diagramBuilder.addHierarchy(superClassHierarchy)
        //   } else {
        //     diagramBuilder.addClassInIsa(superClassHierarchy)
        //   }
        // })

        grapholscape.ontology.hierarchiesBySubclassMap.get(targetIri)?.forEach(hierarchy => {
          diagramBuilder.addHierarchy(hierarchy)
        })

        incrementalRendererState.runLayout()
      }

      incrementalMenu.onHideSuperClasses = () => {
        grapholscape.ontology.hierarchiesBySubclassMap.get(targetIri)?.forEach(hierarchy => {
          diagramBuilder.removeHierarchy(hierarchy, [targetIri])
        })
      }
    }
  })

  setGraphEventHandlers(incrementalRendererState.incrementalDiagram, grapholscape.lifecycle, grapholscape.ontology)
}

function getUnionSuperClass(unionNode: NodeSingular) {
  const unionEdge = unionNode.connectedEdges(`[type = "${GrapholTypesEnum.UNION}"],[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`).first()

  return unionEdge.union(unionEdge.target())
}