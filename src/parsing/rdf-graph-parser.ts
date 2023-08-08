import { floatyOptions, GrapholscapeConfig } from "../config";
import { Grapholscape } from "../core";
import { Annotation, ClassInstanceEntity, AnnotationProperty, DefaultFilterKeyEnum, Diagram, DiagramRepresentation, GrapholEdge, GrapholEntity, GrapholNode, GrapholscapeTheme, IncrementalDiagram, Iri, Namespace, Ontology, RendererStatesEnum } from "../model";
import { Entity, RDFGraph, RDFGraphModelTypeEnum } from "../model/rdf-graph/swagger";

export default function parseRDFGraph(rdfGraph: RDFGraph, container: HTMLElement) {
  const rendererState = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
    ? RendererStatesEnum.FLOATY
    : RendererStatesEnum.INCREMENTAL

  const ontology = getOntology(rdfGraph)
  ontology.entities = getEntities(rdfGraph, ontology.namespaces)
  
  const classInstances = getClassInstances(rdfGraph, ontology.namespaces)
  let incrementalDiagram: IncrementalDiagram
  const parsedDiagrams = getDiagrams(rdfGraph, ontology, classInstances, rendererState)
  
  if (rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY)
    ontology.diagrams = parsedDiagrams
  else
    incrementalDiagram = parsedDiagrams[0] as IncrementalDiagram

  const grapholscape = new Grapholscape(ontology, container, getConfig(rdfGraph))

  if (grapholscape.incremental)
    grapholscape.incremental.classInstanceEntities = classInstances

  let grapholEntity: GrapholEntity | undefined
  parsedDiagrams.forEach(parsedDiagram => {
    parsedDiagram.representations.forEach((representation, rendererState) => {
      representation.grapholElements.forEach(elem => {
        if (elem.iri) {
          grapholEntity = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
            ? ontology.getEntity(elem.iri)
            : grapholscape.incremental?.classInstanceEntities?.get(elem.iri) || ontology.getEntity(elem.iri)
          grapholEntity?.addOccurrence(elem, rendererState)
        }
      })
    })
  })

  rdfGraph.config?.filters?.forEach(f => {
    if (Object.values(DefaultFilterKeyEnum).includes(f)) {
      grapholscape.filter(f)
    }
  })

  return grapholscape
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
    ontology.annotations = rdfGraph.metadata.annotations.map(a => {
      return new Annotation(new Iri(a.property, ontology.namespaces), a.lexicalForm, a.language, a.datatype)
    })
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
    entity.annotations = getEntityAnnotations(e, namespaces)
    console.log(getEntityAnnotations(e, namespaces))
    entities.set(iri.fullIri, entity)
  })

  return entities
}

export function getClassInstances(rdfGraph: RDFGraph, namespaces: Namespace[]) {
  const classInstances: Map<string, ClassInstanceEntity> = new Map()
  let classInstance: ClassInstanceEntity | undefined
  rdfGraph.classInstanceEntities?.forEach(ci => {
    let iri = new Iri(ci.fullIri, [], ci.shortIri)
    let parentClassesIris = ci.parentClasses?.map(p => new Iri(p, namespaces)) || []
    classInstance = new ClassInstanceEntity(iri, parentClassesIris)
    classInstance.annotations = getEntityAnnotations(ci, namespaces)
    if (ci.dataProperties)
      classInstance.dataProperties = ci.dataProperties
    classInstances.set(iri.fullIri, classInstance)
  })

  return classInstances
}

function getEntityAnnotations(rdfEntity: Entity, namespaces: Namespace[]) {
  return rdfEntity.annotations?.map(a => {
    const annotationProperty = Object.values(AnnotationProperty).find(property => {
      return property.equals(a.property)
    }) || new Iri(a.property, namespaces)
    return new Annotation(annotationProperty, a.lexicalForm, a.language, a.datatype)
  }) || []
}

export function getDiagrams(rdfGraph: RDFGraph, ontology: Ontology, classInstances?: Map<string, ClassInstanceEntity>, rendererState = RendererStatesEnum.GRAPHOL) {
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
      grapholElement = GrapholNode.newFromSwagger(n)
      diagramRepr!.addElement(grapholElement, grapholEntity)
    })

    // Edges
    d.edges?.forEach(e => {
      if (!e.id) {
        e.id = diagramRepr!.getNewId('edge')
      }
      grapholElement = GrapholEdge.newFromSwagger(e)
      diagramRepr!.addElement(grapholElement)
    })

    if (d.lastViewportState !== undefined) {
      const diagramRepr = diagram.representations.get(rendererState)
      if (diagramRepr) {
        diagramRepr.hasEverBeenRendered = true
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