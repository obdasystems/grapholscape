import { EdgeSingular } from "cytoscape";
import { EntityNameType } from "../config";
import { GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, Hierarchy, IncrementalDiagram, Ontology, RendererStatesEnum, Shape } from "../model";

export default class DiagramBuilder {
  /** The class to which new entities/instances will be connected */
  referenceNodeId: string | undefined

  constructor(private ontology: Ontology, public diagram: IncrementalDiagram) { }

  addEntity(entityIri: string, connectedClassIri?: string, directObjectProperty = true) {
    const grapholEntity = this.ontology.getEntity(entityIri)

    if (grapholEntity) {
      switch (grapholEntity.type) {
        case GrapholTypesEnum.DATA_PROPERTY:
          this.addDataProperty(grapholEntity)
          break

        case GrapholTypesEnum.OBJECT_PROPERTY:
          if (connectedClassIri) {
            const connectedClassGrapholEntity = this.ontology.getEntity(connectedClassIri)
            if (connectedClassGrapholEntity)
              this.addObjectProperty(grapholEntity, connectedClassGrapholEntity, directObjectProperty)
          }

          break

        case GrapholTypesEnum.CLASS:
          if (!this.diagram.containsEntity(grapholEntity))
            this.addClass(grapholEntity)

        default:
          return
      }
    }
  }

  addClassInstance(iri: string) {
    if (!this.referenceNodeId) return

    const instanceEntity = this.diagram.classInstances?.get(iri)
    if (!instanceEntity) {
      console.error(`Can't find the instance [${iri}] entity`)
      return
    }
    const instanceNode = new GrapholNode(iri, GrapholTypesEnum.CLASS_INSTANCE)

    instanceNode.position = this.referenceNodePosition || { x: 0, y: 0 }
    // instanceNode.displayedName = iri
    instanceNode.height = instanceNode.width = 50
    instanceNode.shape = Shape.ELLIPSE
    instanceNode.labelXpos = 0
    instanceNode.labelYpos = 0

    this.diagram.addElement(instanceNode, instanceEntity)
  }

  removeEntity(entityIri: string, nodesIdToKeep: string[] = []) {
    this.diagramRepresentation?.cy.$(`[iri = "${entityIri}"]`).forEach(element => {
      if (element.data().type === GrapholTypesEnum.CLASS) {
        element.neighborhood().forEach(neighbourElement => {
          if (neighbourElement.isNode()) {
            // remove nodes only if they have 1 connection, i.e. with the class we want to remove
            if (neighbourElement.degree(false) === 1 && !nodesIdToKeep?.includes(neighbourElement.id())) {
              if (neighbourElement.data().iri) {
                // it's an entity, recursively remove entities
                nodesIdToKeep.push(entityIri) // the entity we are removing must be skipped, otherwise cyclic recursion
                this.removeEntity(neighbourElement.data().iri, nodesIdToKeep)
              } else {
                this.diagram.removeElement(neighbourElement.id())
              }
            }
          } else {
            // edges must be removed anyway
            // (cytoscape removes them automatically
            // but we need to update the grapholElements 
            // map too in diagram representation)
            this.diagram.removeElement((neighbourElement as EdgeSingular).id())
          }
        })

        this.ontology.hierarchiesBySubclassMap.get(entityIri)?.forEach(hierarchy => {
          this.removeHierarchy(hierarchy)
        })

        this.ontology.hierarchiesBySuperclassMap.get(entityIri)?.forEach(hierarchy => {
          this.removeHierarchy(hierarchy)
        })
      }

      this.diagramRepresentation?.removeElement(element.id())
    })

    const entity = this.ontology.getEntity(entityIri)
    entity?.removeOccurrence(entityIri, this.diagram.id, RendererStatesEnum.INCREMENTAL)
  }

