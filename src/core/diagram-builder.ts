import cytoscape, { EdgeSingular } from "cytoscape";
import { ClassInstanceEntity, Diagram, EntityNameType, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Hierarchy, Iri, isGrapholNode, Position, RendererStatesEnum, Shape, TypesEnum } from "../model";

export default class DiagramBuilder {

  constructor(public diagram: Diagram, private rendererState: RendererStatesEnum) { }

  addClass(classEntity: GrapholEntity, classNode?: GrapholNode): GrapholNode
  addClass(classEntity: GrapholEntity, position?: Position): GrapholNode
  addClass(classEntity: GrapholEntity): GrapholNode
  addClass(classEntity: GrapholEntity, positionOrNode?: any) {
    if (this.diagramRepresentation?.containsEntity(classEntity)) {
      const nodeId = classEntity.getIdInDiagram(this.diagram.id, TypesEnum.CLASS, this.rendererState)
      return nodeId
        ? this.diagramRepresentation.grapholElements.get(nodeId)
        : undefined
    }

    let position: Position | undefined, classNode: GrapholNode | undefined
    if (positionOrNode && isGrapholNode(positionOrNode)) {
      classNode = positionOrNode
    } else if (positionOrNode) {
      position = positionOrNode
    }

    if (!classNode) {
      classNode = new GrapholNode(this.getNewId('node'), TypesEnum.CLASS)
      classNode.iri = classEntity.iri.fullIri
      classNode.displayedName = classEntity.getDisplayedName(EntityNameType.LABEL)
      classNode.height = classNode.width = 80

      if (position)
        classNode.position = position
      else
        classNode.renderedPosition = this.getCurrentCenterPos()

      classNode.originalId = classNode.id
      classNode.diagramId = this.diagram.id
    }

    classEntity.addOccurrence(classNode, this.rendererState)

    this.diagramRepresentation?.addElement(classNode, classEntity)

    return classNode
  }

  addDataProperty(dataPropertyEntity: GrapholEntity, ownerEntity?: GrapholEntity) {

    const dataPropertyNode = new GrapholNode(this.getNewId('node'), TypesEnum.DATA_PROPERTY)

    dataPropertyNode.diagramId = this.diagram.id
    dataPropertyNode.iri = dataPropertyEntity.iri.fullIri
    dataPropertyNode.displayedName = dataPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    dataPropertyNode.labelXpos = 0
    dataPropertyNode.labelYpos = -15

    dataPropertyNode.originalId = dataPropertyNode.id
    dataPropertyEntity.addOccurrence(dataPropertyNode, RendererStatesEnum.FLOATY)

    let ownerEntityNode: GrapholElement | undefined
    if (ownerEntity) {
      const ownerEntityId = ownerEntity.getIdInDiagram(this.diagram.id, TypesEnum.CLASS, this.rendererState)
      if (!ownerEntityId) return
      ownerEntityNode = this.diagramRepresentation?.grapholElements.get(ownerEntityId)

      if (!ownerEntityNode) return

      // Check if owner entity node has already the same data property, avoid duplicates on class
      const dpNodeAlreadyPresent = this.diagramRepresentation?.cy.$id(ownerEntityNode.id).neighborhood(`[ iri = "${dataPropertyNode.iri}" ]`)
      if (dpNodeAlreadyPresent?.nonempty()) {
        return this.diagramRepresentation?.grapholElements.get(dpNodeAlreadyPresent.first().id())
      }
    }

    if (ownerEntityNode?.isNode() && this.diagramRepresentation)
      dataPropertyNode.position = this.diagramRepresentation.cy.$id(ownerEntityNode.id).position()
    else
      dataPropertyNode.renderedPosition = this.getCurrentCenterPos()

    this.diagramRepresentation?.addElement(dataPropertyNode, dataPropertyEntity)

    if (ownerEntityNode) {
      const dataPropertyEdge = new GrapholEdge(this.getNewId('edge'), TypesEnum.ATTRIBUTE_EDGE)
      dataPropertyEdge.diagramId = this.diagram.id
      dataPropertyEdge.sourceId = ownerEntityNode.id
      dataPropertyEdge.targetId = dataPropertyNode.id
      this.diagramRepresentation?.addElement(dataPropertyEdge)
    }

    return dataPropertyNode
  }

