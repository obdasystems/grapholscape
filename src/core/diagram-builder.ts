import cytoscape, { Position } from "cytoscape";
import { EntityNameType } from "../config";
import { ClassInstanceEntity, Diagram, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, GrapholTypesEnum, Hierarchy, isGrapholNode, RendererStatesEnum, Shape } from "../model";
import getIdFromEntity from "../util/get-id-from-entity";

export default class DiagramBuilder {

  constructor(public diagram: Diagram, private rendererState: RendererStatesEnum) { }

  addClass(classEntity: GrapholEntity, position?: Position) {

    //if (this.diagramRepresentation?.containsEntity(classEntity)) {
    const nodeId = getIdFromEntity(classEntity, this.diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
    if (nodeId)
        return this.diagramRepresentation?.grapholElements.get(nodeId)
    //}

    const classNode = new GrapholNode(this.getNewId('node'), GrapholTypesEnum.CLASS)
    classNode.iri = classEntity.iri.fullIri
    classNode.displayedName = classEntity.getDisplayedName(EntityNameType.LABEL)
    classNode.height = classNode.width = 80
    classNode.position = position || { x: 0, y: 0 }
    classNode.originalId = classNode.id
    classNode.diagramId = this.diagram.id

    classEntity.addOccurrence(classNode, this.rendererState)

    this.diagramRepresentation?.addElement(classNode, classEntity)

    return classNode
  }

  addDataProperty(dataPropertyEntity: GrapholEntity, ownerEntity: GrapholEntity) {

    const dataPropertyNode = new GrapholNode(this.getNewId('node'), GrapholTypesEnum.DATA_PROPERTY)

    const ownerEntityId = getIdFromEntity(ownerEntity, this.diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
    if (!ownerEntityId) return
    let ownerEntityNode = this.diagramRepresentation?.grapholElements.get(ownerEntityId)

    if (!dataPropertyNode || !ownerEntityNode) return

    dataPropertyNode.diagramId = this.diagram.id
    dataPropertyNode.iri = dataPropertyEntity.iri.fullIri
    dataPropertyNode.displayedName = dataPropertyEntity.getDisplayedName(EntityNameType.LABEL);
    if (isGrapholNode(ownerEntityNode)) {
      dataPropertyNode.position = ownerEntityNode.position
    }

    dataPropertyNode.originalId = dataPropertyNode.id
    dataPropertyEntity.addOccurrence(dataPropertyNode, RendererStatesEnum.FLOATY)

    const dataPropertyEdge = new GrapholEdge(this.getNewId('edge'), GrapholTypesEnum.DATA_PROPERTY)
    dataPropertyEdge.diagramId = this.diagram.id
    dataPropertyEdge.sourceId = ownerEntityNode.id
    dataPropertyEdge.targetId = dataPropertyNode.id
    this.diagramRepresentation?.addElement(dataPropertyNode, dataPropertyEntity)
    this.diagramRepresentation?.addElement(dataPropertyEdge)

    return dataPropertyNode
  }

  addObjectProperty(
    objectPropertyEntity: GrapholEntity,
    sourceEntity: GrapholEntity,
    targetEntity: GrapholEntity,
    nodesType: GrapholTypesEnum
  ) {

    // if both object property and range class are already present, do not add them again
    let sourceNode = this.getEntityCyRepr(sourceEntity, nodesType)
    let targetNode = this.getEntityCyRepr(targetEntity, nodesType)

    if (sourceNode.nonempty() && targetNode.nonempty()) {
      /**
       * If the set of edges between reference node and the connected class
       * includes the object property we want to add, then it's already present.
       */
      let edgesAlreadyPresent = sourceNode.edgesWith(targetNode)
        .filter(e => e.data().iri === objectPropertyEntity.iri.fullIri)
      if (edgesAlreadyPresent.nonempty()) {
        return this.diagramRepresentation
          ?.grapholElements
          .get(edgesAlreadyPresent.first().id())
      }
    }

    if (sourceNode.empty()) {
      sourceEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(sourceEntity as ClassInstanceEntity) : this.addClass(sourceEntity)
      sourceNode = this.getEntityCyRepr(sourceEntity, nodesType)
      if (sourceNode.empty()) {
        console.warn(`Unable to find the node that has been automatically added with IRI: ${sourceEntity.iri.fullIri}`)
        return
      }
    }
    if (targetNode.empty()) {
      targetEntity.is(GrapholTypesEnum.CLASS_INSTANCE) ? this.addClassInstance(targetEntity as ClassInstanceEntity) : this.addClass(targetEntity)
      targetNode = this.getEntityCyRepr(targetEntity, nodesType)
      if (targetNode.empty()) {
        console.warn(`Unable to find the node that has been automatically added with IRI: ${targetEntity.iri.fullIri}`)
        return
      }
    }

    if (!this.diagramRepresentation ||
      !sourceEntity.is(nodesType) ||
      !targetEntity.is(nodesType)
    ) {
      return
    }

    const objectPropertyEdge = new GrapholEdge(this.getNewId('edge'), GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.diagramId = this.diagram.id
    objectPropertyEdge.displayedName = objectPropertyEntity.getDisplayedName(EntityNameType.LABEL)
    objectPropertyEdge.sourceId = sourceNode.id()
    objectPropertyEdge.targetId = targetNode.id()
    objectPropertyEdge.originalId = objectPropertyEdge.id
    objectPropertyEdge.iri = objectPropertyEntity.iri.fullIri
    objectPropertyEntity.addOccurrence(objectPropertyEdge, this.rendererState)
    this.diagramRepresentation.addElement(objectPropertyEdge, objectPropertyEntity)
    return objectPropertyEdge
  }

  addClassInstance(classInstanceEntity: ClassInstanceEntity, position?: Position) {
    if (this.diagramRepresentation?.containsEntity(classInstanceEntity)) {
      const nodeId = getIdFromEntity(classInstanceEntity, this.diagram.id, GrapholTypesEnum.CLASS_INSTANCE, this.rendererState)
      if (nodeId)
        return this.diagramRepresentation.grapholElements.get(nodeId)
    }

    const instanceNode = new GrapholNode(this.getNewId('node'), GrapholTypesEnum.CLASS_INSTANCE)

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

    return this._addIndividualOrClassInstance(instanceNode, classInstanceEntity)
  }

  addIndividual(individualEntity: GrapholEntity, position?: Position) {
    if (this.diagramRepresentation?.containsEntity(individualEntity)) {
      const nodeId = getIdFromEntity(individualEntity, this.diagram.id, GrapholTypesEnum.CLASS_INSTANCE, this.rendererState)
      if (nodeId)
        return this.diagramRepresentation.grapholElements.get(nodeId)
    }

    const instanceNode = new GrapholNode(this.getNewId('node'), GrapholTypesEnum.CLASS_INSTANCE)
    instanceNode.position = position || { x: 0, y: 0 }

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
    const unionNode = hierarchy.getUnionGrapholNode(position)
    
    if (!unionNode)
      return
    
    //hierarchy.id = `${unionNode.id}-${this.diagram.id}` 
    // Add inputs
    for (const inputClasses of hierarchy.inputs) {
      this.addClass(inputClasses, position)
    }

    // Add superclasses
    for (const superClass of hierarchy.superclasses) {
      this.addClass(superClass.classEntity, position)
    }

    const inputEdges = hierarchy.getInputGrapholEdges(this.diagram.id, this.rendererState)
    const inclusionEdges = hierarchy.getInclusionEdges(this.diagram.id, this.rendererState)

    if (!inputEdges || !inclusionEdges)
      return

    this.diagramRepresentation?.addElement(unionNode)

    inputEdges.forEach(inputEdge => this.diagramRepresentation?.addElement(inputEdge))
    inclusionEdges.forEach(inclusionEdge => this.diagramRepresentation?.addElement(inclusionEdge))
  }

  addEdge(sourceId: string,
    targetId: string,
    edgeType: GrapholTypesEnum.INCLUSION |
      GrapholTypesEnum.EQUIVALENCE |
      GrapholTypesEnum.INSTANCE_OF |
      GrapholTypesEnum.INPUT) {

    const sourceNode = this.diagramRepresentation?.grapholElements.get(sourceId)
    const targetNode = this.diagramRepresentation?.grapholElements.get(targetId)

    const sourceCyNode = this.diagramRepresentation?.cy.$id(sourceId)
    const targetCyNode = this.diagramRepresentation?.cy.$id(targetId)

    if (sourceCyNode && targetCyNode) {
      const edgesAlreadyPresent = sourceCyNode.edgesTo(targetCyNode).filter(e => e.data().type === edgeType)
      if (edgesAlreadyPresent.nonempty()) {
        return edgesAlreadyPresent.first()
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

  public toggleFunctionality(entity, functional) {

    const id = getIdFromEntity(entity, this.diagram.id, GrapholTypesEnum.DATA_PROPERTY, this.rendererState)
    if (!id) return
    const node = this.diagramRepresentation?.cy.$id(id)
    if (!node) return
    node.data('functional', functional)
  }

  public toggleUnion(node) {
    const type = node.data('type')
    if (type === GrapholTypesEnum.UNION) {
      node.removeClass('union')
      node.data('type', GrapholTypesEnum.DISJOINT_UNION)
      node.data('displayedName', undefined)
      node.addClass('disjoint-union')
      // edge
      const edge = node.connectedEdges().find(e => e.data('type') === GrapholTypesEnum.UNION)
      edge?.data('type', GrapholTypesEnum.DISJOINT_UNION)

    } else {
      node.removeClass('disjoint-union')
      node.data('type', GrapholTypesEnum.UNION)
      node.data('displayedName', 'or')
      node.data('labelXpos', 0)
      node.data('labelXcentered', true)
      node.data('labelYpos', 0)
      node.data('labelYcentered', true)
      node.addClass('union')
      // edge
      const edge = node.connectedEdges().find(e => e.data('type') === GrapholTypesEnum.DISJOINT_UNION)
      edge?.data('type', GrapholTypesEnum.UNION)
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

  public removeHierarchy(hierarchy: Hierarchy) {
    if (hierarchy.id) {
      let unionNode = this.diagramRepresentation?.cy.$(`node[hierarchyID = "${hierarchy.id}"]`)
      if(!unionNode || unionNode.empty()){
        return
      }
      // remove input edges
      unionNode?.connectedEdges(`[ type = "${GrapholTypesEnum.INPUT}" ]`)?.forEach(inputEdge => {
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
      const unionNode = this.diagramRepresentation?.cy.$id(hierarchy.id)
      unionNode?.edgesTo(`[ iri = "${inputIri}" ]`).forEach(inputEdge => {
        if (inputEdge.data().type === GrapholTypesEnum.INPUT)
          this.diagram?.removeElement(inputEdge.id(), this.rendererState)
      })
    }
  }

  public removeHierarchyInclusionEdge(hierarchy: Hierarchy, superclassIri: string) {
    if (hierarchy.id) {
      const unionNode = this.diagramRepresentation?.cy.$(`node[hierarchyID = "${hierarchy.id}"]`)
      unionNode?.edgesTo(`[ iri = "${superclassIri}" ]`).forEach(inclusionEdge => {
        if (inclusionEdge.data().type === hierarchy.type)
          this.diagram?.removeElement(inclusionEdge.id(), this.rendererState)
      })
    }
  }

  public removeElement(id: string) {
    const cyElem = this.diagramRepresentation?.cy.$id(id)
    const grapholElem = this.diagramRepresentation?.grapholElements.get(id)

    if (cyElem?.nonempty() && grapholElem) {

      if (grapholElem.is(GrapholTypesEnum.DATA_PROPERTY)) {
        cyElem.connectedEdges().forEach(e => {
          this.diagramRepresentation?.removeElement(e.id())
        })
      }

      this.diagramRepresentation?.removeElement(id)
    }
  }
  

  /**
   * Get cytoscape representation of an entity given the type needed
   * @param entity 
   * @param type 
   * @returns 
   */
  private getEntityCyRepr(entity: GrapholEntity, type: GrapholTypesEnum) {
    const occurrenceID = getIdFromEntity(entity, this.diagram.id, type, this.rendererState)
    if (occurrenceID)
      return this.diagramRepresentation?.cy.$id(occurrenceID) || cytoscape().collection()
    else
      return cytoscape().collection()
  }

  public getNewId(nodeOrEdge: 'node' | 'edge') {
    let newId = nodeOrEdge === 'node' ? 'n' : 'e'
    let count = this.diagramRepresentation?.cy.elements.length
    if(count){
      count = count+1
      while(!this.diagramRepresentation?.cy.$id(newId+count).empty()){
        count = count+1
      }
      return newId+count
    }

    return newId+0
  }
}