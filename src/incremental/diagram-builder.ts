import { NodeDefinition } from "cytoscape";
import { Diagram, GrapholEdge, GrapholEntity, GrapholNode, GrapholTypesEnum, Ontology, RendererStatesEnum, Shape } from "../model";

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

  private addObjectProperty(objectPropertyEntity: GrapholEntity, connectedClassEntity: GrapholEntity, direct: boolean) {
    if (!this.referenceNodeId) return

    const connectedClassNode = this.getEntityElement(connectedClassEntity.iri.fullIri) as GrapholNode
    connectedClassNode.id = connectedClassEntity.iri.prefixed
    connectedClassNode.position = this.referenceNodePosition

    const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${connectedClassNode.id}`)
    objectPropertyEdge.type = GrapholTypesEnum.OBJECT_PROPERTY
    objectPropertyEdge.sourceId = direct ? this.referenceNodeId : connectedClassNode.id
    objectPropertyEdge.targetId = direct ? connectedClassNode.id : this.referenceNodeId

    this.diagram.addElement(connectedClassNode, connectedClassEntity)
    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
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

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}