  /**
   * Add an object property between two entities.
   * If the source and/or target entities are already present in graph, they won't be added again.
   * If there already exists an object property between them with the same IRI, the
   * edge won't be added.
   * @param objectPropertyEntity the object property entity 
   * @param sourceEntity the source entity
   * @param targetEntity the target entity
   * @param nodesType the type of source and target
   * @param objectPropertyElement [optional] to use your own GrapholEdge for the object property occurrence.
   * if you don't pass this, a new GrapholEdge will be created from scratch
   * @returns 
   */
  addObjectProperty(
    objectPropertyEntity: GrapholEntity,
    sourceEntity: GrapholEntity,
    targetEntity: GrapholEntity,
    nodesType: TypesEnum[],
    objectPropertyElement?: GrapholEdge
  ) {
    return this.addPropertyEdge(objectPropertyEntity, sourceEntity,targetEntity, nodesType, TypesEnum.OBJECT_PROPERTY, objectPropertyElement)
  }

  /**
   * Add an annotation property between two entities.
   * If the source and/or target entities are already present in graph, they won't be added again.
   * If there already exists an annotation property between them with the same IRI, the
   * edge won't be added.
   * @param annotationPropertyEdge the object property entity 
   * @param sourceEntity the source entity
   * @param targetEntity the target entity
   * @param nodesType the type of source and target
   * @param annotationPropertyElement [optional] to use your own GrapholEdge for the object property occurrence.
   * if you don't pass this, a new GrapholEdge will be created from scratch
   * @returns 
   */
  addAnnotationProperty(
    annotationPropertyEdge: GrapholEntity,
    sourceEntity: GrapholEntity,
    targetEntity: GrapholEntity,
    nodesType: TypesEnum[],
    annotationPropertyElement?: GrapholEdge
  ) {
    return this.addPropertyEdge(annotationPropertyEdge, sourceEntity,targetEntity, nodesType, TypesEnum.ANNOTATION_PROPERTY, annotationPropertyElement)
  }

