import { EdgeSingular, Position } from "cytoscape";
import { EntityNameType } from "../config";
import { ClassInstanceEntity, GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, Hierarchy, IncrementalDiagram, isGrapholNode, Ontology, RendererStatesEnum, Shape } from "../model";

export default class DiagramBuilder {
  /** The class to which new entities/instances will be connected */
  // referenceNodeId: string | undefined

  constructor(public diagram: IncrementalDiagram) { }

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
        if (!this.diagram.containsEntity(grapholEntity))
          this.addClass(grapholEntity)
        break

      case GrapholTypesEnum.CLASS_INSTANCE:
        if (!this.diagram.containsEntity(grapholEntity))
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
    classNode.originalId = classEntity.getEntityOriginalNodeId()

    classEntity.addOccurrence(classNode.id, this.diagram.id, RendererStatesEnum.INCREMENTAL)

    this.diagram.addElement(classNode, classEntity)
  }

  addDataProperty(dataPropertyEntity: GrapholEntity, ownerEntity: GrapholEntity) {

    const dataPropertyNode = new GrapholNode(dataPropertyEntity.iri.fullIri, GrapholTypesEnum.DATA_PROPERTY)
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

  addObjectProperty(objectPropertyEntity: GrapholEntity, sourceEntity: GrapholEntity, targetEntity: GrapholEntity) {

    if (!this.diagramRepresentation) return

    // if both object property and range class are already present, do not add them again
    const sourceNode = this.diagramRepresentation.cy.$id(sourceEntity.iri.fullIri)
    const targetNode = this.diagramRepresentation.cy.$id(targetEntity.iri.fullIri)
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
      sourceEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(sourceEntity as ClassInstanceEntity) : this.addEntity(sourceEntity)

    if (targetNode.empty())
      targetEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(targetEntity as ClassInstanceEntity) : this.addEntity(targetEntity)

    //const connectedClassIri = connectedClassEntity.iri.fullIri
    const objectPropertyEdge = new GrapholEdge(`${sourceEntity.iri.prefixed}-${objectPropertyEntity.iri.prefixed}-${targetEntity.iri.prefixed}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = sourceEntity.iri.fullIri
    objectPropertyEdge.targetId = targetEntity.iri.fullIri
    objectPropertyEdge.originalId = objectPropertyEntity.getEntityOriginalNodeId()

    objectPropertyEntity.addOccurrence(objectPropertyEdge.id, this.diagram.id, RendererStatesEnum.INCREMENTAL)
    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  addClassInstance(classInstanceEntity: ClassInstanceEntity, position?: Position) {
    const instanceNode = new GrapholNode(classInstanceEntity.iri.fullIri, GrapholTypesEnum.CLASS_INSTANCE)

    if (!position) {
      // check if parent class is present in diagram
      if (this.diagramRepresentation?.containsEntity(classInstanceEntity.parentClassIri)) {
        instanceNode.position = this.diagram.representation?.cy.$id(classInstanceEntity.parentClassIri.fullIri).position() || { x: 0, y: 0 }
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

  // removeEntity(entity: GrapholEntity, nodesIdToKeep: string[] = []) {
  //   this.diagramRepresentation?.cy.$(`[iri = "${entity.iri.fullIri}"]`).forEach(element => {
  //     if (element.data().type === GrapholTypesEnum.CLASS) {
  //       element.neighborhood().forEach(neighbourElement => {
  //         if (neighbourElement.isNode()) {
  //           // remove nodes only if they have 1 connection, i.e. with the class we want to remove
  //           if (neighbourElement.degree(false) === 1 && !nodesIdToKeep?.includes(neighbourElement.id())) {
  //             if (neighbourElement.data().iri) {
  //               // it's an entity, recursively remove entities
  //               nodesIdToKeep.push(entity.iri.fullIri) // the entity we are removing must be skipped, otherwise cyclic recursion
  //               this.removeEntity(neighbourElement.data().iri, nodesIdToKeep)
  //             } else {
  //               this.diagram.removeElement(neighbourElement.id())
  //             }
  //           }
  //         } else {
  //           // edges must be removed anyway
  //           // (cytoscape removes them automatically
  //           // but we need to update the grapholElements 
  //           // map too in diagram representation)
  //           this.diagram.removeElement((neighbourElement as EdgeSingular).id())
  //         }
  //       })

  //       // this.ontology.hierarchiesBySubclassMap.get(entityIri)?.forEach(hierarchy => {
  //       //   this.removeHierarchy(hierarchy)
  //       // })

  //       // this.ontology.hierarchiesBySuperclassMap.get(entityIri)?.forEach(hierarchy => {
  //       //   this.removeHierarchy(hierarchy)
  //       // })
  //     }

  //     this.diagramRepresentation?.removeElement(element.id())
  //     entity.removeOccurrence(element.id, this.diagram.id, RendererStatesEnum.INCREMENTAL)
  //   })

  //   // const entity = this.ontology.getEntity(entityIri)
  //   // entity?.removeOccurrence(entityIri, this.diagram.id, RendererStatesEnum.INCREMENTAL)
  // }

  // removeHierarchy(hierarchy: Hierarchy, entitiesTokeep?: string[]) {
  //   if (!hierarchy.id || (hierarchy.id && !this.diagramRepresentation?.grapholElements.get(hierarchy.id)))
  //     return

  //   // remove union node
  //   this.diagram.removeElement(hierarchy.id)

  //   // remove input edges
  //   hierarchy.getInputGrapholEdges()?.forEach(inputEdge => {
  //     this.diagram.removeElement(inputEdge.id)
  //   })

  //   // remove inclusion edges
  //   hierarchy.getInclusionEdges()?.forEach(inclusionEdge => {
  //     this.diagram.removeElement(inclusionEdge.id)
  //   })

  //   // remove input classes or superclasses left with no edges
  //   hierarchy.inputs.forEach(inputClassIri => {
  //     if (this.diagramRepresentation?.cy.$id(inputClassIri).degree(false) === 0 &&
  //       !entitiesTokeep?.includes(inputClassIri)) {
  //       this.removeEntity(inputClassIri)
  //     }
  //   })

  //   hierarchy.superclasses.forEach(superclass => {
  //     if (this.diagramRepresentation?.cy.$id(superclass.classIri).degree(false) === 0 &&
  //       !entitiesTokeep?.includes(superclass.classIri)) {
  //       this.removeEntity(superclass.classIri)
  //     }
  //   })
  // }

  // addClassInIsa(classInIsa: ClassInIsa) {

  // }

  // areDataPropertiesVisibleForClass(classIri: string): boolean {
  //   return this.diagramRepresentation?.cy.$id(classIri).neighborhood(`node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).nonempty() || false
  // }

  // areAllSuperHierarchiesVisibleForClass(classIri: string): boolean {
  //   const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
  //   if (hierarchies)
  //     return this.areAllHierarchiesVisible(hierarchies)
  //   else
  //     return true
  // }

  // areAllSubHierarchiesVisibleForClass(classIri: string): boolean {
  //   const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)
  //   if (hierarchies)
  //     return this.areAllHierarchiesVisible(hierarchies)
  //   else
  //     return true
  // }

  // /**
  //  * Add an inclusion edge between two classes
  //  * @param subClassIri 
  //  * @param superClassIri 
  //  */
  // addIsa(subClassEntity: GrapholEntity, superClassEntity: GrapholEntity, type: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.EQUIVALENCE = GrapholTypesEnum.INCLUSION) {
  //   if (this.diagramRepresentation?.cy.$id(subClassIri).empty()) {
  //     this.addEntity(subClassIri)
  //   }

  //   if (this.diagramRepresentation?.cy.$id(superClassIri).empty()) {
  //     this.addEntity(superClassIri)
  //   }

  //   const inclusionEdge = new GrapholEdge(`${subClassIri}-isa-${superClassIri}`, type)
  //   inclusionEdge.sourceId = subClassIri
  //   inclusionEdge.targetId = superClassIri

  //   this.diagram.addElement(inclusionEdge)
  // }

  // addSubClass(subClassIri: string) {
  //   if (this.referenceNodeIri)
  //     this.addIsa(subClassIri, this.referenceNodeIri)
  // }

  // addSuperClass(superClassIri: string) {
  //   if (this.referenceNodeIri)
  //     this.addIsa(this.referenceNodeIri, superClassIri)
  // }

  // areAllSubclassesVisibleForClass(classIri: string, subClassesIris: string[]) {
  //   for (let subClassIri of subClassesIris) {
  //     if (this.diagramRepresentation?.cy.$id(subClassIri)
  //       .connectedEdges(`[ type ="${GrapholTypesEnum.INCLUSION}" ]`)
  //       .targets(`[id = "${classIri}"]`).empty()
  //     )
  //       return false
  //   }

  //   return true
  // }

  // areAllSuperclassesVisibleForClass(classIri: string, subClassesIris: string[]) {
  //   for (let subClassIri of subClassesIris) {
  //     if (this.diagramRepresentation?.cy.$id(subClassIri)
  //       .connectedEdges(`[ type = "${GrapholTypesEnum.INCLUSION}" ]`)
  //       .sources(`[id = "${classIri}"]`).empty()
  //     )
  //       return false
  //   }

  //   return true
  // }

  // areAllEquivalentClassesVisibleForClass(classIri: string, equivalentClassesIris: string[]) {
  //   for (let equivalentClassIri of equivalentClassesIris) {
  //     if (this.diagramRepresentation?.cy.$id(equivalentClassIri)
  //       .connectedEdges(`[ type = "${GrapholTypesEnum.EQUIVALENCE}" ]`)
  //       .connectedNodes(`[id = "${classIri}"]`).empty()
  //     )
  //       return false
  //   }

  //   return true
  // }

  private areAllHierarchiesVisible(hierarchies: Hierarchy[]) {
    let result = true
    for (let hierarchy of hierarchies) {
      if (hierarchy.id && this.diagramRepresentation?.cy.$id(hierarchy.id).empty()) {
        result = false
        break
      }
    }

    return result
  }

  // addInstanceObjectProperty(objectPropertyIri: string, classInstanceEntity: ClassInstanceEntity, direct: boolean) {
  //   if (!this.referenceNodeId) return

  //   const objectPropertyEntity = this.ontology.getEntity(objectPropertyIri)

  //   if (!objectPropertyEntity) return

  //   // if both object property and range class are already present, do not add them again
  //   const connectedInstanceNode = this.diagramRepresentation?.cy.$id(classInstanceEntity.iri.fullIri)
  //   if (connectedInstanceNode?.nonempty()) {
  //     /**
  //      * If the set of edges between reference node and the connected class
  //      * includes the object property we want to add, then it's already present.
  //      */
  //     const referenceNode = this.diagramRepresentation?.cy.$id(this.referenceNodeId)
  //     if (referenceNode?.nonempty() && connectedInstanceNode.edgesWith(referenceNode)
  //       .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
  //       .nonempty()
  //     ) {
  //       return
  //     }
  //   }

  //   this.addClassInstance(classInstanceIri)
  //   const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${classInstanceIri}`, GrapholTypesEnum.OBJECT_PROPERTY)
  //   objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
  //   objectPropertyEdge.sourceId = direct ? this.referenceNodeId : classInstanceIri
  //   objectPropertyEdge.targetId = direct ? classInstanceIri : this.referenceNodeId

  //   this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)

  // } 

  // private getEntityElement(entityIri: string) {
  //   const occurrences = this.ontology.getEntityOccurrences(entityIri)?.get(RendererStatesEnum.GRAPHOL)

  //   if (occurrences) {
  //     const occurrence = occurrences[0]
  //     return this.ontology
  //       .getDiagram(occurrence.diagramId)
  //       ?.representations.get(RendererStatesEnum.FLOATY)
  //       ?.grapholElements.get(occurrence.elementId)
  //       ?.clone()
  //   }
  // }

  // private get referenceNodePosition() {
  //   if (this.referenceNodeId && this.diagramRepresentation?.cy) {
  //     return this.diagramRepresentation?.cy.$id(this.referenceNodeId).position()
  //   }
  // }

  // private get referenceNodeIri() {
  //   if (this.referenceNodeId)
  //     return this.diagramRepresentation?.cy.$id(this.referenceNodeId)?.data().iri as string
  // }

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}