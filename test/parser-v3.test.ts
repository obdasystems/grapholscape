/**
 * @jest-environment jsdom
 */

import { Iri, TypesEnum, FunctionalityEnum } from '../src/model'
import GrapholEntity from '../src/model/graphol-elems/entity'
import GrapholNode from '../src/model/graphol-elems/node'
import GrapholParser from '../src/parsing/parser'
import * as parserV3 from '../src/parsing/parser-v3'
import { getNewEndpoint } from '../src/parsing/parser_util'
import { books3, customOntology } from './input'

const domParser = new DOMParser()
const xmlDoc = domParser.parseFromString(customOntology, 'text/xml')
const ontology = parserV3.getOntologyInfo(xmlDoc)

describe("Test parsing ontology metadata", () => {
  const output = {
    name: 'TEST',
    version: '1.0',
    iri: 'http://www.obdasystems.com/test',
    languages: ['it', 'en'],
    default_language: 'en',
    other_infos: {
      annotations: {
        author: {
          en: ['obdasystems', 'secondauthor']
        },
        comment: {
          en: ['Ontology for testing', 'Hello world']
        },
      }
    }
  }

  test('it should parse basic ontology infos (name, version, iri, languages)', () => {
    expect(ontology.name).toBe(output.name)
    expect(ontology.version).toBe(output.version)
    //expect(ontology.iri).toBe(output.iri)
    expect(ontology.defaultLanguage).toBe(output.default_language)
    expect(ontology.languages).toEqual(output.languages)
  })

  test('it should parse comments correctly', () => {
    const commentsEn = ontology.getComments('en')
    const lexicalForms = commentsEn.map(d => d.lexicalForm)
    expect(lexicalForms).toEqual(output.other_infos.annotations.comment.en)
  })

  test('it should parse multiple annotation of the same language', () => {
    const englishAnnotations = ontology.getAnnotations('en').map(ann => ann.lexicalForm)
    const expectedResult = output.other_infos.annotations.author.en.concat(output.other_infos.annotations.comment.en)

    for (const englishAnnotation of expectedResult) {
      expect(englishAnnotations).toContain(englishAnnotation)
    }
  })
})

describe("Test namespaces dictionary parsing", () => {

  const output = [
    {
      prefixes: ['xsd'],
      value: 'http://www.w3.org/2001/XMLSchema#',
      standard: false,
    },
    {
      prefixes: ['rdf'],
      value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      standard: false,
    },
    {
      prefixes: ['rdfs'],
      value: 'http://www.w3.org/2000/01/rdf-schema#',
      standard: false,
    },
    {
      prefixes: ['test', 'obda'],
      value: 'http://www.obdasystems.com/test',
      standard: false,
    },
    {
      prefixes: [''],
      value: 'http://www.obdasystems.com/',
      standard: false,
    },
    {
      prefixes: ['test2'],
      value: 'http://www.obdasystems.com/test2',
      standard: false,
    },
  ]

  test('it should parse all namespaces', () => {
    ontology.namespaces = parserV3.getNamespaces(xmlDoc)
    const transformedNamespaces = ontology.namespaces.map(n => {
      return {
        prefixes: n.prefixes,
        value: n.toString(),
        standard: n.isStandard(),
      }
    })
    expect(transformedNamespaces).toEqual(output)
  })
})

