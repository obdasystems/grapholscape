import { EntityNameType } from "../../config"
import { Diagram, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, GrapholTypesEnum, Iri, RendererStatesEnum } from "../../model"
import DiagramBuilder from "../diagram-builder"
import Grapholscape from "../grapholscape"

export default class OntologyBuilder {

    grapholscape: Grapholscape
    diagramBuilder: DiagramBuilder

    constructor(grapholscape) {
        this.grapholscape = grapholscape
    }

    public addNodeElement(iriString, entityType, ownerIri = null) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        const entity = new GrapholEntity(iri, entityType)
        this.grapholscape.ontology.addEntity(entity)


        if (entityType === GrapholTypesEnum.DATA_PROPERTY && ownerIri){
            const ownerEntity = this.grapholscape.ontology.getEntity(ownerIri)
            if(ownerEntity)
                this.diagramBuilder.addDataProperty(entity, ownerEntity)
        }
        else if(entityType === GrapholTypesEnum.CLASS){
            this.diagramBuilder.addClass(entity)
        }

    }

    public addEdgeElement(iriString, entityType, sourceId, targetId) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        this.diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        const entity = new GrapholEntity(iri, entityType)
        this.grapholscape.ontology.addEntity(entity)

        const sourceEntity = this.grapholscape.ontology.getEntity(sourceId)
        const targetEntity = this.grapholscape.ontology.getEntity(targetId)
        if(!sourceEntity || !targetEntity) return
        this.diagramBuilder.addObjectProperty(entity, sourceEntity, targetEntity)

    }
}