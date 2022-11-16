import cytoscape, { Collection, EdgeCollection, EdgeSingular, NodeDefinition } from "cytoscape";
import { Diagram, GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, Ontology, RendererStatesEnum, Shape } from "../model";
import { ClassInIsa, Hierarchy } from "./neighbourhood-finder";

export default class DiagramBuilder {
  /** The class to which new entities/instances will be connected */
  referenceNodeId: string | undefined

  constructor(private ontology: Ontology, public diagram: Diagram) { }

  addEntity(entityIri: string, connectedClassIri?: string, directObjectProperty?: boolean) {
    const grapholEntity = this.ontology.getEntity(entityIri)

    if (grapholEntity) {
      switch (grapholEntity.type) {
        case GrapholTypesEnum.DATA_PROPERTY:
          this.addDataProperty(grapholEntity)
          break

        case GrapholTypesEnum.OBJECT_PROPERTY:
          const connectedClassGrapholEntity = this.ontology.getEntity(connectedClassIri)
          this.addObjectProperty(grapholEntity, connectedClassGrapholEntity, directObjectProperty)
          break

        default:
          return
      }
    }
  }

  addClassInstance(iri: string) {
    const instanceNode = new GrapholNode(iri)

    instanceNode.position = this.referenceNodePosition
    instanceNode.displayedName = iri
    instanceNode.height = instanceNode.width = 50
    instanceNode.shape = Shape.ELLIPSE
    instanceNode.labelXpos = 0
    instanceNode.labelYpos = 0
    instanceNode.type = GrapholTypesEnum.CLASS_INSTANCE

    const instanceEdge = new GrapholEdge(`${this.referenceNodeId}-instance-${iri}`)

    instanceEdge.type = GrapholTypesEnum.CLASS_INSTANCE
    instanceEdge.sourceId = instanceNode.id
    instanceEdge.targetId = this.referenceNodeId

    this.diagram.addElement(instanceNode)
    this.diagram.addElement(instanceEdge)
  }

  removeEntity(entityIri: string) {
    this.diagramRepresentation.cy.$(`[iri = "${entityIri}"]`).forEach(element => {
      this.diagramRepresentation.removeElement(element.id())
    })
  }

  addHierarchy(hierarchy: Hierarchy) {

    this.diagram.addElement(hierarchy.unionNode)

    // Add inputs
    hierarchy.inputs.forEach(inputClass => {
      this.addClass(inputClass)

      const newInputEdge = new GrapholEdge(Date.now().toString())
      newInputEdge.type = GrapholTypesEnum.INPUT
      
      newInputEdge.sourceId = inputClass.iri.prefixed
      newInputEdge.targetId = hierarchy.unionNode.id
      this.diagram.addElement(newInputEdge)
    })
    
    // Add super classes
    hierarchy.superclasses.forEach(superClass => {
      this.addClass(superClass.class)
      const newUnionEdge = new GrapholEdge(Date.now().toString())
      newUnionEdge.type = hierarchy.unionNode.type
      
      newUnionEdge.sourceId = hierarchy.unionNode.id
      newUnionEdge.targetId = superClass.class.iri.prefixed
      this.diagram.addElement(newUnionEdge)
    })
  }

  addClassInIsa(classInIsa: ClassInIsa) {

  }

  addCollection(collection: Collection) {
    // collection = collection.clone() // avoid side effects

    collection.nodes().forEach(node => {
      if (this.diagramRepresentation.cy.$id(node.id()).empty()) {
        if (node.data().iri) {
          this.addEntity(node.data().iri)
        } else {
          this.diagramRepresentation.cy.add(node)
        }
      }
    })

    // this.updateEdgesTargetSourceIdToIris(collection)

    collection.edges().forEach(edge => {
      if (this.diagramRepresentation.cy.$id(edge.id()).empty()) {
        let newSource: string, newTarget: string
        const source = collection.$id(edge.data().source)
        const target = collection.$id(edge.data().target)

        if (source.nonempty() && source.data().iri)
          newSource = source.data().iri

        if (target.nonempty() && target.data().iri)
          newTarget = target.data().iri


        const newEdge = edge.data({
          source: newSource || this.referenceNodeIri,
          target: newTarget || this.referenceNodeIri
        })


        this.diagramRepresentation.cy.add(newEdge)
      }
    })
  }

  removeCollection(collection: Collection) {
    collection.forEach(element => {
      if (this.diagramRepresentation.cy.$id(element.id()).nonempty()) {
        this.diagramRepresentation.removeElement(element.id())
      }
    })
  }

  // /**
  //  * Given a set of edges, set source-id and target-id on edges to be the target's and source's iri
  //  * Reason: In incremental diagram, if a node is an entity, it has its iri as id.
  //  * @param collection 
  //  */
  // private updateEdgesTargetSourceIdToIris(edge: EdgeSingular) {
  //   const source = collection.$id(edge.data().source)
  //   const target = collection.$id(edge.data().target)


  // }

  private addObjectProperty(objectPropertyEntity: GrapholEntity, connectedClassEntity: GrapholEntity, direct: boolean) {
    if (!this.referenceNodeId) return

    this.addClass(connectedClassEntity)
    const connectedClassIri = connectedClassEntity.iri.prefixed 
    const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${connectedClassIri}`)
    objectPropertyEdge.type = GrapholTypesEnum.OBJECT_PROPERTY
    objectPropertyEdge.sourceId = direct ? this.referenceNodeId : connectedClassIri
    objectPropertyEdge.targetId = direct ? connectedClassIri : this.referenceNodeId

    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  private addClass(classEntity: GrapholEntity) {
    const connectedClassNode = this.getEntityElement(classEntity.iri.fullIri) as GrapholNode
    connectedClassNode.id = classEntity.iri.prefixed
    connectedClassNode.position = this.referenceNodePosition

    this.diagram.addElement(connectedClassNode, classEntity)
  }

  private addDataProperty(dataPropertyEntity: GrapholEntity) {
    if (!this.referenceNodeId) return

    const dataPropertyNode = this.getEntityElement(dataPropertyEntity.iri.fullIri)
    dataPropertyNode.id = dataPropertyEntity.iri.prefixed

    const dataPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${dataPropertyNode.id}`)
    dataPropertyEdge.type = GrapholTypesEnum.DATA_PROPERTY
    dataPropertyEdge.sourceId = this.referenceNodeId
    dataPropertyEdge.targetId = dataPropertyNode.id

    this.diagram.addElement(dataPropertyNode, dataPropertyEntity)
    this.diagram.addElement(dataPropertyEdge)
  }

  private getEntityElement(entityIri: string) {
    const occurrences = this.ontology.getEntityOccurrences(entityIri).get(RendererStatesEnum.GRAPHOL)

    if (occurrences) {
      const occurrence = occurrences[0]
      return this.ontology
        .getDiagram(occurrence.diagramId)
        .representations.get(RendererStatesEnum.FLOATY)
        .grapholElements.get(occurrence.elementId)
        .clone()
    }
  }

  private get referenceNodePosition() {
    return (this.diagram
      .representations.get(RendererStatesEnum.INCREMENTAL)
      .grapholElements.get(this.referenceNodeId) as GrapholNode).position
  }

  private get referenceNodeIri() {
    return this.diagramRepresentation.cy.$id(this.referenceNodeId)?.data().iri as string
  }

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}