import Ontology from '../src/model/ontology'
import Namespace from '../src/model/namespace'
import Diagram from '../src/model/diagram'

const namespace = new Namespace(['test'], 'http://www.test.com/')
const namespace2 = new Namespace( null , 'http://www.test2.com', true)
let diagram = null
let diagram2 = null

const elems_input = [
  {
  data: { 
    id_xml: 'n1', 
    id:'n1_2',
    iri : {
      full_iri: 'http://www.test.com/entity1',
      rem_chars: 'entity1',
      prefix: 'test:'
    },
    displayed_name: 'entity1',
  },
  position: { x: 200, y: 200 },
  classes: 'predicate', 
  },

  {
    data: { id_xml: 'n2', id:'n2_2' },
    position: { x: 123, y: 234 }
  },

  {
    data: { 
      id_xml: 'n3', 
      id:'n3_2',
      iri : {
        full_iri: 'http://www.test.com/entity2',
        rem_chars: 'entity2',
        prefix: 'test:'
      },
      displayed_name: 'entity2',
    },
    classes: 'predicate',
  },

  {
    data: {
      id_xml: 'e1',
      id: 'e1_2',
      source: 'n1_2',
      target: 'n2_2'
    }
  }
]

// namespace
describe('Test Namespace Class', () => {
  test('constructor', () => {
    expect(namespace.prefixes.length).toBe(1)
    expect(namespace.standard).toBeFalsy()
    expect(namespace.value).toBe('http://www.test.com/')
    expect(namespace2.standard).toBeTruthy()
    expect(namespace2.prefixes.length).toBe(1)
  })

  test('isStandard function test', () => {
    namespace.standard = true
    expect(namespace.isStandard()).toBeTruthy()

    namespace.standard = 0
    expect(namespace.isStandard()).toBeFalsy()

    namespace.standard = ''
    expect(namespace.isStandard()).toBeFalsy()

    namespace.standard = null
    expect(namespace.isStandard()).toBeFalsy()

    namespace.standard = 1
    expect(namespace.isStandard()).toBeTruthy()
  })
})

// diagram
describe('Test Diagram Class', () => {
  diagram = new Diagram('test', 0)
  diagram2 = new Diagram('test2', 1, elems_input)

  test('constructor', () => {
    expect(diagram.name).toBe('test')
    expect(diagram2.edges[0].data).toEqual(elems_input[3].data)
    diagram2.nodes.forEach( (element, i) => {
      expect(element.data).toEqual(elems_input[i].data)
    })
  })
})

// ontology
describe('Test Ontology Class', () => {
  const name = 'test'
  const version = '1.0'
  const ontology = new Ontology(name, version)
  
  test('constructor', () => {
    expect(ontology.name).toBe(name)
    expect(ontology.version).toBe(version)
    expect(ontology.namespaces).toEqual([])
    expect(ontology.diagrams).toEqual([])
  })

  test('addIri() should add a namespace to the namespaces dictionary', () => {
    ontology.addIri(namespace)
    ontology.addIri(namespace2)
    expect(ontology.namespaces).toContain(namespace)
    expect(ontology.namespaces).toContain(namespace2)
  })

  test('getIriFromValue() should return the namespace given it\'s prefix', () => {
    expect(ontology.getIriFromPrefix()).toBe(undefined)
    expect(ontology.getIriFromPrefix('test')).toEqual(namespace)
    expect(ontology.getIriFromPrefix(null)).toBeFalsy()
  })

  test('getIriFromValue() should return the namespace given the full IRI', () => {
    expect(ontology.getIriFromValue()).toBe(undefined)
    expect(ontology.getIriFromValue('http://www.test2.com')).toEqual(namespace2)
    expect(ontology.getIriFromValue('unknown')).toBeFalsy()
  })

  test('destructureIri() should destructure a namespace given the full IRI with last separator', () => {
    const input = 'http://www.test.com/prova'
    const output = {
      prefix: 'test',
      namespace: 'http://www.test.com/',
      rem_chars: 'prova'
    }
    expect(ontology.destructureIri(input)).toEqual(output)
  })

  test('getDiagram() and addDiagram()', () => {
    ontology.addDiagram(diagram)
    ontology.addDiagram(diagram2)

    expect(ontology.diagrams.length).toBe(2)
    expect(ontology.getDiagram(0)).toEqual(diagram)
    expect(ontology.getDiagram('0')).toEqual(diagram)
    expect(ontology.getDiagram(-1)).toBe(undefined)
    expect(ontology.getDiagram(100)).toBe(undefined)
    expect(ontology.getDiagram('test2')).toEqual(diagram2)
    expect(ontology.getDiagram('unkwown')).toBe(undefined)
  })

  test('getElem() and getElemByDiagramAndId() should return an element or undefined', () => {
    expect(ontology.getElem('n3_2').data).toEqual(elems_input[2].data)
    expect(ontology.getElem('n0')).toBeFalsy()
    expect(ontology.getElem(2)).toBeFalsy()
    expect(ontology.getElem('n2_2', false)).not.toBe(undefined)

    expect(ontology.getElemByDiagramAndId('n2', 1).data).toEqual(elems_input[1].data)
    expect(ontology.getElemByDiagramAndId('n0', 0)).toBeFalsy()
    expect(ontology.getElemByDiagramAndId(2, 0)).toBeFalsy()
    expect(ontology.getElemByDiagramAndId('n1', 1, false)).not.toBe(undefined)
    expect(ontology.getElemByDiagramAndId('n1', 5, false)).not.toBe(undefined)
  })

  test('getEntity() should retrieve an entity by its IRI', () => {
    const iri1 = 'http://www.test.com/entity1'
    const prefixed_iri1 = 'test:entity1'
    const iri2 = 'http://www.test.com/entity2'
    const prefixed_iri2 = 'test:entity2'

    expect(ontology.getEntity(iri1).data).toEqual(elems_input[0].data)
    expect(ontology.getEntity(iri2).data).toEqual(elems_input[2].data)
    expect(ontology.getEntity(prefixed_iri1).data).toEqual(elems_input[0].data)
    expect(ontology.getEntity(prefixed_iri2).data).toEqual(elems_input[2].data)
    expect(ontology.getEntity('error')).toBe(undefined)
  })

  test('getEntities()', () => {
    expect(ontology.getEntities(false).length).toBe(2)
    expect(ontology.getEntities().length).toBe(2)
  })
})