  private addPropertyEdge(
    propertyEntity: GrapholEntity,
    sourceEntity: GrapholEntity,
    targetEntity: GrapholEntity,
    nodesType: TypesEnum[],
    propertyType: TypesEnum.OBJECT_PROPERTY | TypesEnum.ANNOTATION_PROPERTY,
    propertyEdgeElement?: GrapholEdge) {
    const sourceType = nodesType[0]
    const targetType = nodesType.length > 1 ? nodesType[1] : nodesType[0]
    // if both object property and range class are already present, do not add them again
    let sourceNode = this.getEntityCyRepr(sourceEntity, sourceType)
    let targetNode = this.getEntityCyRepr(targetEntity, targetType)

    if (sourceNode.nonempty() && targetNode.nonempty()) {
      /**
       * If the set of edges between source and target entity nodes
       * includes the property edge we want to add, then it's already present.
       */
      let edgesAlreadyPresent = sourceNode.edgesWith(targetNode)
        .filter(e => e.data().iri === propertyEntity.iri.fullIri)
      if (edgesAlreadyPresent.nonempty()) {
        return this.diagramRepresentation
          ?.grapholElements
          .get(edgesAlreadyPresent.first().id())
      }
    }

    if (sourceNode.empty()) {
      switch(sourceType) {
        case TypesEnum.CLASS:
          this.addClass(sourceEntity)
          break
        
        case TypesEnum.CLASS_INSTANCE:
          this.addClassInstance(sourceEntity as ClassInstanceEntity)
          break
        
        case TypesEnum.INDIVIDUAL:
          this.addIndividual(sourceEntity)
          break
        
        case TypesEnum.DATA_PROPERTY:
          this.addDataProperty(sourceEntity)
          break
      }
      // sourceEntity.is(TypesEnum.CLASS_INSTANCE) ? this.addClassInstance(sourceEntity as ClassInstanceEntity) : this.addClass(sourceEntity)
      sourceNode = this.getEntityCyRepr(sourceEntity, sourceType)
      if (sourceNode.empty()) {
        console.warn(`Unable to find the node that has been automatically added with IRI: ${sourceEntity.iri.fullIri}`)
        return
      }
    }
    if (targetNode.empty()) {
      switch(targetType) {
        case TypesEnum.CLASS:
          this.addClass(targetEntity)
          break
        
        case TypesEnum.CLASS_INSTANCE:
          this.addClassInstance(targetEntity as ClassInstanceEntity)
          break
        
        case TypesEnum.INDIVIDUAL:
          this.addIndividual(targetEntity)
          break
        
        case TypesEnum.DATA_PROPERTY:
          this.addDataProperty(targetEntity)
          break
      }
      // targetEntity.is(TypesEnum.CLASS_INSTANCE)
      //   ? this.addClassInstance(targetEntity as ClassInstanceEntity, sourceNode.position())
      //   : this.addClass(targetEntity, sourceNode.position())
      targetNode = this.getEntityCyRepr(targetEntity, targetType)
      if (targetNode.empty()) {
        console.warn(`Unable to find the node that has been automatically added with IRI: ${targetEntity.iri.fullIri}`)
        return
      }
    }

    if (!this.diagramRepresentation ||
      !sourceEntity.is(sourceType) ||
      !targetEntity.is(targetType)
    ) {
      return
    }

    let propertyEdge: GrapholEdge
    if (!propertyEdgeElement) {
      propertyEdge = new GrapholEdge(this.getNewId('edge'), propertyType)
      propertyEdge.displayedName = propertyEntity.getDisplayedName(EntityNameType.LABEL)
      propertyEdge.originalId = propertyEdge.id
      propertyEdge.iri = propertyEntity.iri.fullIri
    } else {
      propertyEdge = propertyEdgeElement
    }

    /**
     * propertyEdge might not have the right source(target)NodeId,
     * can happen loading rdfGraph in VKG having edges between instances
     * that were already present in the diagram.
     * Just set the right IDs anyway, either a custom edge was provided or not.
     */
    propertyEdge.sourceId = sourceNode.id()
    propertyEdge.targetId = targetNode.id()

    propertyEdge.diagramId = this.diagram.id
    propertyEntity.addOccurrence(propertyEdge, this.rendererState)
    this.diagramRepresentation.addElement(propertyEdge, propertyEntity)
    return propertyEdge
  }

  /** @internal */
  addClassInstance(classInstanceEntity: ClassInstanceEntity, instanceNode?: GrapholElement): GrapholNode
  /** @internal */
  addClassInstance(classInstanceEntity: ClassInstanceEntity, position?: Position): GrapholNode
  /** @internal */
  addClassInstance(classInstanceEntity: ClassInstanceEntity): GrapholNode
  /** @internal */
  addClassInstance(classInstanceEntity: ClassInstanceEntity, positionOrElem?: any) {
    if (this.diagramRepresentation?.containsEntity(classInstanceEntity)) {
      const nodeId = classInstanceEntity.getIdInDiagram(this.diagram.id, TypesEnum.CLASS_INSTANCE, this.rendererState)
      if (nodeId)
        return this.diagramRepresentation.grapholElements.get(nodeId)
    }

    let position: Position | undefined, instanceNode: GrapholNode | undefined

    if (positionOrElem && isGrapholNode(positionOrElem)) {
      instanceNode = positionOrElem
      position = instanceNode.position
    } else {
      instanceNode = new GrapholNode(this.getNewId('node'), TypesEnum.CLASS_INSTANCE)

      if (positionOrElem) {
        position = positionOrElem
      }
    }

    if (!position) {
      // check if parent class is present in diagram
      for (let parentClassIri of classInstanceEntity.parentClassIris) {
        if (this.diagramRepresentation?.containsEntity(parentClassIri)) {
          instanceNode.position = this.diagramRepresentation.cy.$id(parentClassIri.fullIri).position()
          break
        }
      }

      if (!instanceNode.position) {
        instanceNode.renderedPosition = this.getCurrentCenterPos()
      }
    } else {
      instanceNode.position = position
    }

    return this._addIndividualOrClassInstance(instanceNode, classInstanceEntity)
  }

