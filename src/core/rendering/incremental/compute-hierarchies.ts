import { GrapholEntity, Hierarchy, Ontology, RendererStatesEnum, TypesEnum } from "../../../model"


export default function computeHierarchies(ontology: Ontology) {
  const unionNodeSelector = `node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`
  const unionEdgeSelector = `edge[type = "${TypesEnum.UNION}"], edge[type = "${TypesEnum.DISJOINT_UNION}"]`

  for (const diagram of ontology.diagrams) {
    diagram.representations.get(RendererStatesEnum.FLOATY)?.cy.$(unionNodeSelector).forEach(unionNode => {
      const hierarchy = new Hierarchy(`${unionNode.id()}-${diagram.id}`, unionNode.data().type)
      let entity: GrapholEntity | null
      unionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`).sources().forEach(inputNode => {
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