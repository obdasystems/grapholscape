import { Language } from "./config";
import FloatyTransformer from "./core/rendering/floaty/floaty-transformer";
import { EntityNameType, GrapholscapeTheme, Ontology, Position, RendererStatesEnum, SwaggerModel } from "./model";
import { Edge, Node, RDFGraphConfigFiltersEnum } from "./model/rdf-graph/swagger";
import { WidgetEnum } from "./ui";
import { GscapeFilters } from "./ui/filters";

type RDFGraph = SwaggerModel.RDFGraph
const { RDFGraphModelTypeEnum } = SwaggerModel

export interface IGscape {
  ontology: Ontology
  diagramId?: number,
  renderer: {
    cy?: {
      pan: () => Position,
      zoom: () => number,
    },
  },
  themeList: GrapholscapeTheme[],
  theme: GrapholscapeTheme,
  language: string | Language,
  entityNameType: EntityNameType,
  renderers: RendererStatesEnum[],
  widgets: Map<any, any>
}

export default function(grapholscape: IGscape) {
  const ontology = grapholscape.ontology

  const result: RDFGraph = {
    diagrams: [],
    entities: Array.from(ontology.entities.values()).map(e => e.json()),
    modelType: RDFGraphModelTypeEnum.ONTOLOGY,
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
      languages: ontology.languages
    }
  }


  result.diagrams = ontology.diagrams.map(d => {
    let floaty = d.representations.get(RendererStatesEnum.FLOATY)
    if (!floaty) {
      const floatyTransformer = new FloatyTransformer()
      floaty = floatyTransformer.transform(d)
    }
    let resElem: Node | undefined
    return {
      id: d.id,
      name: d.name,
      lastViewportState: d.lastViewportState,
      nodes: floaty.cy.nodes().map(n => {
        resElem = floaty!.grapholElements.get(n.id())?.json()

        if (resElem) {
          resElem.position = n.position()
        }

        return resElem
      }).filter(n => n !== undefined) as Node[],
      edges: floaty.cy.edges().map(e => floaty!.grapholElements.get(e.id())?.json()).filter(e => e !== undefined) as Edge[]
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
    widgets: {},
  }

  const widgetCurrentStates = {}
  grapholscape.widgets.forEach((widget, key) => {
    switch (key) {

      case WidgetEnum.FILTERS:
        result.config!.filters = Array.from((widget as GscapeFilters).filters.values()).map(f => {
          if (f.active) {
            return f.key
          }
        }).filter(f => f !== undefined) as RDFGraphConfigFiltersEnum[]

      case WidgetEnum.ENTITY_DETAILS:
      case WidgetEnum.FILTERS:
      case WidgetEnum.ONTOLOGY_INFO:
      case WidgetEnum.DIAGRAM_SELECTOR:
      case WidgetEnum.ONTOLOGY_EXPLORER:
      case WidgetEnum.OWL_VISUALIZER:
        widgetCurrentStates[key] = widget.enabled !== false
        break
    }
  })
  
  result.config.widgets = widgetCurrentStates

  return result
}