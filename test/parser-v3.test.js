/**
 * @jest-environment jsdom
 */

import * as parserV3 from '../src/parsing/parser-v3'
import input from './input'
import Ontology from '../src/model/ontology'
import Namespace from '../src/model/namespace'

const domParser = new DOMParser()
const xmlDoc = domParser.parseFromString(input, 'text/xml')
const ontology_infos = parserV3.getOntologyInfo(xmlDoc)
const namespaces = parserV3.getIriPrefixesDictionary(xmlDoc).map(ns =>
  new Namespace(ns.prefixes, ns.value, ns.standard)
)
const ontology = new Ontology('', '', namespaces)

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
    expect(ontology_infos.name).toBe(output.name)
    expect(ontology_infos.version).toBe(output.version)
    expect(ontology_infos.iri).toBe(output.iri)
    expect(ontology_infos.default_language).toBe(output.default_language)
    expect(ontology_infos.languages).toEqual(output.languages)
  })

  test('it should chain comments of the same language in an array', () => {
    expect(ontology_infos.other_infos.annotations.comment).toEqual(output.other_infos.annotations.comment)
  })

  test('it should parse multiple annotation of the same language', () => {
    expect(ontology_infos.other_infos.annotations).toEqual(output.other_infos.annotations)
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
    expect(namespaces).toEqual(output)
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
    remainingChars: 'Node1',
    prefixed: 'test:Node1',
    namespace: 'http://www.obdasystems.com/test'
  }

  const node2_mock_input = parseSingleNode(`
    <node id="n37" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.unkwown.com/testNode2</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const output2 = {
    fullIri: 'http://www.unkwown.com/testNode2',
    prefix: 'undefined',
    remainingChars: 'http://www.unkwown.com/testNode2',
    prefixed: 'http://www.unkwown.com/testNode2',
    namespace: 'undefined'
  }

  test('it should parse and destructure a node\'s IRI', () => {
    const retrieved_iri = parserV3.getIri(node1_mock_input, ontology)
    expect(retrieved_iri).toEqual(output1)
  })

  test('if node\'s IRI is not found, assign undefined prefix', () => {
    const retrieved_iri = parserV3.getIri(node2_mock_input, ontology)
    expect(retrieved_iri).toEqual(output2)
  })

  test('it should return empty object if node doesn\'t have any IRI', () => {
    const node3_mock_input = parseSingleNode(`
      <node id="n38" color="#fcfcfc" type="range-restriction">
        <geometry width="110" y="180" x="300" height="50"/>
        <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
      </node>
    `)

    const retrieved_iri = parserV3.getIri(node3_mock_input, ontology)
    expect(retrieved_iri).toEqual({})
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

  const node2_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="role">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode2</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const retrievedInfosConcept = parserV3.getPredicateInfo(node1_mock_input, xmlDoc)
  const retrievedInfosObjectProperty = parserV3.getPredicateInfo(node2_mock_input, xmlDoc)

  test('it should parse multiple labels for each language, even not defined language', () => {
    const output = {
      '': ['label con ritorni\na capo senza lingua', 'label2 senza lingua'],
      'en': ['label inglese', 'label inglese 2'],
      'it': ['label1', 'label2']
    }
    expect(retrievedInfosConcept.annotations.label).toEqual(output)
  })

  test('it should parse multiple descriptions for multiple languages', () => {
    const output = {
      'en': ['Ontology for testing', 'Hello world'],
      'it': ['Lorem ipsum']
    }

    expect(retrievedInfosConcept.annotations.comment).toEqual(output)
  })

  // For DataProperties and ObjectProperties
  test('it should parse missing properties as falsy value', () => {
    expect(retrievedInfosConcept.functional).toBeFalsy()
  })

  test('it should not parse properties on Concepts', () => {
    expect(retrievedInfosConcept.symmetric).toBeUndefined()
    expect(retrievedInfosConcept.asymmetric).toBeUndefined()
    expect(retrievedInfosConcept.reflexive).toBeUndefined()
    expect(retrievedInfosConcept.irreflexive).toBeUndefined()
    expect(retrievedInfosConcept.inverseFunctional).toBeUndefined()
    expect(retrievedInfosConcept.functional).toBeUndefined()
    expect(retrievedInfosConcept.transitive).toBeUndefined()
  })

  test('it should parse properties on ObjectProperties correctly', () => {
    expect(retrievedInfosObjectProperty.symmetric).toBeTruthy()
    expect(retrievedInfosObjectProperty.asymmetric).toBeTruthy()
    expect(retrievedInfosObjectProperty.reflexive).toBeTruthy()
    expect(retrievedInfosObjectProperty.irreflexive).toBeTruthy()
    expect(retrievedInfosObjectProperty.transitive).toBeTruthy()
    expect(retrievedInfosObjectProperty.inverseFunctional).toBeTruthy()
    expect(retrievedInfosObjectProperty.functional).toBeFalsy()
  })
})

describe('Test Facet\'s displayed names', () => {
  test('facet\'s label in the form [constraining-facet-iri^^"value"]', () => {
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

    const output = 'xsd:minInclusive^^"1"'

    expect(parserV3.getFacetDisplayedName(node_mock_input, ontology, xmlDoc)).toBe(output)
  })
})

function parseSingleNode(string_repr, tagName = 'node') {
  return domParser.parseFromString(string_repr, 'text/xml').getElementsByTagName(tagName)[0]
}