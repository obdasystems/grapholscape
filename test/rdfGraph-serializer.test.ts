/**
 * @jest-environment jsdom
 */

import { DefaultThemes, RendererStatesEnum } from '../src/model'
import { EntityNameType, Position } from '../src/model/rdf-graph/swagger'
import GrapholParser from '../src/parsing/parser'
import rdfgraphSerializer, { IGscape } from '../src/rdfgraph-serializer'
import books4Graphol from './books4.graphol'

describe('test serializing an ontology', () => {
 
  const ontology = new GrapholParser(books4Graphol).parseGraphol() 

  const gscapeMock: IGscape = {
    ontology: ontology,
    diagramId: 0,
    renderer: {
      cy: {
        pan: function (): Position {
          return { x: 0, y: 0 }
        },
        zoom: function (): number {
          return 1.8
        }
      }
    },
    themeList: Object.values(DefaultThemes),
    theme: DefaultThemes.dark,
    language: 'it',
    entityNameType: EntityNameType.LABEL,
    renderers: Object.values(RendererStatesEnum),
    widgets: new Map(),
  }

  console.log(JSON.stringify(rdfgraphSerializer(gscapeMock)))
})