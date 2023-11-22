import { floatyOptions, GrapholscapeConfig, Language } from "../config";
import { Annotation, AnnotationProperty, ClassInstanceEntity, DefaultAnnotationProperties, Diagram, DiagramRepresentation, EntityNameType, GrapholEdge, GrapholEntity, GrapholNode, GrapholscapeTheme, IncrementalDiagram, Iri, Namespace, Ontology, RendererStatesEnum } from "../model";
import { Entity, RDFGraph, RDFGraphMetadata, RDFGraphModelTypeEnum } from "../model/rdf-graph/swagger";

export default function parseRDFGraph(rdfGraph: RDFGraph) {
  const rendererState = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
    ? RendererStatesEnum.FLOATY
    : RendererStatesEnum.INCREMENTAL

  const ontology = getOntology(rdfGraph)
  ontology.entities = getEntities(rdfGraph, ontology.namespaces)

  // const classInstances = getClassInstances(rdfGraph, ontology.namespaces)
  // let incrementalDiagram: IncrementalDiagram
  if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY)
    ontology.diagrams = getDiagrams(rdfGraph, rendererState, ontology.entities)
  //if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY)
  //  ontology.diagrams = parsedDiagrams
  //else
  //  incrementalDiagram = parsedDiagrams[0] as IncrementalDiagram

  // const grapholscape = new Grapholscape(ontology, container, getConfig(rdfGraph))

  // if (grapholscape.incremental)
  //   grapholscape.incremental.classInstanceEntities = classInstances

  updateEntityOccurrences(ontology)

  // rdfGraph.config?.filters?.forEach(f => {
  //   if (Object.values(DefaultFilterKeyEnum).includes(f)) {
  //     grapholscape.filter(f)
  //   }
  // })

  return ontology
}

export function updateEntityOccurrences(ontology: Ontology) {
  ontology.diagrams.forEach(parsedDiagram => {
    parsedDiagram.representations.forEach((representation, rendererState) => {
      representation.grapholElements.forEach(elem => {
        if (elem.iri) {
          ontology.getEntity(elem.iri)?.addOccurrence(elem, rendererState)
        }
      })
    })
  })
}

export function getOntology(rdfGraph: RDFGraph) {
  let ontology: Ontology
  ontology = new Ontology(
    rdfGraph.metadata.name || '',
    rdfGraph.metadata.version || '',
    rdfGraph.metadata.iri,
    rdfGraph.metadata.namespaces.map(n => new Namespace(n.prefixes, n.value))
  )

  if (rdfGraph.metadata.languages) {
    ontology.languages = rdfGraph.metadata.languages
  }

  ontology.defaultLanguage = rdfGraph.metadata.defaultLanguage
  if (rdfGraph.metadata.annotations) {
    ontology.annotations = getAnnotations(rdfGraph.metadata, ontology.namespaces)
  }

  if (rdfGraph.metadata.annotationProperties) {
    ontology.annProperties = rdfGraph.metadata.annotationProperties.map(annProp => new AnnotationProperty(annProp, ontology.namespaces))
  }

  return ontology
}

export function getEntities(rdfGraph: RDFGraph, namespaces: Namespace[]) {
  let iri: Iri
  const entities: Map<string, GrapholEntity> = new Map()
  let entity: GrapholEntity | undefined
  rdfGraph.entities.forEach(e => {
    iri = new Iri(e.fullIri, namespaces)
    entity = GrapholEntity.newFromSwagger(iri, e)
    entity.annotations = getAnnotations(e, namespaces)
    entities.set(iri.fullIri, entity)
  })

  return entities
}

/** @internal */
export function getClassInstances(rdfGraph: RDFGraph, namespaces: Namespace[]) {
  const classInstances: Map<string, ClassInstanceEntity> = new Map()
  let classInstance: ClassInstanceEntity | undefined
  rdfGraph.classInstanceEntities?.forEach(ci => {
    let iri = new Iri(ci.fullIri, [], ci.shortIri)
    let parentClassesIris = ci.parentClasses?.map(p => new Iri(p, namespaces)) || []
    classInstance = new ClassInstanceEntity(iri, parentClassesIris)
    classInstance.annotations = getAnnotations(ci, namespaces)
    if (ci.dataProperties)
      classInstance.dataProperties = ci.dataProperties
    classInstances.set(iri.fullIri, classInstance)
  })

  return classInstances
}

