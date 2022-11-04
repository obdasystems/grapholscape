import Grapholscape from '../../core'
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { CollectionReturnValue } from "cytoscape"
import GscapeOwlVisualizer from "./owl-visualizer"
import GrapholToOwlTranslator from "../../owl-translator/owl_translator"

export default function (owlVisualizerComponent: GscapeOwlVisualizer, grapholscape: Grapholscape) {
  grapholscape.on(LifecycleEvent.NodeSelection, node => {
    showOwlTranslation(grapholscape.renderer.cy?.$id(node.id))
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, edge => {
    showOwlTranslation(grapholscape.renderer.cy?.$id(edge.id))
  })

  // grapholscape.onNodeSelection( node => showOwlTranslation(node))
  // grapholscape.onEdgeSelection( edge => showOwlTranslation(edge))
  grapholscape.on(LifecycleEvent.RendererChange, rendererKey => {
    if (rendererKey !== RendererStatesEnum.GRAPHOL)
      owlVisualizerComponent.hide()
  })

  function showOwlTranslation(elem: CollectionReturnValue | undefined) {
    if (!elem) return

    if (grapholscape.renderState === RendererStatesEnum.GRAPHOL) {
      const owlTranslator = new GrapholToOwlTranslator(grapholscape)

      if (elem.isNode())
        owlVisualizerComponent.owlText = owlTranslator.nodeToOwlString(elem, true) || ''
      else
        owlVisualizerComponent.owlText = owlTranslator.edgeToOwlString(elem) || ''

      owlVisualizerComponent.show()
    }
  }
}