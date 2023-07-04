import cytoscape, { Position } from "cytoscape";
import { EntityNameType } from "../config";
import { ClassInstanceEntity, GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, IncrementalDiagram, isGrapholNode, RendererStatesEnum, Shape } from "../model";

export default class DiagramBuilder {
  /** The class to which new entities/instances will be connected */

  constructor(public diagram: IncrementalDiagram) { }

  // addEntity(objectProperty: GrapholEntity, sourceEntity: GrapholEntity, targetEntity: GrapholEntity): void
  // addEntity(grapholEntity: GrapholEntity): void
  // addEntity(grapholEntity: GrapholEntity, sourceEntity?: GrapholEntity, targetEntity?: GrapholEntity): void {
  //   switch (grapholEntity.type) {
  //     case GrapholTypesEnum.DATA_PROPERTY:
  //       if (sourceEntity)
  //         this.addDataProperty(grapholEntity, sourceEntity)
  //       break

  //     case GrapholTypesEnum.OBJECT_PROPERTY:
  //       if (sourceEntity && targetEntity)
  //         this.addObjectProperty(grapholEntity, sourceEntity, targetEntity)
  //       break

  //     case GrapholTypesEnum.CLASS:
  //       if (!this.diagram.containsEntity(grapholEntity))
  //         this.addClass(grapholEntity)
  //       break

  //     case GrapholTypesEnum.CLASS_INSTANCE:
  //       if (!this.diagram.containsEntity(grapholEntity))
  //         this.addClassInstance(grapholEntity as ClassInstanceEntity)

  //   }
  // }

  addClass(classEntity: GrapholEntity, position?: Position) {
    if (this.diagramRepresentation?.grapholElements.get(classEntity.iri.fullIri))
      return

    const classNode = new GrapholNode(`${classEntity.iri.fullIri}-${GrapholTypesEnum.CLASS}`, GrapholTypesEnum.CLASS)
    classNode.iri = classEntity.iri.fullIri
    classNode.displayedName = classEntity.getDisplayedName(EntityNameType.LABEL)
    classNode.height = classNode.width = 80
    classNode.position = position || { x: 0, y: 0 }
    classNode.originalId = classEntity.getEntityOriginalNodeId()
    classNode.diagramId = this.diagram.id

    classEntity.addOccurrence(classNode, RendererStatesEnum.INCREMENTAL)

    this.diagram.addElement(classNode, classEntity)
  }

  addDataProperty(dataPropertyEntity: GrapholEntity, ownerEntity: GrapholEntity) {

    const dataPropertyNode = new GrapholNode(`${dataPropertyEntity.iri.fullIri}-${GrapholTypesEnum.DATA_PROPERTY}`, GrapholTypesEnum.DATA_PROPERTY)
    const ownerEntityNode = this.diagramRepresentation?.grapholElements.get(ownerEntity.iri.fullIri)
    if (!dataPropertyNode || !ownerEntityNode) return

    dataPropertyNode.id = dataPropertyEntity.iri.fullIri
    if (isGrapholNode(ownerEntityNode)) {
      dataPropertyNode.position = ownerEntityNode.position
    }
    
    dataPropertyNode.originalId = dataPropertyEntity.getEntityOriginalNodeId()

    const dataPropertyEdge = new GrapholEdge(`${ownerEntityNode.id}-${dataPropertyNode.id}`, GrapholTypesEnum.DATA_PROPERTY)
    dataPropertyEdge.sourceId = ownerEntityNode.id
    dataPropertyEdge.targetId = dataPropertyNode.id

    this.diagram.addElement(dataPropertyNode, dataPropertyEntity)
    this.diagram.addElement(dataPropertyEdge)
  }

