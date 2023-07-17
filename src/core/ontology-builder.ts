import { SingularElementArgument } from "cytoscape"
import { floatyOptions } from "../config"
import { ClassInstanceEntity, Diagram, DiagramRepresentation, FunctionalityEnum, GrapholEntity, GrapholTypesEnum, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum } from "../model"
import getIdFromEntity from "../util/get-id-from-entity"
import DiagramBuilder from "./diagram-builder"
import Grapholscape from "./grapholscape"

export default class OntologyBuilder {

  grapholscape: Grapholscape
  diagramBuilder: DiagramBuilder
  private rendererState = RendererStatesEnum.FLOATY

  constructor(grapholscape) {
    this.grapholscape = grapholscape
  }

  public addNodeElement(iriString: string, entityType: GrapholTypesEnum, ownerIri?: string, relationship?: string, functionalities: string[] = [], datatype = '') {

    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
    if (entityType === GrapholTypesEnum.INDIVIDUAL && ownerIri) {
      const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
      if (!ownerEntity) return
      const instanceEntity = new ClassInstanceEntity(iri, [ownerEntity?.iri])
      this.grapholscape.ontology.addEntity(instanceEntity)
      this.diagramBuilder.addClassInstance(instanceEntity)
      const sourceId = getIdFromEntity(instanceEntity, diagram.id, GrapholTypesEnum.CLASS_INSTANCE, this.rendererState)
      const targetId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
      if (!sourceId || !targetId) return
      this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INSTANCE_OF)
      this.grapholscape.renderer.renderState?.runLayout()
      return
    }

    const entity = new GrapholEntity(iri)
    this.grapholscape.ontology.addEntity(entity)
    if (entityType === GrapholTypesEnum.DATA_PROPERTY && ownerIri) {
      entity.datatype = datatype
      if (functionalities.includes('functional')) {
        entity.functionalities = [FunctionalityEnum.functional]
      }
      const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
      if (ownerEntity)
        this.diagramBuilder.addDataProperty(entity, ownerEntity)
    }
    else if (entityType === GrapholTypesEnum.CLASS) {
      this.diagramBuilder.addClass(entity)
      if (!ownerIri) return
      const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
      if (!ownerEntity) return
      if (relationship === 'superclass') {
        const sourceId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
        const targetId = getIdFromEntity(entity, diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
        if (!sourceId || !targetId) return
        this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
      } else if (relationship === 'subclass') {
        const sourceId = getIdFromEntity(entity, diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
        const targetId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, this.rendererState)
        if (!sourceId || !targetId) return
        this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
      }
    }
    this.grapholscape.renderer.renderState?.runLayout()
    this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
  }

