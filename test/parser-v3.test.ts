/**
 * @jest-environment jsdom
 */

import * as parserV3 from '../src/parsing/parser-v3'
import { books3, customOntology } from './input'
import Ontology from '../src/model/ontology'
import Namespace from '../src/model/namespace'
import GrapholEntity, { Functionalities } from '../src/model/graphol-elems/entity'
import { UNDEFINED_LANGUAGE } from '../src/model/graphol-elems/annotation'

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
    expect(ontology.languages.default).toBe(output.default_language)
    expect(ontology.languages.list).toEqual(output.languages)
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
    expect(retrieved_iri.fullIri).toEqual(output1.fullIri)
    expect(retrieved_iri.prefix).toEqual(output1.prefix)
    expect(retrieved_iri.prefixed).toEqual(output1.prefixed)
    expect(retrieved_iri.equals(output1.prefixed)).toBe(true)
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
    expect(retrieved_iri.fullIri).toEqual(output2.fullIri)
    expect(retrieved_iri.prefix).toEqual(output2.prefix)
    expect(retrieved_iri.prefixed).toEqual(output2.prefixed)
    expect(retrieved_iri.equals(output2.prefixed)).toBe(true)
  })

  test('it should return null if node doesn\'t have any IRI', () => {
    const node3_mock_input = parseSingleNode(`
      <node id="n38" color="#fcfcfc" type="range-restriction">
        <geometry width="110" y="180" x="300" height="50"/>
        <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
      </node>
    `)

    const retrieved_iri = parserV3.getIri(node3_mock_input, ontology)
    expect(retrieved_iri).toBeNull()
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
  const conceptEntity = new GrapholEntity(null,null)
  conceptEntity.annotations = retrievedInfosConcept

  test('it should parse multiple labels for each language, even not defined language', () => {
    const output = {
      '_': ['label con ritorni\na capo senza lingua', 'label2 senza lingua'],
      'en': ['label inglese', 'label inglese 2'],
      'it': ['label1', 'label2']
    }
    expect(conceptEntity.getLabels('en').map(ann => ann.lexicalForm)).toEqual(output.en)
    expect(conceptEntity.getLabels('it').map(ann => ann.lexicalForm)).toEqual(output.it)
    expect(conceptEntity.getLabels(UNDEFINED_LANGUAGE).map(ann => ann.lexicalForm)).toEqual(output['_'])
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
    expect(conceptEntity.hasFunctionality(Functionalities.symmetric)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.asymmetric)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.reflexive)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.irreflexive)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.inverseFunctional)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.functional)).toBeFalsy()
    expect(conceptEntity.hasFunctionality(Functionalities.transitive)).toBeFalsy()
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
  const objPropertyEntity = new GrapholEntity(null, null)
  objPropertyEntity.functionalities = retrievedInfosObjectProperty

  // For DataProperties and ObjectProperties
  test('it should parse missing properties as falsy value', () => {
    expect(objPropertyEntity.hasFunctionality(Functionalities.functional)).toBeFalsy()
  })

  test('it should parse properties on ObjectProperties correctly', () => {
    expect(objPropertyEntity.hasFunctionality(Functionalities.symmetric)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.asymmetric)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.reflexive)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.irreflexive)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.reflexive)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.transitive)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.inverseFunctional)).toBeTruthy()
    expect(objPropertyEntity.hasFunctionality(Functionalities.functional)).toBeFalsy()
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

    expect(parserV3.getFacetDisplayedName(node_mock_input, ontology)).toBe(output)
  })
})

function parseSingleNode(string_repr, tagName = 'node') {
  return domParser.parseFromString(string_repr, 'text/xml').getElementsByTagName(tagName)[0]
}