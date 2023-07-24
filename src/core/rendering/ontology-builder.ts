import { floatyOptions } from "../../config"
import { ClassInstanceEntity, Diagram, DiagramRepresentation, FunctionalityEnum, GrapholEntity, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../model"
import DiagramBuilder from "../diagram-builder"
import Grapholscape from "../grapholscape"

export default class OntologyBuilder {

    grapholscape: Grapholscape
    diagramBuilder: DiagramBuilder

    constructor(grapholscape) {
        this.grapholscape = grapholscape
    }

    public addNodeElement(iriString: string, entityType: TypesEnum, ownerIri?: string, relationship?: string, functionalities: string[] = [], datatype = '') {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        if (entityType === TypesEnum.INDIVIDUAL && ownerIri){
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if(!ownerEntity) return
            const instanceEntity = new ClassInstanceEntity(iri, [ownerEntity?.iri])
            this.grapholscape.ontology.addEntity(instanceEntity)
            this.diagramBuilder.addClassInstance(instanceEntity)
            const sourceId = instanceEntity.getIdInDiagram(diagram.id, TypesEnum.INDIVIDUAL, RendererStatesEnum.FLOATY)
            const targetId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, RendererStatesEnum.FLOATY)
            if(!sourceId || !targetId) return
            this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INSTANCE_OF)
            this.grapholscape.renderer.renderState?.runLayout()
            return
        }

        const entity = new GrapholEntity(iri)
        this.grapholscape.ontology.addEntity(entity)
        if (entityType === TypesEnum.DATA_PROPERTY && ownerIri) {
            entity.datatype = datatype
            if (functionalities.includes('functional')) {
                entity.functionProperties = [FunctionalityEnum.FUNCTIONAL]
            }
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if (ownerEntity)
                this.diagramBuilder.addDataProperty(entity, ownerEntity)
        }
        else if (entityType === TypesEnum.CLASS) {
            this.diagramBuilder.addClass(entity)
            if (!ownerIri) return
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if (!ownerEntity) return
            if (relationship === 'superclass') {
                const sourceId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, RendererStatesEnum.FLOATY)
                const targetId = entity.getIdInDiagram(diagram.id, TypesEnum.CLASS, RendererStatesEnum.FLOATY)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INCLUSION)
            } else if (relationship === 'subclass') {
                const sourceId = entity.getIdInDiagram(diagram.id, TypesEnum.CLASS, RendererStatesEnum.FLOATY)
                const targetId = ownerEntity.getIdInDiagram(diagram.id, TypesEnum.CLASS, RendererStatesEnum.FLOATY)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, TypesEnum.INCLUSION)
            }
        }
        this.grapholscape.renderer.renderState?.runLayout()
        this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
    }

    public addEdgeElement(iriString: string | null = null, edgeType: TypesEnum, sourceId: string, targetId: string, nodesType: TypesEnum, functionalities: string[] = []) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const sourceEntity = this.grapholscape.ontology.getEntity(sourceId)
        const targetEntity = this.grapholscape.ontology.getEntity(targetId)
        if (!sourceEntity || !targetEntity) return

        if (iriString && edgeType === TypesEnum.OBJECT_PROPERTY) {
            const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
            const entity = new GrapholEntity(iri)
            this.grapholscape.ontology.addEntity(entity)
            this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity, TypesEnum.CLASS)
            functionalities.forEach(i => {
                entity.functionProperties.push(FunctionalityEnum[i])
            })
            this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
        }
        else if (edgeType === TypesEnum.INCLUSION) {
            const sourceID = sourceEntity.getIdInDiagram(diagram.id, nodesType, RendererStatesEnum.FLOATY)
            const targetID = targetEntity.getIdInDiagram(diagram.id, nodesType, RendererStatesEnum.FLOATY)
            if (!sourceID || !targetID) return
            this.diagramBuilder.addEdge(sourceID, targetID, edgeType)
        }
    }

    public addDiagram(name) {
        const id = this.grapholscape.ontology.diagrams.length
        const newDiagram = new Diagram(name, id)
        newDiagram.representations.set(RendererStatesEnum.FLOATY, new DiagramRepresentation(floatyOptions))
        this.grapholscape.ontology.addDiagram(newDiagram)
        this.grapholscape.showDiagram(id)
        this.grapholscape.lifecycle.trigger(LifecycleEvent.DiagramAddition, newDiagram)
    }

    public addSubhierarchy(iris: string[], ownerIri: string, disjoint = false, complete= false){
        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const hierarchyId = `un${this.grapholscape.renderer.nodes?.length}`
        const hierarchy = disjoint
            ? new Hierarchy(hierarchyId, TypesEnum.DISJOINT_UNION) 
            : new Hierarchy(hierarchyId, TypesEnum.UNION)
        
        const superClass = this.grapholscape.ontology.getEntity(ownerIri)
        if (!superClass) return
        hierarchy.addSuperclass(superClass, complete)
        for(let i of iris){
            const iri = new Iri(i, this.grapholscape.ontology.namespaces)
            const entity = new GrapholEntity(iri)
            this.grapholscape.ontology.addEntity(entity)
            hierarchy.addInput(entity)
        }
        this.diagramBuilder.addHierarchy(hierarchy, {x:0, y:0})
        this.grapholscape.renderer.renderState?.runLayout()
    }

    public toggleFunctionality(iri: string){
        const entity = this.grapholscape.ontology.getEntity(iri)
        if (entity) {
            if(entity?.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL)){
                entity.functionProperties = []
            } else {
                entity?.functionProperties.push(FunctionalityEnum.FUNCTIONAL)
            }
            const diagram = this.grapholscape.renderer.diagram as Diagram
            this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
            this.diagramBuilder.toggleFunctionality(entity, entity?.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL))
        }        

    }

    public toggleUnion(elem){
        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        this.diagramBuilder.toggleUnion(elem)
    }

    public toggleComplete(elem){
        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        this.diagramBuilder.toggleComplete(elem)
    }
}