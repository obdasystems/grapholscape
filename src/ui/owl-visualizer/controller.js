import { cyToGrapholElem } from "../../util/model-obj-transformations"
import * as owlTranslator from "../../owl-translator/owl"

/**
 * 
 * @param {import('./owl-visualizer').default} owlVisualizerComponent 
 * @param {import('../../grapholscape').default} grapholscape
 */
export default function(owlVisualizerComponent, grapholscape) {
  grapholscape.onNodeSelection( node => showOwlTranslation(node))
  grapholscape.onEdgeSelection( edge => showOwlTranslation(edge))
  grapholscape.onRendererChange( rendererKey => {
    if (rendererKey !== 'default')
      owlVisualizerComponent.hide()
  })

  function showOwlTranslation(elem) {
    let grapholElem = cyToGrapholElem(elem)
    if (grapholscape.actualRenderingMode === 'default') {
      if (grapholElem.group === 'nodes')
        owlVisualizerComponent.owl_text = owlTranslator.nodeToOwlString(elem, true)
      else
        owlVisualizerComponent.owl_text = owlTranslator.edgeToOwlString(elem, true)

      owlVisualizerComponent.show()
    }
  }
}