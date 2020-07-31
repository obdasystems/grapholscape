import * as parserV3 from '../src/parsing/parser-v3'
import input from './input'
import Ontology from '../src/model/ontology'

const domParser = new DOMParser()
const xmlDoc = domParser.parseFromString(input, 'text/xml')
const ontology_infos = parserV3.getOntologyInfo(xmlDoc)
const namespaces = parserV3.getIriPrefixesDictionary(xmlDoc)
const ontology = new Ontology('', '', namespaces)

describe("Test parsing ontology metadata", () => {
  const output = {
    name : 'TEST',
    version: '1.0',
    iri: 'http://www.obdasystems.com/test',
    languages: [ 'it', 'en'],
    default_language: 'en',
    other_infos: {
      description: {
        en : [ 'Ontology for testing', 'Hello world' ]
      },
      annotations: {
        author : {
          en : 'obdasystems'
        }
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
    expect(ontology_infos.other_infos.description).toEqual(output.other_infos.description)
  })

  test('it should not parse multiple annotation of the same language', () => {
    expect(ontology_infos.other_infos.annotations).toEqual(output.other_infos.annotations)
  })
})

describe("Test namespaces dictionary parsing", () => {
  
  const output = [
    {
      prefixes : ['xsd'],
      value: 'http://www.w3.org/2001/XMLSchema#',
      standard: false,
    },
    {
      prefixes : ['rdf'],
      value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      standard: false,
    },
    {
      prefixes : ['rdfs'],
      value: 'http://www.w3.org/2000/01/rdf-schema#',
      standard: false,
    },
    {
      prefixes : ['test'],
      value: 'http://www.obdasystems.com/test',
      standard: false,
    },
    {
      prefixes : [''],
      value: 'http://www.obdasystems.com/',
      standard: false,
    },
    {
      prefixes : ['test2'],
      value: 'http://www.obdasystems.com/test',
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
    full_iri : 'http://www.obdasystems.com/testNode1',
    prefix: 'test:',
    remaining_chars: 'Node1'
  }

  const node2_mock_input = parseSingleNode(`
    <node id="n37" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.unkwown.com/testNode2</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
  `)

  const output2 = {
    full_iri : 'http://www.unkwown.com/testNode2',
    prefix: 'undefined:',
    remaining_chars: 'http://www.unkwown.com/testNode2'
  }
 
  test('it should parse and destructure a node\'s IRI in { full_iri, prefix, remaining_chars } ', () => {
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

describe('Test retrieving labels', () => {

  test('nodes having label inside their tag', () => {
    const node_mockup = parseSingleNode(`
    <node id="n32" color="#000000" type="range-restriction">
      <geometry width="20" y="440" x="1190" height="20"/>
      <label width="39" customSize="0" y="440" x="1220" size="12" height="23">exists</label>
    </node>
    `)

    const output = 'exists'
    const retrieved_label = parserV3.getLabel(node_mockup, ontology, xmlDoc)

    expect(retrieved_label).toBe(output)
  })

  test('it should find predicates nodes\' labels as annotations\n\
      and ignore multiple labels for the same language', () => {

    const node1_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode1</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
    `)

    const output = {
      '': 'label con ritorni\na capo senza lingua',
      'en': 'label inglese'
    }
    const retrieved_label = parserV3.getLabel(node1_mock_input, ontology, xmlDoc)

    expect(retrieved_label).toEqual(output)
  })

  test('it should use prefixed IRI if no label is found', () => {
    const node2_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="concept">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode2</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
    `)

    const output = 'test:Node2'
    const retrieved_label = parserV3.getLabel(node2_mock_input, ontology, xmlDoc)

    expect(retrieved_label).toBe(output)
  })

  test('it should use hard coded label dictionary for constructor nodes', () => {
    const node_mock_input = parseSingleNode(`
    <node id="n117" color="#000000" type="complement">
      <geometry width="50" y="-300" x="-110" height="30"/>
    </node>
    `)

    const output = 'not'
    const retrieved_label = parserV3.getLabel(node_mock_input, ontology, xmlDoc)

    expect(retrieved_label).toBe(output)
  })

  test('it should always use prefixed IRI for datatypes', () => {
    const node_mock_input = parseSingleNode(`
    <node type="value-domain" id="n48" color="#fcfcfc">
      <geometry height="40" x="980" width="90" y="-430"/>
      <iri>http://www.w3.org/2001/XMLSchema#integer</iri>
      <label height="23" x="980" customSize="0" size="12" width="66" y="-430"/>
    </node>
    `)

    const output = 'xsd:integer'
    const retrieved_label = parserV3.getLabel(node_mock_input, ontology, xmlDoc)

    expect(retrieved_label).toBe(output)
  })

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

    expect(parserV3.getLabel(node_mock_input, ontology, xmlDoc)).toBe(output)
  })
})

describe('Test predicate\'s info parsing', () => {
  const node_mock_input = parseSingleNode(`
    <node id="n36" color="#fcfcfc" type="role">
      <geometry width="110" y="180" x="300" height="50"/>
      <iri>http://www.obdasystems.com/testNode1</iri>
      <label width="129" customSize="0" y="180" x="300" size="12" height="23"/>
    </node>
    `)

  const retrieved_infos = parserV3.getPredicateInfo(node_mock_input, xmlDoc)

  test('it should parse missing properties as falsy value', () => {
    expect(retrieved_infos.reflexive).toBeFalsy()
    expect(retrieved_infos.functional).toBeFalsy()
  })

  test('it should parse correctly truthy properties', () => {
    expect(retrieved_infos.symmetric).toBeTruthy()
  })
})


function parseSingleNode(string_repr, tagName = 'node') {
  return domParser.parseFromString(string_repr, 'text/xml').getElementsByTagName(tagName)[0]
}