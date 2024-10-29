import { DiagramRepresentation, GrapholEntity, Hierarchy, isGrapholNode, Ontology, RendererStatesEnum, TypesEnum } from "../model"

export default function computeHierarchies(ontology: Ontology) {
  const unionNodeSelector = `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`
  const unionEdgeSelector = `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"], edge[type = "${TypesEnum.COMPLETE_UNION}"], edge[type = "${TypesEnum.COMPLETE_DISJOINT_UNION}"]`

  let representation: DiagramRepresentation | undefined
  for (const diagram of ontology.diagrams) {
    representation = diagram.representations.get(RendererStatesEnum.FLOATY)
    if (representation) {
      representation.cy.$(unionNodeSelector).forEach(unionNode => {
        const id = unionNode.data().hierarchyID || `${unionNode.id()}-${diagram.id}`
        const hierarchy = new Hierarchy(id, unionNode.data().type)
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

      representation.cy.edges(`[type = "${TypesEnum.INCLUSION}"]`).forEach(inclusionEdge => {
        const source = inclusionEdge.source()
        const target = inclusionEdge.target()
        if (source.data().iri && target.data().iri && source.data().type === TypesEnum.CLASS && target.data().type === TypesEnum.CLASS) {
          ontology.addSubclassOf(source.data().iri, target.data().iri)
        }
      })
    }
   
  }

}