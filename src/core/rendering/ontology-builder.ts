import { EntityNameType } from "../../config"
import { Diagram, GrapholEdge, GrapholEntity, GrapholNode, Iri, RendererStatesEnum } from "../../model"
import Grapholscape from "../grapholscape"

export default class OntologyBuilder {

    grapholscape: Grapholscape

    constructor(grapholscape) {
        this.grapholscape = grapholscape
    }

    public addNodeElement(iriString, entityType) {

        const diagram = this.grapholscape.renderer.diagram as Diagram
        const iri = new Iri(iriString, this.grapholscape.ontology.namespaces)
        const entity = new GrapholEntity(iri, entityType)
        this.grapholscape.ontology.addEntity(entity)

        const node = new GrapholNode(entity.iri.fullIri, entityType);
        node.iri = entity.iri.fullIri;
        node.displayedName = entity.getDisplayedName(EntityNameType.LABEL);
        node.position = { x: 0, y: 0 };
        entity.addOccurrence(node.id, diagram.id, RendererStatesEnum.FLOATY);
        this.grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.addElement(node, entity);

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
            entity.addOccurrence(instanceEdge.id, diagram.id, RendererStatesEnum.FLOATY)
            this.grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)?.addElement(instanceEdge, entity);

        }

    }
}