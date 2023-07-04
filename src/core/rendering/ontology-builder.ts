import { floatyOptions } from "../../config"
import { ClassInstanceEntity, Diagram, FunctionalityEnum, DiagramRepresentation, GrapholEntity, GrapholTypesEnum, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum } from "../../model"
import getIdFromEntity from "../../util/get-id-from-entity"
import DiagramBuilder from "../diagram-builder"
import Grapholscape from "../grapholscape"

export default class OntologyBuilder {

    grapholscape: Grapholscape
    diagramBuilder: DiagramBuilder

    constructor(grapholscape) {
        this.grapholscape = grapholscape
    }

    public addNodeElement(iriString: string, entityType: GrapholTypesEnum, ownerIri?: string, relationship?: string, functionalities: string[] = [], datatype = '') {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        if (entityType === GrapholTypesEnum.INDIVIDUAL && ownerIri){
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if(!ownerEntity) return
            const instanceEntity = new ClassInstanceEntity(iri, [ownerEntity?.iri])
            this.grapholscape.ontology.addEntity(instanceEntity)
            this.diagramBuilder.addClassInstance(instanceEntity)
            const sourceId = getIdFromEntity(instanceEntity, diagram.id, GrapholTypesEnum.INDIVIDUAL, RendererStatesEnum.FLOATY)
            const targetId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, RendererStatesEnum.FLOATY)
            if(!sourceId || !targetId) return
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
                const sourceId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, RendererStatesEnum.FLOATY)
                const targetId = getIdFromEntity(entity, diagram.id, GrapholTypesEnum.CLASS, RendererStatesEnum.FLOATY)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
            } else if (relationship === 'subclass') {
                const sourceId = getIdFromEntity(entity, diagram.id, GrapholTypesEnum.CLASS, RendererStatesEnum.FLOATY)
                const targetId = getIdFromEntity(ownerEntity, diagram.id, GrapholTypesEnum.CLASS, RendererStatesEnum.FLOATY)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
            }
        }
        this.grapholscape.renderer.renderState?.runLayout()
        this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
    }

    public addEdgeElement(iriString: string | null = null, edgeType: GrapholTypesEnum, sourceId: string, targetId: string, nodesType: GrapholTypesEnum, functionalities: string[] = []) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
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
            const sourceID = getIdFromEntity(sourceEntity, diagram.id, nodesType, RendererStatesEnum.FLOATY)
            const targetID = getIdFromEntity(targetEntity, diagram.id, nodesType, RendererStatesEnum.FLOATY)
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
        const hierarchy = disjoint? new Hierarchy(GrapholTypesEnum.DISJOINT_UNION) : new Hierarchy(GrapholTypesEnum.UNION)
        hierarchy.id = `un${this.grapholscape.renderer.nodes?.length}`
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

    public toggleFunctionality(iri){
        const entity = this.grapholscape.ontology.getEntity(iri)
        if(entity?.hasFunctionality(FunctionalityEnum.functional)){
            entity.functionalities = []
        } else {
            entity?.functionalities.push(FunctionalityEnum.functional)
        }
        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        this.diagramBuilder.toggleFunctionality(entity, entity?.hasFunctionality(FunctionalityEnum.functional))

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