  addIndividual(individualEntity: GrapholEntity, position?: Position) {
    if (this.diagramRepresentation?.containsEntity(individualEntity)) {
      const nodeId = individualEntity.getIdInDiagram(this.diagram.id, TypesEnum.INDIVIDUAL, this.rendererState)
      if (nodeId)
        return this.diagramRepresentation.grapholElements.get(nodeId)
    }

    const instanceNode = new GrapholNode(this.getNewId('node'), TypesEnum.INDIVIDUAL)
    if (position)
      instanceNode.position = position
    else
      instanceNode.renderedPosition = this.getCurrentCenterPos()

    return this._addIndividualOrClassInstance(instanceNode, individualEntity)
  }

  private _addIndividualOrClassInstance(grapholNode: GrapholNode, grapholEntity: GrapholEntity) {
    grapholNode.diagramId = this.diagram.id
    grapholNode.displayedName = grapholEntity.getDisplayedName(EntityNameType.LABEL)
    grapholNode.iri = grapholEntity.iri.fullIri
    grapholNode.height = grapholNode.width = 50
    grapholNode.shape = Shape.ELLIPSE
    grapholNode.labelXpos = 0
    grapholNode.labelYpos = 0
    grapholEntity.addOccurrence(grapholNode, this.rendererState)

    this.diagramRepresentation?.addElement(grapholNode, grapholEntity)
    return grapholNode
  }

  public addHierarchy(hierarchy: Hierarchy, position?: Position) {
    if (!this.diagramRepresentation?.cy) {
      return
    }
    let unionNode: GrapholElement | undefined
    /**
     * Check if there is already a hierarchy node of the same type having
     * the same (and only!!) input classes
     */
    const duplicateHierarchy = this.diagramRepresentation.cy.nodes(`[hierarchyID][ type = "${hierarchy.type}" ]`).filter(h => {
      const inputClasses = h.connectedEdges(`[ type = "${TypesEnum.INPUT}" ]`).sources()
      if (inputClasses.length !== hierarchy.inputs.length)
        return false

      // Every new hierarchy inputs must be included in the inputs connected
      // to the hierarchy in test
      return hierarchy.inputs.every(inputClass => inputClasses.some(
        node => inputClass.iri.equals(node.data().iri)
      ))
    }).first()

    if (duplicateHierarchy.nonempty()) {
      unionNode = this.diagramRepresentation.grapholElements.get(duplicateHierarchy.id())
    } else {
      unionNode = hierarchy.getUnionGrapholNode(this.getNewId('node'), position)
      unionNode && this.diagramRepresentation.addElement(unionNode)
    }

    if (!unionNode || !this.diagramRepresentation?.cy)
      return

    unionNode.diagramId = this.diagram.id

    let addedClassNode: GrapholNode
    // Add inputs
    for (const inputClasses of hierarchy.inputs) {
      addedClassNode = this.addClass(inputClasses, position)
      this.addEdge(addedClassNode.id, unionNode.id, TypesEnum.INPUT)
    }

    // Add superclasses
    let inclusionType: TypesEnum
    for (const superClass of hierarchy.superclasses) {
      addedClassNode = this.addClass(superClass.classEntity, position)

      inclusionType = hierarchy.type
      if (superClass.complete || hierarchy.forcedComplete) {
        if (hierarchy.isDisjoint()) {
          inclusionType = TypesEnum.COMPLETE_DISJOINT_UNION
        } else {
          inclusionType = TypesEnum.COMPLETE_UNION
        }
      }

      this.addEdge(unionNode.id, addedClassNode.id, inclusionType)
    }

    return unionNode
  }

