import * as owlTranslator from "../../util/owl"

export default function(owlVisualizerComponent, grapholscape) {
  grapholscape.onNodeSelection( node => showOwlTranslation(node))
  grapholscape.onEdgeSelection( edge => showOwlTranslation(edge))

  function showOwlTranslation(elem) {
    if (grapholscape.actualRenderingMode === 'default') {
      let cy_elem = grapholscape.ontology.getElem(elem.data.id, false)
      owlVisualizerComponent.owl_text = owlTranslator.nodeToOwlString(cy_elem, true)
      owlVisualizerComponent.show()
    }
  }
}