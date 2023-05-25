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

        let diagram = this.grapholscape.renderer.diagram as Diagram
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        const entity = new GrapholEntity(iri, entityType)
        this.grapholscape.ontology.addEntity(entity)

        const sourceNode = this.grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(sourceId);
        const targetNode = this.grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(targetId);
        if (sourceNode && targetNode) {
            const instanceEdge = new GrapholEdge(`${sourceId}-${entityType}-${targetId}`, entityType);
            instanceEdge.sourceId = sourceId;
            instanceEdge.targetId = targetId;
            instanceEdge.displayedName = entity.getDisplayedName(EntityNameType.LABEL);
            entity.addOccurrence(instanceEdge.id, diagram.id, RendererStatesEnum.FLOATY)
            this.grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.addElement(instanceEdge, entity);

        }

    }
}