import DiagramBuilder from "../src/core/diagram-builder"
import { DefaultAnnotationProperties, Diagram, DiagramRepresentation, GrapholEntity, Iri, RendererStatesEnum, TypesEnum } from "../src/model"

describe('test diagram builder', () => {

  it('should add annotation properties correctly', () => {
    const diagram = new Diagram('test', 0)
    diagram.representations.set(RendererStatesEnum.FLOATY, new DiagramRepresentation())
    const diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)

    const sourceEntity = new GrapholEntity(new Iri('http://obdasystems.com/sourceClass', []))
    const targetEntity = new GrapholEntity(new Iri('http://obdasystems.com/targetClass', []))
    const propertyEntity = new GrapholEntity(DefaultAnnotationProperties.isDefinedBy)


    expect(diagramBuilder.addAnnotationProperty(
      propertyEntity,
      sourceEntity,
      targetEntity,
      [TypesEnum.CLASS, TypesEnum.CLASS])).toBeDefined()
  })
})