import { floatyOptions, Language } from "../../config";
import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholNode from "../graphol-elems/node";
import Iri from "../iri";
import { RDFGraphConfigEntityNameTypeEnum, TypesEnum } from "../rdf-graph/swagger";
import { RendererStatesEnum } from "../renderers/i-render-state";
import Diagram from "./diagram";
import DiagramRepresentation from "./diagram-representation";

export default class AnnotationsDiagram extends Diagram {
  private representation: DiagramRepresentation

  constructor() {
    super('Annotations', -1)
    this.representation = new DiagramRepresentation(floatyOptions)
    this.representations.set(RendererStatesEnum.FLOATY, this.representation)
  }

  addIRIValueAnnotation(
    sourceEntity: GrapholEntity,
    annotationPropertyEntity: GrapholEntity,
    targetIri: Iri,
    entityNameType: RDFGraphConfigEntityNameTypeEnum,
    language: Language,
    targetEntity?: GrapholEntity,
  ) {
    let node: GrapholNode

    let sourceEntityNode = this.representation.cy.$(`[iri = "${sourceEntity.iri.fullIri}"]`).first()

    if (sourceEntityNode.empty()) {
      node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.INDIVIDUAL)
      node.diagramId = this.id
      node.displayedName = sourceEntity.getDisplayedName(entityNameType, language)
      sourceEntityNode = this.representation.addElement(node, sourceEntity)
      sourceEntity.addOccurrence(node, RendererStatesEnum.FLOATY)
    }

    // take range iri node
    let targetNode = this.representation.cy.$(`[iri = "${targetIri.toString()}"]`).nodes().first()
    if (targetNode.empty()) {
      node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.IRI)
      const tempEntity = new GrapholEntity(targetIri)
      node = new GrapholNode(this.representation.getNewId('node'), TypesEnum.IRI)
      node.iri = targetIri.toString()
      node.diagramId = this.id
      node.displayedName = tempEntity.getDisplayedName(entityNameType, language)
      targetNode = this.representation.addElement(node)
      targetEntity?.addOccurrence(node, RendererStatesEnum.FLOATY)
    }

    const annotationPropertyEdge = new GrapholEdge(this.representation.getNewId('edge'), TypesEnum.ANNOTATION_PROPERTY)
    annotationPropertyEdge.diagramId = this.id
    annotationPropertyEdge.sourceId = sourceEntityNode.id()
    annotationPropertyEdge.targetId = targetNode.id()
    annotationPropertyEdge.displayedName = annotationPropertyEntity
      ?.getDisplayedName(entityNameType, language)

    this.representation.addElement(annotationPropertyEdge, annotationPropertyEntity)
    annotationPropertyEntity.addOccurrence(annotationPropertyEdge, RendererStatesEnum.FLOATY)
  }
}