  addHierarchy(hierarchy: Hierarchy) {
    const unionNode = hierarchy.getUnionGrapholNode(this.referenceNodePosition)
    const inputEdges = hierarchy.getInputGrapholEdges()
    const inclusionEdges = hierarchy.getInclusionEdges()

    if (!unionNode || !inputEdges || !inclusionEdges)
      return

    this.diagram.addElement(unionNode)

    // Add inputs
    for (const inputClassIri of hierarchy.inputs) {
      this.addEntity(inputClassIri)
    }

    for (const superClass of hierarchy.superclasses) {
      this.addEntity(superClass.classIri)
    }

    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => this.diagram.addElement(inputEdge))

    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => this.diagram.addElement(inclusionEdge))
  }

  removeHierarchy(hierarchy: Hierarchy, entitiesTokeep?: string[]) {
    if (!hierarchy.id || (hierarchy.id && !this.diagramRepresentation?.grapholElements.get(hierarchy.id)))
      return

    // remove union node
    this.diagram.removeElement(hierarchy.id)

    // remove input edges
    hierarchy.getInputGrapholEdges()?.forEach(inputEdge => {
      this.diagram.removeElement(inputEdge.id)
    })

    // remove inclusion edges
    hierarchy.getInclusionEdges()?.forEach(inclusionEdge => {
      this.diagram.removeElement(inclusionEdge.id)
    })

    // remove input classes or superclasses left with no edges
    hierarchy.inputs.forEach(inputClassIri => {
      if (this.diagramRepresentation?.cy.$id(inputClassIri).degree(false) === 0 &&
        !entitiesTokeep?.includes(inputClassIri)) {
        this.removeEntity(inputClassIri)
      }
    })

    hierarchy.superclasses.forEach(superclass => {
      if (this.diagramRepresentation?.cy.$id(superclass.classIri).degree(false) === 0 &&
        !entitiesTokeep?.includes(superclass.classIri)) {
        this.removeEntity(superclass.classIri)
      }
    })
  }

  // addClassInIsa(classInIsa: ClassInIsa) {

  // }

  areDataPropertiesVisibleForClass(classIri: string): boolean {
    return this.diagramRepresentation?.cy.$id(classIri).neighborhood(`node[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).nonempty() || false
  }

  areAllSuperHierarchiesVisibleForClass(classIri: string): boolean {
    const hierarchies = this.ontology.hierarchiesBySubclassMap.get(classIri)
    if (hierarchies)
      return this.areAllHierarchiesVisible(hierarchies)
    else
      return true
  }

  areAllSubHierarchiesVisibleForClass(classIri: string): boolean {
    const hierarchies = this.ontology.hierarchiesBySuperclassMap.get(classIri)
    if (hierarchies)
      return this.areAllHierarchiesVisible(hierarchies)
    else
      return true
  }

  /**
   * Add an inclusion edge between two classes
   * @param subClassIri 
   * @param superClassIri 
   */
  addIsa(subClassIri: string, superClassIri: string, type: GrapholTypesEnum.INCLUSION | GrapholTypesEnum.EQUIVALENCE = GrapholTypesEnum.INCLUSION) {
    if (this.diagramRepresentation?.cy.$id(subClassIri).empty()) {
      this.addEntity(subClassIri)
    }

    if (this.diagramRepresentation?.cy.$id(superClassIri).empty()) {
      this.addEntity(superClassIri)
    }

    const inclusionEdge = new GrapholEdge(`${subClassIri}-isa-${superClassIri}`, type)
    inclusionEdge.sourceId = subClassIri
    inclusionEdge.targetId = superClassIri

    this.diagram.addElement(inclusionEdge)
  }

  addSubClass(subClassIri: string) {
    if (this.referenceNodeIri)
      this.addIsa(subClassIri, this.referenceNodeIri)
  }

  addSuperClass(superClassIri: string) {
    if (this.referenceNodeIri)
      this.addIsa(this.referenceNodeIri, superClassIri)
  }

  addEquivalentClass(equivalentClassIri: string) {
    if (this.referenceNodeIri)
      this.addIsa(this.referenceNodeIri, equivalentClassIri, GrapholTypesEnum.EQUIVALENCE)
  }

  areAllSubclassesVisibleForClass(classIri: string, subClassesIris: string[]) {
    for (let subClassIri of subClassesIris) {
      if (this.diagramRepresentation?.cy.$id(subClassIri)
        .connectedEdges(`[ type ="${GrapholTypesEnum.INCLUSION}" ]`)
        .targets(`[id = "${classIri}"]`).empty()
      )
        return false
    }

    return true
  }

  areAllSuperclassesVisibleForClass(classIri: string, subClassesIris: string[]) {
    for (let subClassIri of subClassesIris) {
      if (this.diagramRepresentation?.cy.$id(subClassIri)
        .connectedEdges(`[ type = "${GrapholTypesEnum.INCLUSION}" ]`)
        .sources(`[id = "${classIri}"]`).empty()
      )
        return false
    }

    return true
  }

  areAllEquivalentClassesVisibleForClass(classIri: string, equivalentClassesIris: string[]) {
    for (let equivalentClassIri of equivalentClassesIris) {
      if (this.diagramRepresentation?.cy.$id(equivalentClassIri)
        .connectedEdges(`[ type = "${GrapholTypesEnum.EQUIVALENCE}" ]`)
        .connectedNodes(`[id = "${classIri}"]`).empty()
      )
        return false
    }

    return true
  }

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

  private addObjectProperty(objectPropertyEntity: GrapholEntity, connectedClassEntity: GrapholEntity, direct: boolean) {
    if (!this.referenceNodeId) return

    // if both object property and range class are already present, do not add them again
    const connectedClassNode = this.diagramRepresentation?.cy.$id(connectedClassEntity.iri.fullIri)
    if (connectedClassNode?.nonempty()) {
      /**
       * If the set of edges between reference node and the connected class
       * includes the object property we want to add, then it's already present.
       */
      const referenceNode = this.diagramRepresentation?.cy.$id(this.referenceNodeId)
      if (referenceNode?.nonempty() && connectedClassNode.edgesWith(referenceNode)
        .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
        .nonempty()
      ) {
        return
      }
    }

    this.addClass(connectedClassEntity)
    const connectedClassIri = connectedClassEntity.iri.fullIri
    const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${connectedClassIri}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = direct ? this.referenceNodeId : connectedClassIri
    objectPropertyEdge.targetId = direct ? connectedClassIri : this.referenceNodeId
    objectPropertyEdge.originalId = objectPropertyEntity.getEntityOriginalNodeId()

    objectPropertyEntity.addOccurrence(objectPropertyEdge.id, this.diagram.id, RendererStatesEnum.INCREMENTAL)
    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  addInstanceObjectProperty(objectPropertyIri: string, classInstanceIri: string, direct: boolean) {
    if (!this.referenceNodeId) return

    const objectPropertyEntity = this.ontology.getEntity(objectPropertyIri)

    if (!objectPropertyEntity) return

    // if both object property and range class are already present, do not add them again
    const connectedInstanceNode = this.diagramRepresentation?.cy.$id(classInstanceIri)
    if (connectedInstanceNode?.nonempty()) {
      /**
       * If the set of edges between reference node and the connected class
       * includes the object property we want to add, then it's already present.
       */
      const referenceNode = this.diagramRepresentation?.cy.$id(this.referenceNodeId)
      if (referenceNode?.nonempty() && connectedInstanceNode.edgesWith(referenceNode)
        .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
        .nonempty()
      ) {
        return
      }
    }

    this.addClassInstance(classInstanceIri)
    const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${classInstanceIri}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = direct ? this.referenceNodeId : classInstanceIri
    objectPropertyEdge.targetId = direct ? classInstanceIri : this.referenceNodeId

    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)

  }

  addInstanceOfEdge(instanceIri: string, parentClassIri?: string) {
    if (!this.referenceNodeId) return
    if (parentClassIri && this.diagramRepresentation?.cy.$id(parentClassIri).empty()) return

    const targetId = parentClassIri || this.referenceNodeId
    const instanceEdge = new GrapholEdge(`${targetId}-instance-${instanceIri}`, GrapholTypesEnum.INSTANCE_OF)
    instanceEdge.sourceId = instanceIri
    instanceEdge.targetId = targetId

    this.diagram.addElement(instanceEdge)
  }

  private addClass(classEntity: GrapholEntity) {
    if (this.diagramRepresentation?.grapholElements.get(classEntity.iri.fullIri))
      return

    const classNode = this.getEntityElement(classEntity.iri.fullIri) as GrapholNode
    classNode.id = classEntity.iri.fullIri
    classNode.position = this.referenceNodePosition || classNode.position
    classNode.originalId = classEntity.getEntityOriginalNodeId()

    classEntity.addOccurrence(classNode.id, this.diagram.id, RendererStatesEnum.INCREMENTAL)

    this.diagram.addElement(classNode, classEntity)
  }

  private addDataProperty(dataPropertyEntity: GrapholEntity) {
    if (!this.referenceNodeId) return

    const dataPropertyNode = this.getEntityElement(dataPropertyEntity.iri.fullIri)

    if (!dataPropertyNode) return

    dataPropertyNode.id = dataPropertyEntity.iri.fullIri
    dataPropertyNode.originalId = dataPropertyEntity.getEntityOriginalNodeId()

    const dataPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${dataPropertyNode.id}`, GrapholTypesEnum.DATA_PROPERTY)
    dataPropertyEdge.sourceId = this.referenceNodeId
    dataPropertyEdge.targetId = dataPropertyNode.id

    this.diagram.addElement(dataPropertyNode, dataPropertyEntity)
    this.diagram.addElement(dataPropertyEdge)
  }

  private getEntityElement(entityIri: string) {
    const occurrences = this.ontology.getEntityOccurrences(entityIri)?.get(RendererStatesEnum.GRAPHOL)

    if (occurrences) {
      const occurrence = occurrences[0]
      return this.ontology
        .getDiagram(occurrence.diagramId)
        ?.representations.get(RendererStatesEnum.FLOATY)
        ?.grapholElements.get(occurrence.elementId)
        ?.clone()
    }
  }

  private get referenceNodePosition() {
    if (this.referenceNodeId && this.diagramRepresentation?.cy) {
      return this.diagramRepresentation?.cy.$id(this.referenceNodeId).position()
    }
  }

  private get referenceNodeIri() {
    if (this.referenceNodeId)
      return this.diagramRepresentation?.cy.$id(this.referenceNodeId)?.data().iri as string
  }

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}