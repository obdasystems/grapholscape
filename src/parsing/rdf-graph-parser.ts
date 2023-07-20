import { Grapholscape } from "../core";
import { Diagram, GrapholEdge, GrapholEntity, GrapholNode, GrapholscapeTheme, Iri, Namespace, Ontology, RendererStatesEnum } from "../model";
import { Edge, Node, RDFGraph, RDFGraphModelTypeEnum } from "../model/rdf-graph/swagger";

export default function parseRDFGraph(rdfGraph: RDFGraph, container: HTMLElement) {
  const rendererState = rdfGraph.modelType === RDFGraphModelTypeEnum.ONTOLOGY
    ? RendererStatesEnum.FLOATY
    : RendererStatesEnum.INCREMENTAL

  let ontology: Ontology
  ontology = new Ontology(
    rdfGraph.metadata.name,
    rdfGraph.metadata.version,
    rdfGraph.metadata.iri
  )

  let iri: Iri
  rdfGraph.entities.forEach(e => {
    iri = new Iri(e.fullIri, ontology.namespaces)
    ontology.addEntity(GrapholEntity.newFromSwagger(iri, e))
  })


  let diagram: Diagram
  let grapholEntity: GrapholEntity | null
  let grapholElement: GrapholNode | GrapholEdge

  rdfGraph.diagrams.forEach(d => {
    diagram = new Diagram(d.name, d.id)

    // Nodes
    d.nodes?.forEach(n => {
      grapholElement = GrapholNode.newFromSwagger(n)

      if (n.iri) {
        grapholEntity = ontology.getEntity(n.iri)
        grapholEntity?.addOccurrence(grapholElement, rendererState)
      }

      diagram.addElement(grapholElement)
    })

    // Edges
    d.edges?.forEach(e => {
      grapholElement = GrapholEdge.newFromSwagger(e)
      if (e.iri) {
        grapholEntity = ontology.getEntity(e.iri)
        grapholEntity?.addOccurrence(grapholElement, rendererState)
      }
      diagram.addElement(grapholElement)
    })

    if (d.lastViewPortState) {
      diagram.lastViewportState = d.lastViewPortState
      const diagramRepr = diagram.representations.get(rendererState)
      if (diagramRepr)
        diagramRepr.hasEverBeenRendered = true
    }

    ontology.addDiagram(diagram)
  })

  let themes: GrapholscapeTheme[] | undefined
  if (rdfGraph.config?.themes) {
    themes = rdfGraph.config.themes.map(t => new GrapholscapeTheme(t.id, t.colours, t.name))
  }


  const grapholscape = new Grapholscape(ontology, container,
    {
      themes: themes,
      selectedTheme: rdfGraph.config?.selectedTheme,
      selectedRenderer: rendererState,
      language: rdfGraph.config?.language,
      entityNameType: rdfGraph.config?.entityNameType,
      renderers: rdfGraph.config?.renderers as RendererStatesEnum[],
    })

  return grapholscape
}