  public addEdgeElement(iriString: string | null = null, edgeType: GrapholTypesEnum, sourceId: string, targetId: string, nodesType: GrapholTypesEnum, functionalities: string[] = []) {

    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const sourceEntity = this.grapholscape.ontology.getEntity(sourceId)
    const targetEntity = this.grapholscape.ontology.getEntity(targetId)
    if (!sourceEntity || !targetEntity) return

    if (iriString && edgeType === GrapholTypesEnum.OBJECT_PROPERTY) {
      const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
      const entity = new GrapholEntity(iri)
      this.grapholscape.ontology.addEntity(entity)
      this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity, GrapholTypesEnum.CLASS)
      functionalities.forEach(i => {
        entity.functionalities.push(FunctionalityEnum[i])
      })
      this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
    }
    else if (edgeType === GrapholTypesEnum.INCLUSION) {
      const sourceID = getIdFromEntity(sourceEntity, diagram.id, nodesType, this.rendererState)
      const targetID = getIdFromEntity(targetEntity, diagram.id, nodesType, this.rendererState)
      if (!sourceID || !targetID) return
      this.diagramBuilder.addEdge(sourceID, targetID, edgeType)
    }
  }

  public addDiagram(name) {
    const id = this.grapholscape.ontology.diagrams.length
    const newDiagram = new Diagram(name, id)
    newDiagram.representations.set(this.rendererState, new DiagramRepresentation(floatyOptions))
    this.grapholscape.ontology.addDiagram(newDiagram)
    this.grapholscape.showDiagram(id)
    this.grapholscape.lifecycle.trigger(LifecycleEvent.DiagramAddition, newDiagram)
  }

  public addSubhierarchy(iris: string[], ownerIri: string, disjoint = false, complete = false) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const hierarchy = disjoint ? new Hierarchy(GrapholTypesEnum.DISJOINT_UNION) : new Hierarchy(GrapholTypesEnum.UNION)
    hierarchy.id = this.diagramBuilder.getNewId('node')+'-'+diagram.id
    const superClass = this.grapholscape.ontology.getEntity(ownerIri)
    if (!superClass) return
    hierarchy.addSuperclass(superClass, complete)
    for (let i of iris) {
      const iri = new Iri(i, this.grapholscape.ontology.namespaces)
      const entity = new GrapholEntity(iri)
      this.grapholscape.ontology.addEntity(entity)
      hierarchy.addInput(entity)
    }
    this.diagramBuilder.addHierarchy(hierarchy, { x: 0, y: 0 })

    let subHierarchies = this.grapholscape.ontology.hierarchiesBySuperclassMap.get(ownerIri)
    if (!subHierarchies) {
      this.grapholscape.ontology.hierarchiesBySuperclassMap.set(ownerIri, [hierarchy])
    } else {
      subHierarchies.push(hierarchy)
    }

    iris.forEach(inputIri => {
      let superHierarchies = this.grapholscape.ontology.hierarchiesBySubclassMap.get(inputIri)
      if (!superHierarchies) {
        this.grapholscape.ontology.hierarchiesBySubclassMap.set(inputIri, [hierarchy])
      } else {
        superHierarchies.push(hierarchy)
      }
    })

    this.grapholscape.renderer.renderState?.runLayout()
  }

  public removeEntity(cyOccurrence: SingularElementArgument, entity: GrapholEntity) {
    const diagram = this.grapholscape.renderer.diagram
    if (diagram) {
      this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
      const grapholElem = diagram.representations.get(this.rendererState)?.grapholElements.get(cyOccurrence.id())
      if (grapholElem) {

        if (cyOccurrence.isNode() && entity.is(GrapholTypesEnum.CLASS)) {
          this.grapholscape.ontology.hierarchiesBySubclassMap.get(entity.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchyInput(hierarchy, entity.iri.fullIri)
          })

          this.grapholscape.ontology.hierarchiesBySuperclassMap.get(entity.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchySuperclass(hierarchy, entity.iri.fullIri)
          })

          cyOccurrence.connectedEdges(`[ type = "${GrapholTypesEnum.OBJECT_PROPERTY}" ]`).forEach(opEdge => {
            const entity = this.grapholscape.ontology.getEntity(opEdge.data().iri)
            if (entity) {
              this.removeEntity(opEdge, entity)
            }
          })

          cyOccurrence.neighborhood(`node[ type = "${GrapholTypesEnum.DATA_PROPERTY}" ]`).forEach(dpNode => {
            const entity = this.grapholscape.ontology.getEntity(dpNode.data().iri)
            if (entity) {
              this.removeEntity(dpNode, entity)
            }
          })
        }


        entity.removeOccurrence(grapholElem, this.rendererState)
        this.diagramBuilder.removeElement(cyOccurrence.id())
        const occurrences = entity.occurrences.get(this.rendererState)
        if (occurrences && occurrences.length === 0) {
          this.grapholscape.ontology.entities.delete(entity.iri.fullIri)
        }
      }
    }
  }

  public removeHierarchy(hierarchy: Hierarchy){

    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)

    
    hierarchy.inputs.forEach(i => {
      const map = this.grapholscape.ontology.hierarchiesBySubclassMap.get(i.iri.fullIri)
      map?.splice(map.findIndex(h => h.id === hierarchy.id), 1)
    })
    hierarchy.superclasses.forEach(s => {
      const hierarchies = this.grapholscape.ontology.hierarchiesBySuperclassMap.get(s.classEntity.iri.fullIri)
      hierarchies?.splice(hierarchies.findIndex(h => h.id === hierarchy.id), 1)
    })

    if(hierarchy.id)
      this.diagramBuilder.removeHierarchy(hierarchy)
  }


  public removeHierarchyInput(hierarchy: Hierarchy, inputIri: string) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)

    const entity = this.grapholscape.ontology.getEntity(inputIri)
    if (entity) {
      hierarchy.removeInput(entity)
      this.diagramBuilder.removeHierarchyInputEdge(hierarchy, inputIri)
    }
  }

  public removeHierarchySuperclass(hierarchy: Hierarchy, superclassIri: string) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)

    const entity = this.grapholscape.ontology.getEntity(superclassIri)
    if (entity) {
      hierarchy.removeSuperclass(entity)
      this.diagramBuilder.removeHierarchyInclusionEdge(hierarchy, superclassIri)
    }
  }

  public toggleFunctionality(iri) {
    const entity = this.grapholscape.ontology.getEntity(iri)
    if (entity?.hasFunctionality(FunctionalityEnum.functional)) {
      entity.functionalities = []
    } else {
      entity?.functionalities.push(FunctionalityEnum.functional)
    }
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    this.diagramBuilder.toggleFunctionality(entity, entity?.hasFunctionality(FunctionalityEnum.functional))

  }

  public toggleUnion(elem) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    this.diagramBuilder.toggleUnion(elem)
  }

  public toggleComplete(elem) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    this.diagramBuilder.toggleComplete(elem)
  }
}