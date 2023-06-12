import { floatyOptions } from "../../config"
import { ClassInstanceEntity, Diagram, FunctionalityEnum, DiagramRepresentation, GrapholEntity, GrapholTypesEnum, Hierarchy, Iri, LifecycleEvent, RendererStatesEnum } from "../../model"
import DiagramBuilder from "../diagram-builder"
import Grapholscape from "../grapholscape"

export default class OntologyBuilder {

    grapholscape: Grapholscape
    diagramBuilder: DiagramBuilder

    constructor(grapholscape) {
        this.grapholscape = grapholscape
    }

    public addNodeElement(iriString, entityType, ownerIri = null, relationship: string | null = null, functionalities: string[] = []) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        if (entityType === GrapholTypesEnum.INDIVIDUAL && ownerIri){
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if(!ownerEntity) return
            const instanceEntity = new ClassInstanceEntity(iri, [ownerEntity?.iri])
            this.grapholscape.ontology.addEntity(instanceEntity)
            this.diagramBuilder.addClassInstance(instanceEntity)
            const sourceId = this.diagramBuilder.getIdFromEntity(instanceEntity)
            const targetId = this.diagramBuilder.getIdFromEntity(ownerEntity)
            if(!sourceId || !targetId) return
            this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INSTANCE_OF)
            this.grapholscape.renderer.renderState?.runLayout()
            return
        }

        const entity = new GrapholEntity(iri, entityType)
        this.grapholscape.ontology.addEntity(entity)
        if (entityType === GrapholTypesEnum.DATA_PROPERTY && ownerIri) {
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
            if (relationship === 'superclass') {
                const sourceId = this.diagramBuilder.getIdFromEntity(ownerEntity)
                const targetId = this.diagramBuilder.getIdFromEntity(entity)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
            } else if (relationship === 'subclass') {
                const sourceId = this.diagramBuilder.getIdFromEntity(entity)
                const targetId = this.diagramBuilder.getIdFromEntity(ownerEntity)
                if (!sourceId || !targetId) return
                this.diagramBuilder.addEdge(sourceId, targetId, GrapholTypesEnum.INCLUSION)
            }
        }
        this.grapholscape.renderer.renderState?.runLayout()
        this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
    }

    public addEdgeElement(iriString: string | null = null, entityType, sourceId, targetId, functionalities: string[] = []) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const sourceEntity = this.grapholscape.ontology.getEntity(sourceId)
        const targetEntity = this.grapholscape.ontology.getEntity(targetId)
        if (!sourceEntity || !targetEntity) return

        if (iriString && entityType === GrapholTypesEnum.OBJECT_PROPERTY) {
            const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
            const entity = new GrapholEntity(iri, entityType)
            this.grapholscape.ontology.addEntity(entity)
            this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity)
            functionalities.forEach(i => {
                entity.functionalities.push(FunctionalityEnum[i])
            })
            this.grapholscape.lifecycle.trigger(LifecycleEvent.EntityAddition, entity, this.diagramBuilder.diagram.id)
        }
        else if (entityType === GrapholTypesEnum.INCLUSION) {
            const sourceID = this.diagramBuilder.getIdFromEntity(sourceEntity)
            const targetID = this.diagramBuilder.getIdFromEntity(targetEntity)
            if (!sourceID || !targetID) return
            this.diagramBuilder.addEdge(sourceID, targetID, GrapholTypesEnum.INCLUSION)
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

    public addSubhierarchy(iris, ownerIri){
        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const hierarchy = new Hierarchy(GrapholTypesEnum.UNION)
        hierarchy.id = `un${this.grapholscape.renderer.nodes?.length}`
        if (!ownerIri) return
        hierarchy.addSuperclass(ownerIri)
        const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
        for(let i of iris){
            const iri = new Iri(i, this.grapholscape.ontology.namespaces)
            const entity = new GrapholEntity(iri, GrapholTypesEnum.CLASS)
            this.grapholscape.ontology.addEntity(entity)
            this.diagramBuilder.addClass(entity)
            hierarchy.addInput(i)
        }
        this.diagramBuilder.addHierarchy(hierarchy, ownerEntity, {x:0, y:0})
        this.grapholscape.renderer.renderState?.runLayout()
    }
}