  addEdge(sourceId: string,
    targetId: string,
    edgeType: TypesEnum.INCLUSION |
      TypesEnum.EQUIVALENCE |
      TypesEnum.INSTANCE_OF |
      TypesEnum.INPUT |
      TypesEnum.UNION |
      TypesEnum.DISJOINT_UNION |
      TypesEnum.COMPLETE_UNION |
      TypesEnum.COMPLETE_DISJOINT_UNION |
      TypesEnum.ATTRIBUTE_EDGE) {

    const sourceNode = this.diagramRepresentation?.grapholElements.get(sourceId)
    const targetNode = this.diagramRepresentation?.grapholElements.get(targetId)

    const sourceCyNode = this.diagramRepresentation?.cy.$id(sourceId)
    const targetCyNode = this.diagramRepresentation?.cy.$id(targetId)

    if (sourceCyNode && targetCyNode) {
      const edgesAlreadyPresent = sourceCyNode.edgesTo(targetCyNode).filter(e => e.data().type === edgeType)
      if (edgesAlreadyPresent.nonempty()) {
        return this.diagramRepresentation?.grapholElements.get(edgesAlreadyPresent.first().id())
      }
    } else {
      return
    }

    if (sourceNode && targetNode) {
      const instanceEdge = new GrapholEdge(this.getNewId('edge'), edgeType)
      instanceEdge.diagramId = this.diagram.id
      instanceEdge.sourceId = sourceId
      instanceEdge.targetId = targetId

      this.diagramRepresentation?.addElement(instanceEdge)

      return instanceEdge
    }
  }

  public get diagramRepresentation() {
    return this.diagram.representations.get(this.rendererState)
  }

  public toggleFunctionality(entity: GrapholEntity, functional: boolean) {

    const id = entity.getIdInDiagram(this.diagram.id, TypesEnum.DATA_PROPERTY, this.rendererState)
    if (!id) return
    const node = this.diagramRepresentation?.cy.$id(id)
    if (!node) return
    node.data('functional', functional)
  }

  public toggleUnion(node) {
    const type = node.data('type')
    if (type === TypesEnum.UNION) {
      node.removeClass('union')
      node.data('type', TypesEnum.DISJOINT_UNION)
      node.data('displayedName', undefined)
      node.addClass('disjoint-union')
      // edge
      const edge = node.connectedEdges().find(e => e.data('type') === TypesEnum.UNION)
      edge?.data('type', TypesEnum.DISJOINT_UNION)

    } else {
      node.removeClass('disjoint-union')
      node.data('type', TypesEnum.UNION)
      node.data('displayedName', 'or')
      node.data('labelXpos', 0)
      node.data('labelXcentered', true)
      node.data('labelYpos', 0)
      node.data('labelYcentered', true)
      node.addClass('union')
      // edge
      const edge = node.connectedEdges().find(e => e.data('type') === TypesEnum.DISJOINT_UNION)
      edge?.data('type', TypesEnum.UNION)
    }
  }

  public toggleComplete(edge) {

    if (edge.data('targetLabel') === 'C') {
      edge.removeClass('equivalence')
      edge.data('targetLabel', '')
      edge.addClass('inclusion')
    } else {
      edge.removeClass('inclusion')
      edge.data('targetLabel', 'C')
      edge.addClass('equivalence')
    }
  }

  public swapEdge(elem: EdgeSingular) {
    const oldSourceID = elem.data('source')
    const oldTargetID = elem.data('target')
    elem.move({
      source: elem.target().id(),
      target: elem.source().id(),
    })
    elem.data('source', oldTargetID)
    elem.data('target', oldSourceID)
  }