describe('Test retrieving IRI of a node', () => {
  const node1_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode1</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const output1 = {
    fullIri: 'http://www.obdasystems.com/testNode1',
    prefix: 'test',
    raminder: 'Node1',
    prefixed: 'test:Node1',
    namespace: 'http://www.obdasystems.com/test'
  }

  test('it should parse and destructure a node\'s IRI', () => {
    const retrieved_iri = parserV3.getIri(node1_mock_input, ontology)

    expect(retrieved_iri).toBeDefined()
    if (retrieved_iri) {
      expect(retrieved_iri.fullIri).toEqual(output1.fullIri)
      expect(retrieved_iri.prefix).toEqual(output1.prefix)
      expect(retrieved_iri.prefixed).toEqual(output1.prefixed)
      expect(retrieved_iri.equals(output1.prefixed)).toBe(true)
    }
  })

  test('if node\'s IRI is not found, assign undefined prefix', () => {
    const node2_mock_input = parseSingleNode(`
      <node id="n37" color="#fcfcfc" type="concept">
        <geometry width="110" y="180" x="300" height="50"/>
        <iri>http://www.unkwown.com/testNode2</iri>
        <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
      </node>
    `)

    const output2 = {
      fullIri: 'http://www.unkwown.com/testNode2',
      prefix: undefined,
      remainder: 'http://www.unkwown.com/testNode2',
      prefixed: 'http://www.unkwown.com/testNode2',
      namespace: undefined
    }


    const retrieved_iri = parserV3.getIri(node2_mock_input, ontology)

    expect(retrieved_iri).toBeDefined()
    if (retrieved_iri) {
      expect(retrieved_iri.fullIri).toEqual(output2.fullIri)
      expect(retrieved_iri.prefix).toEqual(output2.prefix)
      expect(retrieved_iri.prefixed).toEqual(output2.prefixed)
      expect(retrieved_iri.equals(output2.prefixed)).toBe(true)
    }
  })

  test('it should return undefined if node doesn\'t have any IRI', () => {
    const node3_mock_input = parseSingleNode(`
      <node id="n38" color="#fcfcfc" type="range-restriction">
        <geometry width="110" y="180" x="300" height="50"/>
        <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
      </node>
    `)

    const retrieved_iri = parserV3.getIri(node3_mock_input, ontology)
    expect(retrieved_iri).toBeUndefined()
  })

})

describe('Test retrieving annotations', () => {
  const node1_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode1</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const retrievedInfosConcept = parserV3.getEntityAnnotations(node1_mock_input, xmlDoc)
  const conceptEntity = new GrapholEntity(new Iri('http://www.obdasystems.com/testNode1', ontology.namespaces))
  conceptEntity.annotations = retrievedInfosConcept

  test('it should parse multiple labels for each language, even not defined language', () => {
    const output = {
      'en': ['label inglese', 'label inglese 2'],
      'it': ['label1', 'label2']
    }
    expect(conceptEntity.getLabels('en').map(ann => ann.lexicalForm)).toEqual(output.en)
    expect(conceptEntity.getLabels('it').map(ann => ann.lexicalForm)).toEqual(output.it)
  })

  test('it should parse multiple descriptions for multiple languages', () => {
    const output = {
      'en': ['Ontology for testing', 'Hello world'],
      'it': ['Lorem ipsum']
    }

    expect(conceptEntity.getComments('en').map(ann => ann.lexicalForm)).toEqual(output.en)
    expect(conceptEntity.getComments('it').map(ann => ann.lexicalForm)).toEqual(output.it)
  })

  test('it should not parse properties on Concepts', () => {
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.SYMMETRIC)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.ASYMMETRIC)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.REFLEXIVE)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.IRREFLEXIVE)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.INVERSE_FUNCTIONAL)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.FUNCTIONAL)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(FunctionalityEnum.TRANSITIVE)).toBeFalsy()
  })
})

describe('Test parsing functionalities', () => {
  const node_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="role">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode2</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const retrievedInfosObjectProperty = parserV3.getFunctionalities(node_mock_input, xmlDoc)
  const objPropertyEntity = new GrapholEntity(new Iri('http://www.obdasystems.com/testNode2', ontology.namespaces))
  objPropertyEntity.functionalities = retrievedInfosObjectProperty

  // For DataProperties and ObjectProperties
  test('it should parse missing properties as falsy value', () => {
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.FUNCTIONAL)).toBeFalsy()
  })

  test('it should parse properties on ObjectProperties correctly', () => {
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.SYMMETRIC)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.ASYMMETRIC)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.REFLEXIVE)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.IRREFLEXIVE)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.REFLEXIVE)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.TRANSITIVE)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.INVERSE_FUNCTIONAL)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(FunctionalityEnum.FUNCTIONAL)).toBeFalsy()
  })
})

