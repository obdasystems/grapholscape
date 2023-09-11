import { GrapholEntity, Diagram, Ontology, Annotation, Lifecycle, IonEvent, IEventTriggers } from "../model"
import { RDFGraph } from "../model/rdf-graph/swagger"

export enum DesignerEvent {
  // Ontology Designer
  EntityAddition = 'entityAddition',
  EntityRemoval = 'entityRemoval',
  DiagramAddition = 'diagramAddition',
  DiagramRemoval = 'diagramRemoval',
  AnnotationAddition = 'annotationAddition',
  AnnotationEdit = 'annotationEdit',
  AnnotationRemoval = 'annotationRemoval',
  SaveDraft = 'saveDraft',
  SaveVersion = 'saveVersion',
}

export interface IonDesignerEvent extends IonEvent {
  (event: DesignerEvent.EntityAddition, callback: (entity: GrapholEntity, diagramId: number) => void): void
  (event: DesignerEvent.EntityRemoval, callback: (entity: GrapholEntity, diagramId: number) => void): void
  (event: DesignerEvent.DiagramAddition, callback: (diagram: Diagram) => void): void
  (event: DesignerEvent.DiagramRemoval, callback: (diagram: Diagram) => void): void
  (event: DesignerEvent.AnnotationAddition, callback: (entity: GrapholEntity | Ontology, annotation: Annotation) => void): void
  (event: DesignerEvent.AnnotationEdit, callback: (entity: GrapholEntity | Ontology, annotation: Annotation) => void): void
  (event: DesignerEvent.AnnotationRemoval, callback: (entity: GrapholEntity | Ontology, annotation: Annotation) => void): void
  (event: DesignerEvent.AnnotationRemoval, callback: (entity: GrapholEntity | Ontology, annotation: Annotation) => void): void
  (event: DesignerEvent.SaveDraft, callback: (rdfGraph: RDFGraph, annotation: Annotation) => void): void
  (event: DesignerEvent.SaveVersion, callback: (rdfGraph: RDFGraph, annotation: Annotation) => void): void
}

export interface IDesignerTriggers extends IEventTriggers {
  (event: DesignerEvent.EntityAddition, entity: GrapholEntity, diagramId: number): void
  (event: DesignerEvent.EntityRemoval, entity: GrapholEntity, diagramId: number): void
  (event: DesignerEvent.DiagramAddition, diagram: Diagram): void
  (event: DesignerEvent.DiagramRemoval, diagram: Diagram): void
  (event: DesignerEvent.AnnotationAddition, entity: GrapholEntity | Ontology, annotation: Annotation): void
  (event: DesignerEvent.AnnotationEdit, entity: GrapholEntity | Ontology, annotation: Annotation): void
  (event: DesignerEvent.AnnotationRemoval, entity: GrapholEntity | Ontology, annotation: Annotation): void
  (event: DesignerEvent.SaveDraft, rdfGraph: RDFGraph): void
  (event: DesignerEvent.SaveVersion, rdfGraph: RDFGraph): void
}

export class DesignerLifeCycle extends Lifecycle {
  private entityAddition: ((entity: GrapholEntity, diagramId: number) => void)[] = []
  private entityRemoval: ((entity: GrapholEntity, diagramId: number) => void)[] = []
  private diagramAddition: ((diagram: Diagram) => void)[] = []
  private diagramRemoval: ((diagram: Diagram) => void)[] = []
  private annotationAddition: ((entity: GrapholEntity | Ontology, annotation: Annotation) => void)[] = []
  private annotationEdit: ((entity: GrapholEntity | Ontology, annotation: Annotation) => void)[] = []
  private annotationRemoval: ((entity: GrapholEntity | Ontology, annotation: Annotation) => void)[] = []
  private saveDraft: ((rdfGraph: RDFGraph) => void)[] = []
  private saveVersion: ((rdfGraph: RDFGraph) => void)[] = []

  trigger: IDesignerTriggers

  on: IonDesignerEvent
}