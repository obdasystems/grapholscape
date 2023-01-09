import { Diagram, GrapholEntity, GrapholTypesEnum, Iri, Ontology, RendererStatesEnum } from "../model";
import { diagrams } from "../ui/assets";

export type ObjectPropertyConnectedClasses = {
  connectedClasses: GrapholEntity[],
  direct: boolean,
}

export default class NeighbourhoodFinder {

  constructor(private ontology: Ontology) { }

  getDataProperties(classIriString: string): GrapholEntity[] {
    const res: GrapholEntity[] = []

    const classIri = this.getIriObject(classIriString)
    const dataPropertySelector = `[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`

    this.ontology.diagrams.forEach(diagram => {
      diagram.representations.get(RendererStatesEnum.FLOATY)
        ?.cy.$(`node[iri = "${classIri.fullIri}"]`).forEach(classNode => {
          classNode.neighborhood(dataPropertySelector).forEach(dataPropertyNode => {
            const dataPropertyEntity = this.ontology.getEntity(dataPropertyNode.data().iri)
            if (dataPropertyEntity && !res.includes(dataPropertyEntity)) {
              res.push(dataPropertyEntity)
            }
          })
        })
    })

    return res
  }

  getObjectProperties(classIriString: string): Map<GrapholEntity, ObjectPropertyConnectedClasses> {
    const res: Map<GrapholEntity, { connectedClasses: GrapholEntity[], direct: boolean }> = new Map()

    const classIri = this.getIriObject(classIriString)
    const objectPropertyEdgeSelector = `[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`

    this.ontology.diagrams.forEach(diagram => {
      diagram.representations.get(RendererStatesEnum.FLOATY)
        ?.cy.$(`node[iri = "${classIri.fullIri}"]`).forEach(classNode => {
          classNode.connectedEdges(objectPropertyEdgeSelector).forEach(objectPropertyEdge => {
            const objectPropertyEntity = this.ontology.getEntity(objectPropertyEdge.data().iri)
            let classIriConnected: string | undefined
            let direct = true
            if (objectPropertyEntity) {
              // if classIri is the source of the edge (i.e. domain of the object property)
              // then add target's iri to results
              if (classIri.equals(objectPropertyEdge.source().data().iri)) {
                classIriConnected = objectPropertyEdge.target().data().iri
              }

              // if classIri is the target of the edge (i.e. range of the object property)
              // then add source's iri to results
              else if (classIri.equals(objectPropertyEdge.target().data().iri)) {
                classIriConnected = objectPropertyEdge.source().data().iri
                direct = false
              }

              if (classIriConnected) {
                const connectedClassEntity = this.ontology.getEntity(classIriConnected)

                if (connectedClassEntity) {
                  const resEntry = res.get(objectPropertyEntity)
                  if (resEntry) {
                    if (!resEntry.connectedClasses.includes(connectedClassEntity)) // add only new classes
                      resEntry.connectedClasses.push(connectedClassEntity)
                  } else {
                    res.set(objectPropertyEntity, { connectedClasses: [connectedClassEntity], direct: direct })
                  }
                }
              }
            }
          })
        })
    })

    return res
  }

  /**
   * Given a class and an object property, get all classes connected to the given class through such an
   * object property.
   * @param sourceClassIriString the class' iri involved in the object property
   * either as domain or range
   * @param objectPropertyIriString the object property's iri for which to retrieve the connected classes' iris
   * @returns an array of entities 
   */
  getClassesConnectedToObjectProperty(sourceClassIriString: string, objectPropertyIriString: string): GrapholEntity[] {
    const res: GrapholEntity[] = []
    const sourceClassIri = this.getIriObject(sourceClassIriString)
    const objectPropertyIri = this.getIriObject(objectPropertyIriString)

    const cyObjectPropertySelector = `edge[iri = "${objectPropertyIri.fullIri}"]`

    let classIriConnected: string | undefined

    /**
     * For each diagram in floaty representation, search the object property
     * and check if it's connected to the source class and if so, get
     * the other end of the edge.
     */
    this.ontology.diagrams.forEach(diagram => {
      diagram.representations.get(RendererStatesEnum.FLOATY)
        ?.cy.$(cyObjectPropertySelector).forEach(objectPropertyEdge => {
          // if sourceClass is the source of the edge (i.e. domain of the object property)
          // then add target's iri to results
          if (sourceClassIri.equals(objectPropertyEdge.source().data().iri)) {
            classIriConnected = objectPropertyEdge.target().data().iri
          }

          // if sourceClass is the target of the edge (i.e. range of the object property)
          // then add source's iri to results
          else if (sourceClassIri.equals(objectPropertyEdge.target().data().iri)) {
            classIriConnected = objectPropertyEdge.source().data().iri
          }

          if (classIriConnected) {
            const entityToAdd = this.ontology.getEntity(classIriConnected)
            if (entityToAdd) {
              res.push(entityToAdd)
            }
          }
        })
    })

    return res
  }

  getSubclassesIris(classIri: string): string[] {
    const res: string[] = []

    let diagram: Diagram | undefined
    this.ontology.getEntityOccurrences(classIri, undefined, RendererStatesEnum.FLOATY)?.forEach(classOccurrences => {
      classOccurrences.forEach(classOccurrence => {
        diagram = this.ontology.getDiagram(classOccurrence.diagramId)

        if (diagram) {
          diagram.representations.get(RendererStatesEnum.FLOATY)
            ?.cy.$id(classOccurrence.elementId)
            .edgesWith(`[ type = "${GrapholTypesEnum.CLASS}" ]`) // take all edges going/coming to/from other classes
            .filter(edge => edge.data().type === GrapholTypesEnum.INCLUSION) // take only inclusions edges
            .sources(`[ iri != "${classIri}" ]`) // of these inclusions, take sources different from the class we are considering as superclass
            .forEach(subClassElement => { // for each element, add its iri to result
              if (!res.includes(subClassElement.data().iri)) {
                res.push(subClassElement.data().iri)
              }
            })
        }
      })
    })

    return res
  }

  getSuperclassesIris(classIri: string): string[] {
    const res: string[] = []

    let diagram: Diagram | undefined
    this.ontology.getEntityOccurrences(classIri, undefined, RendererStatesEnum.FLOATY)?.forEach(classOccurrences => {
      classOccurrences.forEach(classOccurrence => {
        diagram = this.ontology.getDiagram(classOccurrence.diagramId)

        if (diagram) {
          diagram.representations.get(RendererStatesEnum.FLOATY)
            ?.cy.$id(classOccurrence.elementId)
            .edgesWith(`[ type = "${GrapholTypesEnum.CLASS}" ]`) // take all edges going/coming to/from other classes
            .filter(edge => edge.data().type === GrapholTypesEnum.INCLUSION) // take only inclusions edges
            .targets(`[ iri != "${classIri}" ]`) // of these inclusions, take targets different from the class we are considering as superclass
            .forEach(subClassElement => { // for each element, add its iri to result
              if (!res.includes(subClassElement.data().iri)) {
                res.push(subClassElement.data().iri)
              }
            })
        }
      })
    })

    return res
  }

  private getIriObject(iri: string): Iri {
    return new Iri(iri, this.ontology.namespaces)
  }
}