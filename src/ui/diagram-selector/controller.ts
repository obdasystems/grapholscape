import Grapholscape from '../../core'
import { LifecycleEvent, RendererStatesEnum } from '../../model'
import GscapeDiagramSelector from './diagram-selector'
/**
 * 
 * @param {import('./index').default} diagramSelectorComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (diagramSelectorComponent: GscapeDiagramSelector, grapholscape: Grapholscape) {
  // const diagramsViewData = grapholscape.ontology.diagrams
  const updateDiagrams = (renderer: RendererStatesEnum) => {
    diagramSelectorComponent.diagrams = grapholscape.ontology.diagramsMap
    diagramSelectorComponent.ignoreAnnotationsDiagram = renderer !== RendererStatesEnum.FLOATY
  }
  diagramSelectorComponent.diagrams = grapholscape.ontology.diagramsMap
  if (grapholscape.renderState)
    updateDiagrams(grapholscape.renderState)

  if (grapholscape.diagramId || grapholscape.diagramId === 0) {
    diagramSelectorComponent.currentDiagramId = grapholscape.diagramId
  }
  if (grapholscape.renderer.diagram) {
    diagramSelectorComponent.currentDiagramName = grapholscape.renderer.diagram.name
  }
  diagramSelectorComponent.onDiagramSelection = (diagram) => grapholscape.showDiagram(diagram)

  grapholscape.on(LifecycleEvent.DiagramChange, diagram => {
    if (diagramSelectorComponent.diagrams.has(diagram.id.toString())) {
      diagramSelectorComponent.currentDiagramId = diagram.id
      diagramSelectorComponent.currentDiagramName = diagram.name
    }
  })

  grapholscape.on(LifecycleEvent.RendererChange, updateDiagrams)
}