import { centerOnElement, centerOnEntity } from '../src/core/center-select'
import { Iri } from '../src/model'
import GrapholParser from '../src/parsing/parser'
import { books3 } from './input'

const ontology = new GrapholParser(books3).parseGraphol()
const container = document.createElement('div')
container.style.width = '1000px'
container.style.height = '1000px'

ontology.diagrams[0].cy.mount(container)

describe('Test centering viewport on elements or custom positions', () => {
  const iri = new Iri('http://www.obdasystems.com/books/Author', ontology.namespaces)
  const grapholEntity = ontology.getEntity(iri.prefixed)
  
  test('It should retrieve entities correctly', () => {
    expect(grapholEntity).toBeDefined()
    expect(grapholEntity.iri).toMatchObject(iri)
  })

  const occurrencesOnFirstDiagram = grapholEntity.getOccurrencesByDiagramId(0)
  const occurrencesOnSecondDiagram = grapholEntity.getOccurrencesByDiagramId(1)

  const cyOccurrence1 = ontology.diagrams[0].cy.$id(occurrencesOnFirstDiagram[0].elementId)
  const cyOccurrence2 = ontology.diagrams[1].cy.$id(occurrencesOnSecondDiagram[0].elementId)
  const cyOccurrence3 = ontology.diagrams[1].cy.$id(occurrencesOnSecondDiagram[1].elementId)

  test('It should retrieve occurrences correctly', () => {
    expect(occurrencesOnFirstDiagram).toHaveLength(1)
    expect(occurrencesOnFirstDiagram[0].diagramId).toBe(0)
    expect(occurrencesOnFirstDiagram[0].elementId).toBe('n8')

    expect(occurrencesOnSecondDiagram).toHaveLength(2)
    expect(occurrencesOnSecondDiagram[0].diagramId).toBe(1)
    expect(occurrencesOnSecondDiagram[0].elementId).toBe('n0')
    expect(occurrencesOnSecondDiagram[1].diagramId).toBe(1)
    expect(occurrencesOnSecondDiagram[1].elementId).toBe('n1')
  })

  test('It should move viewport to focus on an element at a given zoom', () => {
    // Mockup Grapholscape Core object 
    const thisObj = {
      actualState: {
        ontology: ontology,
        diagram: ontology.diagrams[0],
        focusedElementZoom: 2.5,
      },
    }
    // centerOnEntity.call(thisObj, iri.prefixed)
    // expect(thisObj.actualState.diagram.cy.pan()).toEqual(cyOccurrence1.renderedPosition())
    // expect(thisObj.actualState.diagram.cy.zoom()).toBe(2.5)

    // show on second diagram and 
    //showEntity.call(thisObj, iri.fullIri, 1, 1.2)
  })
})