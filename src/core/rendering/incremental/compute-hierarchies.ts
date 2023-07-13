import { GrapholNode } from "../../../../dist"
import { Ontology, GrapholTypesEnum, Hierarchy, RendererStatesEnum, GrapholEntity, isGrapholNode } from "../../../model"


export default function computeHierarchies(ontology: Ontology) {
  const unionNodeSelector = `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`
  const unionEdgeSelector = `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`

  for (const diagram of ontology.diagrams) {
    diagram.representations.get(RendererStatesEnum.FLOATY)?.cy.$(unionNodeSelector).forEach(unionNode => {
      const hierarchy = new Hierarchy(unionNode.data().type)
      hierarchy.id = `${unionNode.id()}-${diagram.id}`
      unionNode.data('hierarchyID', hierarchy.id)
      const grapholUnionNode = diagram.representations.get(RendererStatesEnum.FLOATY)?.grapholElements.get(unionNode.id()) 
      if(grapholUnionNode && isGrapholNode(grapholUnionNode)){
        grapholUnionNode.hierarchyID = hierarchy.id
      }
      let entity: GrapholEntity | null
      unionNode.connectedEdges(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(inputNode => {
        if (inputNode.data().iri) {
          if (!ontology.hierarchiesBySubclassMap.get(inputNode.data().iri)) {
            ontology.hierarchiesBySubclassMap.set(inputNode.data().iri, [])
          }
          entity = ontology.getEntity(inputNode.data().iri)
          if (entity) {
            hierarchy.addInput(entity)
          }

          ontology.hierarchiesBySubclassMap.get(inputNode.data().iri)?.push(hierarchy)
        }
      })

      unionNode.outgoers(unionEdgeSelector).forEach(inclusionEdge => {
        const superClass = inclusionEdge.target()

        if (superClass.data().iri) {
          if (!ontology.hierarchiesBySuperclassMap.get(superClass.data().iri)) {
            ontology.hierarchiesBySuperclassMap.set(superClass.data().iri, [])
          }

          entity = ontology.getEntity(superClass.data().iri)
          if (entity) {
            hierarchy.addSuperclass(entity, inclusionEdge.data().targetLabel === 'C')
          }

          ontology.hierarchiesBySuperclassMap.get(superClass.data().iri)?.push(hierarchy)
        }
      })
    })
  }

}