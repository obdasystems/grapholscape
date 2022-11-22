import { Ontology, GrapholTypesEnum, Hierarchy, RendererStatesEnum } from "../../../model"


export default function computeHierarchies(ontology: Ontology) {
  const unionNodeSelector = `node[type = "${GrapholTypesEnum.UNION}"], node[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`
  const unionEdgeSelector = `edge[type = "${GrapholTypesEnum.UNION}"], edge[type = "${GrapholTypesEnum.DISJOINT_UNION}"]`

  for (const diagram of ontology.diagrams) {
    diagram.representations.get(RendererStatesEnum.FLOATY)?.cy.$(unionNodeSelector).forEach(unionNode => {
      const hierarchy = new Hierarchy(unionNode.data().type)
      hierarchy.id = `${unionNode.id()}-${diagram.id}`

      unionNode.connectedEdges(`[type = "${GrapholTypesEnum.INPUT}"]`).sources().forEach(inputNode => {
        if (inputNode.data().iri) {
          if (!ontology.hierarchiesBySubclassMap.get(inputNode.data().iri)) {
            ontology.hierarchiesBySubclassMap.set(inputNode.data().iri, [])
          }

          hierarchy.addInput(inputNode.data().iri)
          if (inputNode.data().iri === 'HamTopping') {
            console.log(ontology.hierarchiesBySubclassMap.get('HamTopping'))
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

          hierarchy.addSuperclass(superClass.data().iri, inclusionEdge.data().targetLabel === 'C')
          ontology.hierarchiesBySuperclassMap.get(superClass.data().iri)?.push(hierarchy)
        }
      })
    })
  }

}