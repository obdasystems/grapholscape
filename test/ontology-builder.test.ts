import cytoscape from "cytoscape"
import cola from 'cytoscape-cola'
import edgehandles from 'cytoscape-edgehandles'
import klay from 'cytoscape-klay'
import popper from 'cytoscape-popper'
import DesignerCore from "../src/builder/core"
import OntologyBuilder from "../src/builder/ontology-builder"
import { Diagram, GrapholElement, Namespace, Ontology, RendererStatesEnum, TypesEnum } from "../src/model"
import { FunctionPropertiesEnum } from "../src/model/rdf-graph/swagger"

cytoscape.use(popper)
cytoscape.use(cola)
cytoscape.warnings(false)
cytoscape.use(edgehandles)
cytoscape.use(klay)

describe("Test OntologyBuilder Class", () => {
  const divElement = document.createElement('div')
  const ns = new Namespace([''], 'http://obdasystems/test/')
  const ontology = new Ontology('test', '', ns.value, [ns])
  ontology.addDiagram(new Diagram('test', 0))
  const grapholscape = new DesignerCore(ontology, divElement, { renderers: [RendererStatesEnum.FLOATY] })
  grapholscape.showDiagram(0)
  const diagramRepr = grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)
  const ontologyBuilder = new OntologyBuilder(grapholscape)

  const class1IRI = `${ns.value}class1`
  const class2IRI = `${ns.value}class2`
  const op1IRI = `${ns.value}op1`

  it('Should add classes correctly', () => {
    ontologyBuilder.addNodeElement(class1IRI, TypesEnum.CLASS)
    ontologyBuilder.addNodeElement(class2IRI, TypesEnum.CLASS)

    const addedClass1 = grapholscape.ontology.getEntity(class1IRI)
    const addedClass2 = grapholscape.ontology.getEntity(class2IRI)
    const class1Occurrences = addedClass1?.occurrences.get(RendererStatesEnum.FLOATY)
    const class2Occurrences = addedClass2?.occurrences.get(RendererStatesEnum.FLOATY)
    let grapholClass1Node: GrapholElement | undefined = undefined,
      grapholClass2Node: GrapholElement | undefined = undefined

    if (class1Occurrences) {
      grapholClass1Node = class1Occurrences[0]
    }

    if (class2Occurrences) {
      grapholClass2Node = class2Occurrences[0]
    }

    expect(grapholscape.ontology.entities.size).toBe(2)
    expect(addedClass1).toBeDefined()
    expect(addedClass1?.types.has(TypesEnum.CLASS)).toBeTruthy()
    expect(addedClass1?.iri).toBeDefined()
    expect(addedClass1?.occurrences).toBeDefined()

    expect(grapholClass1Node).toBeDefined()
    expect(grapholClass1Node?.isNode()).toBeTruthy()
    expect(grapholClass1Node?.iri).toBe(addedClass1?.fullIri)
    expect(grapholClass1Node?.diagramId).toBe(0)

    const diagramRepr = grapholscape.renderer.diagram?.representations.get(RendererStatesEnum.FLOATY)
    expect(diagramRepr?.grapholElements.size).toBe(2)
    expect(diagramRepr?.grapholElements.get(grapholClass1Node?.id || '')).toBe(grapholClass1Node)
  })

  it('Should add object properties correctly', () => {
    ontologyBuilder.addEdgeElement(
      op1IRI,
      TypesEnum.OBJECT_PROPERTY,
      class1IRI,
      class2IRI,
      TypesEnum.CLASS,
      [FunctionPropertiesEnum.IRREFLEXIVE]
    )
    const addedOP1 = ontology.getEntity(op1IRI)

    const op1Occurrences = addedOP1?.occurrences.get(RendererStatesEnum.FLOATY)
    let grapholOP1Edge: GrapholElement | undefined
    if (op1Occurrences) {
      grapholOP1Edge = op1Occurrences[0]
    }

    expect(grapholscape.ontology.entities.size).toBe(3)
    expect(addedOP1).toBeDefined()
    expect(addedOP1?.types.has(TypesEnum.OBJECT_PROPERTY)).toBeTruthy()
    expect(addedOP1?.iri).toBeDefined()
    expect(addedOP1?.occurrences).toBeDefined()

    expect(grapholOP1Edge).toBeDefined()
    expect(grapholOP1Edge?.isEdge()).toBeTruthy()
    expect(grapholOP1Edge?.iri).toBe(addedOP1?.fullIri)
    expect(grapholOP1Edge?.diagramId).toBe(0)

    expect(diagramRepr?.grapholElements.size).toBe(3)
    expect(diagramRepr?.grapholElements.get(grapholOP1Edge?.id || '')).toBe(grapholOP1Edge)
  })
})