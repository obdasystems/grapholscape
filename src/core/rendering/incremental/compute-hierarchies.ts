import { DiagramRepresentation, GrapholEntity, Hierarchy, isGrapholNode, Ontology, RendererStatesEnum, TypesEnum } from "../../../model"


export default function computeHierarchies(ontology: Ontology) {
  const unionNodeSelector = `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`
  const unionEdgeSelector = `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`

  let representation: DiagramRepresentation | undefined
  for (const diagram of ontology.diagrams) {
    representation = diagram.representations.get(RendererStatesEnum.FLOATY)
    if (representation) {
      representation.cy.$(unionNodeSelector).forEach(unionNode => {
        const hierarchy = new Hierarchy(`${unionNode.id()}-${diagram.id}`, unionNode.data().type)
        unionNode.data('hierarchyID', hierarchy.id)
        const grapholUnionNode = diagram.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(unionNode.id())
        if (grapholUnionNode && isGrapholNode(grapholUnionNode)) {
          grapholUnionNode.hierarchyID = hierarchy.id
        }
        let entity: GrapholEntity | undefined
        unionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`).sources().forEach(inputNode => {
          if (inputNode.data().iri) {
            entity = ontology.getEntity(inputNode.data().iri)
            if (entity) {
              hierarchy.addInput(entity)
            }
          }
        })
  
        unionNode.outgoers(unionEdgeSelector).forEach(inclusionEdge => {
          const superClass = inclusionEdge.target()
          if (superClass.data().iri) {
            entity = ontology.getEntity(superClass.data().iri)
            if (entity) {
              hierarchy.addSuperclass(entity, inclusionEdge.data().targetLabel === 'C')
            }
          }
        })
  
        ontology.addHierarchy(hierarchy)
      })

      // let subclassNodes: NodeCollection, subclassEntity: GrapholEntity | undefined, subclassesSet: Set<GrapholEntity> | undefined
      // representation.cy.$(`[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
      //   subclassNodes = classNode.incomers(`[type = "${TypesEnum.INCLUSION}"]`).targets()

      //   subclassNodes.forEach(subclassNode => {
      //     if (subclassNode.data().iri) {
      //       subclassEntity = ontology.getEntity(subclassNode.data().iri)
      //       if (subclassEntity) {
      //         subclassesSet = ontology.subclasses.get(classNode.data().iri)
      //         if (!subclassesSet) {
      //           ontology.subclasses.set(classNode.data().iri, new Set())
      //           subclassesSet = ontology.subclasses.get(classNode.data().iri)
      //         }

      //         subclassesSet?.add(subclassEntity)
      //       }
      //     }
          
      //   })
      // })
    }
   
  }

}