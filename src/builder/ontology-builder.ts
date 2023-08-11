import { SingularElementArgument } from "cytoscape"
import { floatyOptions } from "../config"
import { Diagram, DiagramRepresentation, FunctionalityEnum, GrapholEntity, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../model"
import DiagramBuilder from "../core/diagram-builder"
import Grapholscape from "../core/grapholscape"

export default class OntologyBuilder {

  grapholscape: Grapholscape
  diagramBuilder: DiagramBuilder
  private rendererState = RendererStatesEnum.FLOATY

  constructor(grapholscape) {
    this.grapholscape = grapholscape
  }

  public addNodeElement(iriString: string, entityType: TypesEnum, ownerIri?: string, relationship?: string, functionProperties: string[] = [], datatype = '') {

    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
    let entity = this.grapholscape.ontology.getEntity(iriString)
    if (!entity) {
      entity = new GrapholEntity(iri)
      this.grapholscape.ontology.addEntity(entity)
    }

    let ownerEntity: GrapholEntity | undefined
    if (ownerIri)
      ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)

    if (entityType === TypesEnum.INDIVIDUAL && ownerEntity) {
      const targetId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, this.rendererState)
      this.diagramBuilder.addIndividual(entity)
      const sourceId = entity.getIdInDiagram(diagram.id, TypesEnum.INDIVIDUAL, this.rendererState)

      if (!sourceId || !targetId) return
      this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INSTANCE_OF)
      this.grapholscape.renderer.renderState?.runLayout()
      return
    }

    if (entityType === TypesEnum.DATA_PROPERTY && ownerEntity) {
      entity.datatype = datatype
      if (functionProperties.includes(FunctionalityEnum.FUNCTIONAL)) {
        entity.isDataPropertyFunctional = true
      }

      this.diagramBuilder.addDataProperty(entity, ownerEntity)
    }
    else if (entityType === TypesEnum.CLASS) {
      this.diagramBuilder.addClass(entity)
      if (!ownerEntity) return
      if (relationship === 'superclass') {
        const sourceId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, this.rendererState)
        const targetId = entity.getIdInDiagram(diagram.id, TypesEnum.CLASS, this.rendererState)
        if (!sourceId || !targetId) return
        this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INCLUSION)
      } else if (relationship === 'subclass') {
        const sourceId = entity.getIdInDiagram(diagram.id, TypesEnum.CLASS, this.rendererState)
        const targetId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, this.rendererState)
        if (!sourceId || !targetId) return
        this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INCLUSION)
      }
    }
    this.grapholscape.renderer.renderState?.runLayout()
    this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
  }

  public addEdgeElement(iriString: string | null = null, edgeType: TypesEnum, sourceId: string, targetId: string, nodesType: TypesEnum, functionProperties: FunctionalityEnum[] = []) {

    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const sourceEntity = this.grapholscape.ontology.getEntity(sourceId)
    const targetEntity = this.grapholscape.ontology.getEntity(targetId)
    if (!sourceEntity || !targetEntity) return

    if (iriString && edgeType === TypesEnum.OBJECT_PROPERTY) {
      let entity = this.grapholscape.ontology.getEntity(iriString)
      if (!entity) {
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        entity = new GrapholEntity(iri)
        this.grapholscape.ontology.addEntity(entity)
      }
      this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity, TypesEnum.CLASS)
      entity.functionProperties = entity?.functionProperties.concat(functionProperties)
      this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
    }
    else if (edgeType === TypesEnum.INCLUSION) {
      const sourceID = sourceEntity.getIdInDiagram(diagram.id, nodesType, this.rendererState)
      const targetID = targetEntity.getIdInDiagram(diagram.id, nodesType, this.rendererState)
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
    const hierarchyID = this.diagramBuilder.getNewId('node') + '-' + diagram.id
    const hierarchy = disjoint ? new Hierarchy(hierarchyID, TypesEnum.DISJOINT_UNION, complete) : new Hierarchy(hierarchyID, TypesEnum.UNION, complete)
    const superClass = this.grapholscape.ontology.getEntity(ownerIri)
    if (!superClass) return
    hierarchy.addSuperclass(superClass)
    for (let i of iris) {
      const iri = new Iri(i, this.grapholscape.ontology.namespaces)
      let entity = this.grapholscape.ontology.getEntity(i)
      if (!entity)
        entity = new GrapholEntity(iri)
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

        if (cyOccurrence.isNode() && entity.is(TypesEnum.CLASS)) {
          this.grapholscape.ontology.hierarchiesBySubclassMap.get(entity.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchyInput(hierarchy, entity.iri.fullIri)
          })

          this.grapholscape.ontology.hierarchiesBySuperclassMap.get(entity.iri.fullIri)?.forEach(hierarchy => {
            this.removeHierarchySuperclass(hierarchy, entity.iri.fullIri)
          })

          cyOccurrence.connectedEdges(`[ type = "${TypesEnum.OBJECT_PROPERTY}" ]`).forEach(opEdge => {
            const entity = this.grapholscape.ontology.getEntity(opEdge.data().iri)
            if (entity) {
              this.removeEntity(opEdge, entity)
            }
          })

          cyOccurrence.neighborhood(`node[ type = "${TypesEnum.DATA_PROPERTY}" ]`).forEach(dpNode => {
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

  public removeHierarchy(hierarchy: Hierarchy) {

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

    if (hierarchy.id)
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

  public renameEntity(oldIri: Iri, elemID: string, newIri: string) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    const grapholElem = diagram.representations.get(this.rendererState)?.grapholElements.get(elemID)

    let entity = this.grapholscape.ontology.getEntity(newIri)
    let iri = entity?.iri
    if (!entity || !iri) {
      iri = new Iri(newIri, this.grapholscape.ontology.namespaces)
      entity = new GrapholEntity(iri)
      this.grapholscape.ontology.addEntity(entity)
    }

    this.diagramBuilder.renameElement(elemID, iri)
    if (!grapholElem) return
    entity.addOccurrence(grapholElem, this.rendererState)

    const oldEntity = this.grapholscape.ontology.getEntity(oldIri.fullIri)
    if (!oldEntity) return
    if (grapholElem.is(TypesEnum.CLASS)) {
      let hierarchiesIDs: string[] = []
      let cyElem = this.diagramBuilder.getEntityCyRepr(oldEntity, grapholElem.type)
      cyElem.neighborhood(`node[type $= ${TypesEnum.UNION}]`).forEach(un => {
        hierarchiesIDs.push(un.data('hierarchyID'))
      }
      )
      this.reassignSuperhierarchies(hierarchiesIDs, oldIri, newIri)
      this.reassignSubhierarchies(hierarchiesIDs, oldIri, newIri)
    }

    oldEntity.removeOccurrence(grapholElem, this.rendererState)
    const occurrences = oldEntity.occurrences.get(this.rendererState)
    if (occurrences && occurrences.length === 0) {
      this.grapholscape.ontology.entities.delete(oldIri.fullIri)
    }
  }

  public refactorEntity(entity: GrapholEntity, elemID: string, newIri: string) {
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)

    const oldIri = entity.iri.fullIri
    const iri = new Iri(newIri, this.grapholscape.ontology.namespaces)
    const grapholElem = diagram.representations.get(this.rendererState)?.grapholElements.get(elemID)
    if (grapholElem && grapholElem.is(TypesEnum.CLASS)) {
      let hierarchiesIDs: string[] = []
      let cyElem = this.diagramBuilder.getEntityCyRepr(entity, grapholElem.type)
      cyElem.neighborhood(`node[type $= ${TypesEnum.UNION}]`).forEach(un => {
        hierarchiesIDs.push(un.data('hierarchyID'))
      }
      )
      this.reassignSuperhierarchies(hierarchiesIDs, oldIri, newIri)
      this.reassignSubhierarchies(hierarchiesIDs, oldIri, newIri)
    }
    entity.iri = iri
    this.grapholscape.ontology.addEntity(entity)
    entity.occurrences.get(this.rendererState)?.forEach(o => this.diagramBuilder.renameElement(o.id, iri))

    this.grapholscape.ontology.entities.delete(oldIri)
  }

  public reassignSuperhierarchies(hierarchiesIDs, oldIri, newIri) {
    let superhierarchies = this.grapholscape.ontology.hierarchiesBySuperclassMap.get(oldIri.fullIri)
    if (superhierarchies) {
      let oldSuperhierarchies = superhierarchies.filter(h => {
        if (h.id) {
          return !hierarchiesIDs.includes(h.id)
        }
      })
      let newSuperhierarchies = superhierarchies.filter(h => {
        if (h.id) {
          return hierarchiesIDs.includes(h.id)
        }
      })
      this.grapholscape.ontology.hierarchiesBySuperclassMap.set(oldIri.fullIri, oldSuperhierarchies)
      this.grapholscape.ontology.hierarchiesBySuperclassMap.set(newIri, newSuperhierarchies)
    }
  }

  public reassignSubhierarchies(hierarchiesIDs, oldIri, newIri) {
    let subhierarchies = this.grapholscape.ontology.hierarchiesBySubclassMap.get(oldIri.fullIri)
    if (subhierarchies) {
      let oldSubhierarchies = subhierarchies.filter(h => {
        if (h.id) {
          return !hierarchiesIDs.includes(h.id)
        }
      })
      let newSubhierarchies = subhierarchies.filter(h => {
        if (h.id) {
          return hierarchiesIDs.includes(h.id)
        }
      })
      this.grapholscape.ontology.hierarchiesBySubclassMap.set(oldIri.fullIri, oldSubhierarchies)
      this.grapholscape.ontology.hierarchiesBySubclassMap.set(newIri, newSubhierarchies)
    }
  }

  public toggleFunctionality(iri) {
    const entity = this.grapholscape.ontology.getEntity(iri)
    if (entity?.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL)) {
      entity.functionProperties = []
    } else {
      entity?.functionProperties.push(FunctionalityEnum.FUNCTIONAL)
    }
    const diagram = this.grapholscape.renderer.diagram as Diagram
    this.diagramBuilder = new DiagramBuilder(diagram, this.rendererState)
    if (entity)
      this.diagramBuilder.toggleFunctionality(entity, entity?.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL))
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