  public removeHierarchy(hierarchy: Hierarchy) {
    if (hierarchy.id) {
      let unionNode = this.diagramRepresentation?.cy.$(`node[hierarchyID = "${hierarchy.id}"]`)
      if (!unionNode || unionNode.empty()) {
        return
      }
      // remove input edges
      unionNode?.connectedEdges(`[ type = "${TypesEnum.INPUT}" ]`)?.forEach(inputEdge => {
        this.diagram?.removeElement(inputEdge.id(), this.rendererState)
      })

      // remove inclusion edges
      unionNode?.connectedEdges(`[ type = "${hierarchy.type}" ]`)?.forEach(inclusionEdge => {
        this.diagram?.removeElement(inclusionEdge.id(), this.rendererState)
      })

      // remove union node
      this.diagram.removeElement(unionNode.id(), this.rendererState)
    }
  }

  public removeHierarchyInputEdge(hierarchy: Hierarchy, inputIri: string) {
    if (hierarchy.id) {
      const unionNode = this.diagramRepresentation?.cy.$(`node[hierarchyID = "${hierarchy.id}"]`)
      unionNode?.edgesWith(`[ iri = "${inputIri}" ]`).forEach(inputEdge => {
        if (inputEdge.data().type === TypesEnum.INPUT)
          this.diagram?.removeElement(inputEdge.id(), this.rendererState)
      })
    }
  }

  public removeHierarchyInclusionEdge(hierarchy: Hierarchy, superclassIri: string) {
    if (hierarchy.id) {
      const unionNode = this.diagramRepresentation?.cy.$(`node[hierarchyID = "${hierarchy.id}"]`)
      unionNode?.edgesTo(`[ iri = "${superclassIri}" ]`).forEach(inclusionEdge => {
        if (inclusionEdge.data().type.replace('complete-', '') === hierarchy.type)
          this.diagram?.removeElement(inclusionEdge.id(), this.rendererState)
      })
    }
  }

  public removeElement(id: string) {
    const cyElem = this.diagramRepresentation?.cy.$id(id)
    const grapholElem = this.diagramRepresentation?.grapholElements.get(id)

    if (cyElem?.nonempty()) {

      if (grapholElem && grapholElem.is(TypesEnum.DATA_PROPERTY)) {
        cyElem.connectedEdges().forEach(e => {
          this.diagramRepresentation?.removeElement(e.id())
        })
      }

      this.diagramRepresentation?.removeElement(id)
    }
  }

  public renameElement(elemId: string, newIri: Iri) {
    const cyElem = this.diagramRepresentation?.cy.$id(elemId)
    cyElem?.data('iri', newIri.fullIri)
    cyElem?.data('displayedName', newIri.remainder)
    const grapholElem = this.diagramRepresentation?.grapholElements.get(elemId)
    if (!grapholElem) return
    grapholElem.iri = newIri.fullIri
    grapholElem.displayedName = newIri.remainder
  }

  /**
   * Get cytoscape representation of an entity given the type needed
   * @param entity 
   * @param type 
   * @returns 
   */
  public getEntityCyRepr(entity: GrapholEntity, type: TypesEnum) {
    const occurrenceID = entity.getIdInDiagram(this.diagram.id, type, this.rendererState)
    if (occurrenceID)
      return this.diagramRepresentation?.cy.$id(occurrenceID) || cytoscape().collection()
    else
      return cytoscape().collection()
  }

  public getNewId(nodeOrEdge: 'node' | 'edge') {
    return this.diagramRepresentation?.getNewId(nodeOrEdge) || (nodeOrEdge === 'node' ? 'n0' : 'e0')
  }

  private getCurrentCenterPos() {
    const height = this.diagramRepresentation?.cy.height() || 0
    const width = this.diagramRepresentation?.cy.width() || 0

    let pos = {
      x: (width / 2) + Math.random() * 50,
      y: (height / 2) + Math.random() * 50,
    }

    return pos
  }
}