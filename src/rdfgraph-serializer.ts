import { Language } from "./config";
import FloatyTransformer from "./core/rendering/floaty/floaty-transformer";
import { IIncremental } from "./incremental/i-incremental";
import { Diagram, DiagramRepresentation, EntityNameType, GrapholscapeTheme, Ontology, Position, RendererStatesEnum, Viewport } from "./model";
import { Edge, Node, RDFGraph, RDFGraphModelTypeEnum } from "./model/rdf-graph/swagger";

export interface IGscape {
  ontology: Ontology
  diagramId?: number,
  renderer: {
    cy?: {
      pan: () => Position,
      zoom: () => number,
    },
    viewportState?: Viewport
  },
  themeList: GrapholscapeTheme[],
  theme: GrapholscapeTheme,
  language: string | Language,
  entityNameType: EntityNameType,
  renderers: RendererStatesEnum[],
  renderState?: RendererStatesEnum,
  incremental?: IIncremental,
}

/** @internal */
export default function (grapholscape: IGscape, modelType = RDFGraphModelTypeEnum.ONTOLOGY) {
  const ontology = grapholscape.ontology

  const result: RDFGraph = {
    diagrams: [],
    entities: Array.from(ontology.entities.values()).map(e => e.json()),
    modelType: modelType,
    metadata: {
      name: ontology.name,
      version: ontology.version,
      namespaces: ontology.namespaces.map(n => {
        return {
          value: n.value,
          prefixes: n.prefixes
        }
      }),
      iri: ontology.iri,
      defaultLanguage: ontology.defaultLanguage,
      languages: ontology.languages,
      annotations: ontology.getAnnotations().map(ann => {
        return {
          property: ann.property,
          value: ann.value,
          language: ann.language,
          datatype: ann.datatype,
          hasIriValue: ann.hasIriValue,
        }
      }),
      annotationProperties: ontology.annProperties.map(ap => ap.fullIri)
    }
  }

  let diagrams: Diagram[] = []
  if (modelType === RDFGraphModelTypeEnum.VKG) {
    if (grapholscape.incremental) {
      // result.classInstanceEntities = Array.from(grapholscape.incremental.classInstanceEntities.values()).map(e => e.json())
      if (grapholscape.incremental.diagram)
        diagrams = [grapholscape.incremental.diagram]
    }
  } else {
    diagrams = ontology.diagrams
  }

  let repr: DiagramRepresentation | undefined
  const rendererState = modelType === RDFGraphModelTypeEnum.ONTOLOGY ? RendererStatesEnum.FLOATY : RendererStatesEnum.INCREMENTAL
  result.diagrams = diagrams.map(d => {
    repr = d.representations.get(rendererState)
    if (!repr) {
      const floatyTransformer = new FloatyTransformer()
      repr = floatyTransformer.transform(d)
    }
    let resElem: Node | undefined
    return {
      id: d.id,
      name: d.name,
      lastViewportState: d.id === grapholscape.diagramId ? grapholscape.renderer.viewportState : d.lastViewportState,
      nodes: repr.cy.nodes().map(n => {
        resElem = repr!.grapholElements.get(n.id())?.json()

        if (resElem) {
          resElem.position = n.position()
        }

        return resElem
      }).filter(n => n !== undefined) as Node[],
      edges: repr.cy.edges().map(e => repr!.grapholElements.get(e.id())?.json()).filter(e => e !== undefined) as Edge[]
    }
  })


  if (grapholscape.diagramId !== undefined) {
    result.selectedDiagramId = grapholscape.diagramId
  }

  result.config = {
    themes: grapholscape.themeList.map(t => {
      return {
        id: t.id,
        name: t.name,
        colours: t.colours,
      }
    }),
    selectedTheme: grapholscape.theme.id,
    language: grapholscape.language,
    entityNameType: grapholscape.entityNameType,
    renderers: grapholscape.renderers,
  }

  return result
}