describe('Test Facet\'s displayed names', () => {
  test('facet\'s label in the form [constraining-facet-iri\n\n"value"^^datatype]', () => {
    const node_mock_input = parseSingleNode(`
    <node id="n6" color="#000000" type="facet">
      <geometry y="146" width="130" height="0" x="429"/>
      <label y="146" width="183" height="22" x="429">Facet(&lt;http://www.w3.org/2001/XMLSchema#minInclusive> "1"^^xsd:integer)</label>
      <facet>
        <constrainingFacet>http://www.w3.org/2001/XMLSchema#minInclusive</constrainingFacet>
        <literal>
          <lexicalForm>1</lexicalForm>
          <datatype>http://www.w3.org/2001/XMLSchema#integer</datatype>
          <language/>
        </literal>
      </facet>
    </node>`)

    const output = 'xsd:minInclusive\n\n"1"^^xsd:integer'

    expect(parserV3.getFacetDisplayedName(node_mock_input, ontology)).toBe(output)
  })
})

describe('It should parse edges correctly', () => {

  const edgeMock = `<edge id="e165" target="n8" type="equivalence" source="n113">
      <point x="300" y="-350"/>
      <point x="640" y="-350"/>
      <point x="640" y="-10"/>
    </edge>`

  const grapholParser = new GrapholParser(books3)
  grapholParser.parseGraphol()
  const grapholEdge = grapholParser.getGrapholEdgeFromXML(parseSingleNode(edgeMock, 'edge'), 0)

  test('It should create GrapholEdge', () => {
    expect(grapholEdge).toBeDefined()
  })

  test('It should parse breakpoints correctly', () => {
    expect(grapholEdge?.breakpoints).toHaveLength(1)
    expect(grapholEdge?.controlpoints).toHaveLength(3)
    expect(grapholEdge?.controlpoints[0]).toMatchObject({ x: 300, y: -350 })
    expect(grapholEdge?.controlpoints[1]).toMatchObject({ x: 640, y: -350 })
    expect(grapholEdge?.controlpoints[2]).toMatchObject({ x: 640, y: -10 })
    expect(grapholEdge?.breakpoints[0]).toBe(grapholEdge?.controlpoints[1])
  })

  test('It should compute breakpoints distance and weight', () => {
    expect(grapholEdge?.controlpoints[0].distance).toBeUndefined()
    expect(grapholEdge?.controlpoints[0].weight).toBeUndefined()
    expect(grapholEdge?.controlpoints[1].distance.toPrecision(8)).toBe('-240.41631')
    expect(grapholEdge?.controlpoints[1].weight).toBe(0.5)
    expect(grapholEdge?.controlpoints[2].distance).toBeUndefined()
    expect(grapholEdge?.controlpoints[2].distance).toBeUndefined()
  })

  test('It should move endpoints on borders correctly', () => {
    const grapholNode = new GrapholNode('0', TypesEnum.CLASS)
    grapholNode.position = { x: 1000, y: 1000 }
    const customEndpoint = { x: 1020, y: 1010 }

    grapholNode.height = 50
    grapholNode.width = 100

    let firstBreakPoint = { x: 1020, y: 1300 }
    // endpoint should be placed on bottom border, so relatively to the center of the node
    // it should be on (20, 25)
    expect(getNewEndpoint(customEndpoint, grapholNode, firstBreakPoint)).toEqual({ x: 20, y: 25 })
    // now edge comes from top
    firstBreakPoint = { x: 1020, y: -235 }
    expect(getNewEndpoint(customEndpoint, grapholNode, firstBreakPoint)).toEqual({ x: 20, y: -25 })

    // edge coming from left
    firstBreakPoint = { x: 100, y: 1010}
    expect(getNewEndpoint(customEndpoint, grapholNode, firstBreakPoint)).toEqual({ x: -50, y: 10 })

    // edge coming from right
    firstBreakPoint = { x: 1100, y: 1010}
    expect(getNewEndpoint(customEndpoint, grapholNode, firstBreakPoint)).toEqual({ x: 50, y: 10 })
  })

})

function parseSingleNode(string_repr, tagName = 'node') {
  return domParser.parseFromString(string_repr, 'text/xml').getElementsByTagName(tagName)[0]
}