  addObjectProperty(
    objectPropertyEntity: GrapholEntity,
    sourceEntity: GrapholEntity,
    targetEntity: GrapholEntity,
    nodesType: GrapholTypesEnum
  ) {

    if (!this.diagramRepresentation ||
      !sourceEntity.is(nodesType) ||
      !targetEntity.is(nodesType)
    ) return

    // if both object property and range class are already present, do not add them again
    const sourceNode = this.getEntityCyRepr(sourceEntity, nodesType)
    const targetNode = this.getEntityCyRepr(targetEntity, nodesType)

    if (sourceNode.nonempty() && targetNode.nonempty()) {
      /**
       * If the set of edges between reference node and the connected class
       * includes the object property we want to add, then it's already present.
       */
      if (sourceNode.edgesWith(targetNode)
        .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
        .nonempty()
      ) {
        return
      }
    }

    if (sourceNode.empty())
      nodesType === GrapholTypesEnum.CLASS_INSTANCE ? this.addClassInstance(sourceEntity as ClassInstanceEntity) : this.addClass(sourceEntity)

    if (targetNode.empty())
      nodesType === GrapholTypesEnum.CLASS_INSTANCE ? this.addClassInstance(targetEntity as ClassInstanceEntity) : this.addClass(targetEntity)

    //const connectedClassIri = connectedClassEntity.iri.fullIri
    const objectPropertyEdge = new GrapholEdge(`${sourceEntity.iri.prefixed}-${objectPropertyEntity.iri.prefixed}-${targetEntity.iri.prefixed}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = `${sourceEntity.iri.fullIri}-${nodesType}`
    objectPropertyEdge.targetId = `${targetEntity.iri.fullIri}-${nodesType}`
    objectPropertyEdge.originalId = objectPropertyEntity.getEntityOriginalNodeId()
    objectPropertyEdge.diagramId = this.diagram.id

    objectPropertyEntity.addOccurrence(objectPropertyEdge, RendererStatesEnum.INCREMENTAL)
    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  addClassInstance(classInstanceEntity: ClassInstanceEntity, position?: Position) {
    const instanceNode = new GrapholNode(`${classInstanceEntity.iri.fullIri}-${GrapholTypesEnum.CLASS_INSTANCE}`, GrapholTypesEnum.CLASS_INSTANCE)

    if (!position) {
      // check if parent class is present in diagram
      for (let parentClassIri of classInstanceEntity.parentClassIris) {
        if (this.diagramRepresentation?.containsEntity(parentClassIri)) {
          instanceNode.position = this.diagram.representation?.cy.$id(`${parentClassIri.fullIri}-${GrapholTypesEnum.CLASS}`).position() || { x: 0, y: 0 }
          break
        }
      }

      if (!instanceNode.position) {
        instanceNode.position = { x: 0, y: 0 }
      }
    } else {
      instanceNode.position = position
    }

    // instanceNode.displayedName = iri
    instanceNode.height = instanceNode.width = 50
    instanceNode.shape = Shape.ELLIPSE
    instanceNode.labelXpos = 0
    instanceNode.labelYpos = 0

    this.diagram.addElement(instanceNode, classInstanceEntity)
    classInstanceEntity.addOccurrence(instanceNode, RendererStatesEnum.INCREMENTAL)
    return instanceNode
  }

  addEdge(sourceId: string,
    targetId: string,
    edgeType: GrapholTypesEnum.INCLUSION |
      GrapholTypesEnum.EQUIVALENCE |
      GrapholTypesEnum.INSTANCE_OF |
      GrapholTypesEnum.INPUT) {

    const sourceNode = this.diagramRepresentation?.grapholElements.get(sourceId)
    const targetNode = this.diagramRepresentation?.grapholElements.get(targetId)

    if (sourceNode && targetNode) {
      const instanceEdge = new GrapholEdge(`${sourceId}-${edgeType}-${targetId}`, edgeType)
      instanceEdge.sourceId = sourceId
      instanceEdge.targetId = targetId

      this.diagram.addElement(instanceEdge)
    }

  }

  private getEntityCyRepr(entity: GrapholEntity, type: GrapholTypesEnum) {
    return this.diagramRepresentation?.cy.$id(`${entity.iri.fullIri}-${type}`) || cytoscape().collection()
  }

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}