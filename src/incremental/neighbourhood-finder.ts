import { GrapholEntity, GrapholNode, GrapholTypesEnum, Iri, Ontology, RendererStatesEnum } from "../model";

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
            if (!res.includes(dataPropertyEntity)) {
              res.push(dataPropertyEntity)
            }
          })
        })
    })

    return res
  }

  getObjectProperties(classIriString: string): Map<GrapholEntity, { connectedClasses: GrapholEntity[], direct: boolean }> {
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

  /**
   * Given a class, find hierarchies in which it participates as a sub class.
   * The search is performed in all the diagrams in floaty representation.
   * @param iri the class' iri
   */
  // getSuperClassesHierarchies(iri: string) {
  //   const result: (Hierarchy | ClassInIsa)[] = []
  //   const unionNodesSelector = `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`
  //   const unionEdgesSelector = `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`
  //   const inclusionOrEquivalenceEdgesSelector = `edge[type ="${GrapholTypesEnum.INCLUSION}"], edge[type ="${GrapholTypesEnum.EQUIVALENCE}"]`

  //   this.ontology.diagrams.forEach(diagram => {
  //     diagram.representations.get(RendererStatesEnum.FLOATY)
  //       ?.cy.$(`[iri = "${iri}"]`).forEach(classNode => {
  //         // get neighbour union nodes
  //         classNode.openNeighborhood(unionNodesSelector).forEach(unionNode => {
  //           let hierarchy: Hierarchy = {
  //             inputs: [],
  //             unionNode: diagram.representations.get(RendererStatesEnum.GRAPHOL).grapholElements.get(unionNode.id()) as GrapholNode,
  //             superclasses: [],
  //           }

  //           unionNode.connectedEdges(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(inputNode => {
  //             if (inputNode.data().iri)
  //               hierarchy.inputs.push(this.ontology.getEntity(inputNode.data().iri))
  //           })

  //           unionNode.connectedEdges(unionEdgesSelector).targets().forEach(superClass => {
  //             if (superClass.data().iri) {
  //               hierarchy.superclasses.push({
  //                 class: this.ontology.getEntity(superClass.data().iri),
  //               })
  //             }
  //           })

  //           result.push(hierarchy)
  //         })

  //         // get also outgoing inclusions and connected equivalence with their target/source
  //         classNode.connectedEdges(inclusionOrEquivalenceEdgesSelector).forEach(edge => {
  //           let superClassIri: string

  //           // if target is different from the starting node, then it's outgoing edge, consider target
  //           if (edge.target() !== classNode)
  //             superClassIri = edge.target().data().iri

  //           // otherwise it's incoming edge, consider source but only if it's equivalence (cause we are asking superclasses)
  //           else if (edge.data().type === GrapholTypesEnum.EQUIVALENCE)
  //             superClassIri = edge.source().data().iri

  //           if (superClassIri) {
  //             result.push({
  //               edgeType: edge.data().type,
  //               class: this.ontology.getEntity(superClassIri),
  //               classPosition: edge.target() !== classNode ? 'superclass' : 'subclass'
  //             })
  //           }
            
  //         })
  //       })
  //   })

  //   return result
  // }

  private getIriObject(iri: string): Iri {
    return new Iri(iri, this.ontology.namespaces)
  }
}