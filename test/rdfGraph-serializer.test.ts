/**
 * @jest-environment jsdom
 */

import { DefaultThemes, EntityNameType, Position, RendererStatesEnum } from '../src/model'
import GrapholParser from '../src/parsing/parser'
import rdfgraphSerializer, { IGscape } from '../src/rdfgraph-serializer'
import books4Graphol from './books4.graphol'

const fs = require('fs')

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
    theme: DefaultThemes.dark!,
    language: 'it',
    entityNameType: EntityNameType.LABEL,
    renderers: Object.values(RendererStatesEnum),
    widgets: new Map(),
  }

  const rdfGraph = rdfgraphSerializer(gscapeMock)
  fs.writeFileSync('test/rdf-graph.json', JSON.stringify(rdfGraph))

  // temporary
  test('RDF Graph serialization finishes and is defined', () => {
    expect(rdfGraph).toBeDefined() 
  })
})