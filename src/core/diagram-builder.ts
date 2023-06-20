import { Position } from "cytoscape";
import { EntityNameType } from "../config";
import { ClassInstanceEntity, Diagram, GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, Hierarchy, isGrapholNode, RendererStatesEnum, Shape } from "../model";

export default class DiagramBuilder {
  /** The class to which new entities/instances will be connected */

  constructor(public diagram: Diagram, private rendererState: RendererStatesEnum) { }

  addEntity(objectProperty: GrapholEntity, sourceEntity: GrapholEntity, targetEntity: GrapholEntity): void
  addEntity(grapholEntity: GrapholEntity): void
  addEntity(grapholEntity: GrapholEntity, sourceEntity?: GrapholEntity, targetEntity?: GrapholEntity): void {
    switch (grapholEntity.type) {
      case GrapholTypesEnum.DATA_PROPERTY:
        if (sourceEntity)
          this.addDataProperty(grapholEntity, sourceEntity)
        break

      case GrapholTypesEnum.OBJECT_PROPERTY:
        if (sourceEntity && targetEntity)
          this.addObjectProperty(grapholEntity, sourceEntity, targetEntity)
        break

      case GrapholTypesEnum.CLASS:
        if (!this.diagram.containsEntity(grapholEntity, this.rendererState))
          this.addClass(grapholEntity)
        break

      case GrapholTypesEnum.CLASS_INSTANCE:
        if (!this.diagram.containsEntity(grapholEntity, this.rendererState))
          this.addClassInstance(grapholEntity as ClassInstanceEntity)

    }
  }

  addClass(classEntity: GrapholEntity, position?: Position) {
    if (this.diagramRepresentation?.grapholElements.get(classEntity.iri.fullIri))
      return

    const classNode = new GrapholNode(classEntity.iri.fullIri, GrapholTypesEnum.CLASS)
    classNode.iri = classEntity.iri.fullIri
    classNode.displayedName = classEntity.getDisplayedName(EntityNameType.LABEL)
    classNode.height = classNode.width = 80
    classNode.position = position || { x: 0, y: 0 }
    classNode.originalId = classEntity.iri.fullIri

    classEntity.addOccurrence(classNode.id, this.diagram.id, RendererStatesEnum.FLOATY)

    this.diagramRepresentation?.addElement(classNode, classEntity)
  }

  addDataProperty(dataPropertyEntity: GrapholEntity, ownerEntity: GrapholEntity) {

    const dataPropertyNode = new GrapholNode(dataPropertyEntity.iri.fullIri, GrapholTypesEnum.DATA_PROPERTY)

    const ownerEntityId = this.getIdFromEntity(ownerEntity)
    if(!ownerEntityId) return
    let ownerEntityNode = this.diagramRepresentation?.grapholElements.get(ownerEntityId)
    
    if (!dataPropertyNode || !ownerEntityNode) return

    dataPropertyNode.id = dataPropertyEntity.iri.fullIri
    dataPropertyNode.iri = dataPropertyEntity.iri.fullIri;
    dataPropertyNode.displayedName = dataPropertyEntity.getDisplayedName(EntityNameType.LABEL);
    if (isGrapholNode(ownerEntityNode)) {
      dataPropertyNode.position = ownerEntityNode.position
    }
    
    dataPropertyNode.originalId = dataPropertyNode.id
    dataPropertyEntity.addOccurrence(dataPropertyNode.id, this.diagram.id, RendererStatesEnum.FLOATY);

    const dataPropertyEdge = new GrapholEdge(`${ownerEntityNode.id}-${dataPropertyNode.id}`, GrapholTypesEnum.DATA_PROPERTY)
    dataPropertyEdge.sourceId = ownerEntityNode.id
    dataPropertyEdge.targetId = dataPropertyNode.id
    this.diagramRepresentation?.addElement(dataPropertyNode, dataPropertyEntity)
    this.diagramRepresentation?.addElement(dataPropertyEdge)
  }

