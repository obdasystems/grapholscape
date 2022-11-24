import { EdgeSingular } from "cytoscape";
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
    const instanceNode = new GrapholNode(iri, GrapholTypesEnum.CLASS_INSTANCE)

    instanceNode.position = this.referenceNodePosition || { x: 0, y: 0 }
    instanceNode.displayedName = iri
    instanceNode.height = instanceNode.width = 50
    instanceNode.shape = Shape.ELLIPSE
    instanceNode.labelXpos = 0
    instanceNode.labelYpos = 0

    const instanceEdge = new GrapholEdge(`${this.referenceNodeId}-instance-${iri}`, GrapholTypesEnum.CLASS_INSTANCE)
    instanceEdge.sourceId = instanceNode.id
    instanceEdge.targetId = this.referenceNodeId

    this.diagram.addElement(instanceNode)
    this.diagram.addElement(instanceEdge)
  }

  removeEntity(entityIri: string) {
    this.diagramRepresentation?.cy.$(`[iri = "${entityIri}"]`).forEach(element => {
      if (element.data().type === GrapholTypesEnum.CLASS) {
        element.neighborhood(`[type = "${GrapholTypesEnum.CLASS_INSTANCE}"]`).forEach(classInstanceElement => {
          // remove nodes only if they have 1 connection, i.e. with the class we want to remove
          if (classInstanceElement.isNode()) {
            if (classInstanceElement.degree(false) === 1) {
              this.diagram.removeElement(classInstanceElement.id())
            }
          } else {
            // edges must be removed anyway
            // (cytoscape removes them automatically
            // but we need to update the grapholElements 
            // map too in diagram representation)
            this.diagram.removeElement((classInstanceElement as EdgeSingular).id()) // cast should not be needed, maybe error in cytoscape types
          }
        })

        element.neighborhood(`[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`).forEach(dataPropertyElement => {
          if (dataPropertyElement.isNode()) {
            if (dataPropertyElement.degree(false) === 1) {
              this.diagram.removeElement(dataPropertyElement.id())
            }
          } else {
            this.diagram.removeElement((dataPropertyElement as EdgeSingular).id())
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

  private addObjectProperty(objectPropertyEntity: GrapholEntity, connectedClassEntity: GrapholEntity, direct: boolean) {
    if (!this.referenceNodeId) return

    this.addClass(connectedClassEntity)
    const connectedClassIri = connectedClassEntity.iri.prefixed
    const objectPropertyEdge = new GrapholEdge(`${this.referenceNodeId}-${objectPropertyEntity.iri.prefixed}-${connectedClassIri}`, GrapholTypesEnum.OBJECT_PROPERTY)
    objectPropertyEdge.sourceId = direct ? this.referenceNodeId : connectedClassIri
    objectPropertyEdge.targetId = direct ? connectedClassIri : this.referenceNodeId

    this.diagram.addElement(objectPropertyEdge, objectPropertyEntity)
  }

  private addClass(classEntity: GrapholEntity) {
    const classNode = this.getEntityElement(classEntity.iri.fullIri) as GrapholNode
    classNode.id = classEntity.iri.fullIri
    classNode.position = this.referenceNodePosition || classNode.position

    this.diagram.addElement(classNode, classEntity)
  }

  private addDataProperty(dataPropertyEntity: GrapholEntity) {
    if (!this.referenceNodeId) return

    const dataPropertyNode = this.getEntityElement(dataPropertyEntity.iri.fullIri)

    if (!dataPropertyNode) return

    dataPropertyNode.id = dataPropertyEntity.iri.fullIri

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
    if (this.referenceNodeId)
      return (this.diagram
        .representations.get(RendererStatesEnum.INCREMENTAL)
        ?.grapholElements.get(this.referenceNodeId) as GrapholNode)?.position
  }

  private get referenceNodeIri() {
    if (this.referenceNodeId)
      return this.diagramRepresentation?.cy.$id(this.referenceNodeId)?.data().iri as string
  }

  private get diagramRepresentation() {
    return this.diagram.representations.get(RendererStatesEnum.INCREMENTAL)
  }
}