function getAnnotations(annotatedElem: Entity | RDFGraphMetadata, namespaces: Namespace[]) {
  return annotatedElem.annotations?.map(a => {
    const annotationProperty = Object.values(DefaultAnnotationProperties).find(property => {
      return property.equals(a.property)
    }) || new Iri(a.property, namespaces)
    return new Annotation(annotationProperty, a.lexicalForm, a.language, a.datatype)
  }) || []
}

export function getDiagrams(rdfGraph: RDFGraph, rendererState = RendererStatesEnum.GRAPHOL, entities: Map<string, GrapholEntity>) {
  let diagram: Diagram
  let diagramRepr: DiagramRepresentation | undefined
  let grapholEntity: GrapholEntity | undefined
  let grapholElement: GrapholNode | GrapholEdge

  const diagrams: Diagram[] = []

  rdfGraph.diagrams.forEach(d => {
    diagram = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY ? new Diagram(d.name, d.id) : new IncrementalDiagram()
    diagramRepr = diagram.representations.get(rendererState)

    if (!diagramRepr) {
      diagramRepr = new DiagramRepresentation(floatyOptions)
      diagram.representations.set(rendererState, diagramRepr)
    }

    // Nodes
    d.nodes?.forEach(n => {
      grapholEntity = undefined
      grapholElement = GrapholNode.newFromSwagger(n)
      grapholElement.diagramId = d.id
      if (grapholElement.iri) {
        grapholEntity = entities.get(grapholElement.iri)
        grapholElement.displayedName = grapholEntity?.getDisplayedName(
          rdfGraph.config?.entityNameType || EntityNameType.LABEL,
          rdfGraph.config?.language || rdfGraph.metadata.defaultLanguage || Language.EN
        )
        if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY || rdfGraph.modelType === RDFGraphModelTypeEnum.VKG)
          grapholEntity?.addOccurrence(grapholElement, rendererState)
      }
      diagramRepr!.addElement(grapholElement, grapholEntity)
    })

    // Edges
    d.edges?.forEach(e => {
      if (!e.id) {
        e.id = diagramRepr!.getNewId('edge')
      }
      grapholEntity = undefined
      grapholElement = GrapholEdge.newFromSwagger(e)
      grapholElement.diagramId = d.id
      if (grapholElement.iri) {
        grapholEntity = entities.get(grapholElement.iri)
        grapholElement.displayedName = grapholEntity?.getDisplayedName(
          rdfGraph.config?.entityNameType || EntityNameType.LABEL,
          rdfGraph.config?.language || rdfGraph.metadata.defaultLanguage || Language.EN
        )
        if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY || rdfGraph.modelType === RDFGraphModelTypeEnum.VKG)
          grapholEntity?.addOccurrence(grapholElement, rendererState)
      }
      diagramRepr!.addElement(grapholElement, grapholEntity)
    })

    if (d.lastViewportState !== undefined && d.lastViewportState !== null) {
      const diagramRepr = diagram.representations.get(rendererState)
      if (diagramRepr) {
        diagramRepr.lastViewportState = d.lastViewportState
      }
    }

    diagrams.push(diagram)
  })

  return diagrams
}

export function getConfig(rdfGraph: RDFGraph): GrapholscapeConfig {
  let themes: GrapholscapeTheme[] | undefined
  if (rdfGraph.config?.themes) {
    themes = rdfGraph.config.themes.map(t => new GrapholscapeTheme(t.id, t.colours, t.name))
  }

  return {
    themes: themes,
    selectedTheme: rdfGraph.config?.selectedTheme,
    selectedRenderer: rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
      ? RendererStatesEnum.FLOATY
      : RendererStatesEnum.INCREMENTAL,
    language: rdfGraph.config?.language,
    entityNameType: rdfGraph.config?.entityNameType,
    renderers: rdfGraph.config?.renderers as RendererStatesEnum[],
  }
}