  addObjectProperty(objectPropertyEntity: GrapholEntity, sourceEntity: GrapholEntity, targetEntity: GrapholEntity) {

    if (!this.diagramRepresentation) return
    
    // if both object property and range class are already present, do not add them again
    const sourceEntityId = this.getIdFromEntity(sourceEntity)
    if(!sourceEntityId) return
    let sourceNode = this.diagramRepresentation?.grapholElements.get(sourceEntityId)
  
    const targetEntityId = this.getIdFromEntity(targetEntity)  
    if(!targetEntityId) return
    let targetNode = this.diagramRepresentation?.grapholElements.get(targetEntityId)
    
    if (sourceNode && targetNode) {
      /**
       * If the set of edges between reference node and the connected class
       * includes the object property we want to add, then it's already present.
       */
      /*if (sourceNode.edgesWith(targetNode)
        .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
        .nonempty()
      ) {
        return
      }*/
    }

    if (!sourceNode)
      sourceEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(sourceEntity as ClassInstanceEntity) : this.addEntity(sourceEntity)

    if (!targetNode)
      targetEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(targetEntity as ClassInstanceEntity) : this.addEntity(targetEntity)

    //const connectedClassIri = connectedClassEntity.iri.fullIri
    if(!sourceNode || !targetNode) return
    const objectPropertyEdge = new GrapholEdge(`${sourceEntity.iri.prefixed}-${objectPropertyEntity.iri.prefixed}-${targetEntity.iri.prefixed}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = sourceNode.id
    objectPropertyEdge.targetId = targetNode.id
    objectPropertyEdge.originalId = objectPropertyEdge.id
    objectPropertyEntity.addOccurrence(objectPropertyEdge.id, this.diagram.id, RendererStatesEnum.FLOATY)
    this.diagramRepresentation.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  addClassInstance(classInstanceEntity: ClassInstanceEntity, position?: Position) {
    const instanceNode = new GrapholNode(classInstanceEntity.iri.fullIri, GrapholTypesEnum.CLASS_INSTANCE)

    if (!position) {
      // check if parent class is present in diagram
      for (let parentClassIri of classInstanceEntity.parentClassIris) {
        if (this.diagramRepresentation?.containsEntity(parentClassIri)) {
          instanceNode.position = this.diagramRepresentation.cy.$id(parentClassIri.fullIri).position() || { x: 0, y: 0 }
          break
        }
      }

      if (!instanceNode.position) {
        instanceNode.position = { x: 0, y: 0 }
      }
    } else {
      instanceNode.position = position
    }

    instanceNode.displayedName = classInstanceEntity.iri.remainder
    instanceNode.height = instanceNode.width = 50
    instanceNode.shape = Shape.ELLIPSE
    instanceNode.labelXpos = 0
    instanceNode.labelYpos = 0
    classInstanceEntity.addOccurrence(instanceNode.id, this.diagram.id, RendererStatesEnum.FLOATY);

    this.diagramRepresentation?.addElement(instanceNode, classInstanceEntity)
    return instanceNode
  }

  public addHierarchy(hierarchy: Hierarchy, superEntity, position?: Position) {
    const unionNode = hierarchy.getUnionGrapholNode(position)
    const inputEdges = hierarchy.getInputGrapholEdges()
    const inclusionEdges = hierarchy.getInclusionEdges()

    if (!unionNode || !inputEdges || !inclusionEdges)
      return

    this.diagramRepresentation?.addElement(unionNode)

    const superId = this.getIdFromEntity(superEntity)
    if(!superId) return

    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => this.diagramRepresentation?.addElement(inputEdge))
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => {
      inclusionEdge.targetId = superId
      this.diagramRepresentation?.addElement(inclusionEdge)
    })
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

      this.diagramRepresentation?.addElement(instanceEdge)
    }

  }

  public get diagramRepresentation() {
    return this.diagram.representations.get(this.rendererState)
  }

  public getIdFromEntity(entity) {
    if (!this.diagramRepresentation) return

    const entityOccurrences = entity.occurrences.get(RendererStatesEnum.GRAPHOL).length > 0 ? entity.occurrences.get(RendererStatesEnum.GRAPHOL) : entity.occurrences.get(RendererStatesEnum.FLOATY)
    if (!entityOccurrences || entityOccurrences.length === 0) return
    let entityId = entityOccurrences.find(o => o.diagramId === this.diagram.id)?.elementId

    if(!entityId) return
    let node = this.diagramRepresentation?.grapholElements.get(entityId)

    return node?.id
  }

  public toggleFunctionality(entity, functional){

    const id = this.getIdFromEntity(entity)
    if(!id) return
    const node = this.diagramRepresentation?.cy.$id(id)
    if(!node) return
    node.data('functional', functional)
  }
}