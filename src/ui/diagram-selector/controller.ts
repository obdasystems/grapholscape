import Grapholscape from '../../core'
import { LifecycleEvent, RendererStatesEnum } from '../../model'
import { diagrams } from '../assets'
import GscapeDiagramSelector from './diagram-selector'
/**
 * 
 * @param {import('./index').default} diagramSelectorComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function (diagramSelectorComponent: GscapeDiagramSelector, grapholscape: Grapholscape) {
  // const diagramsViewData = grapholscape.ontology.diagrams
  const updateDiagrams = (renderer: RendererStatesEnum) => {
    if (renderer === RendererStatesEnum.FLOATY && 
      !grapholscape.ontology.annotationsDiagram.isEmpty()
    ) {
      if (!diagramSelectorComponent.diagrams.includes(grapholscape.ontology.annotationsDiagram))
        diagramSelectorComponent.diagrams.push(grapholscape.ontology.annotationsDiagram)
    } else {
      const index = diagramSelectorComponent.diagrams.indexOf(grapholscape.ontology.annotationsDiagram)
      if (index >= 0) {
        diagramSelectorComponent.diagrams.splice(index, 1)
      }
    }
  }
  diagramSelectorComponent.diagrams = grapholscape.ontology.diagrams
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
    if (diagramSelectorComponent.diagrams.includes(diagram)) {
      diagramSelectorComponent.currentDiagramId = diagram.id
      diagramSelectorComponent.currentDiagramName = diagram.name
    }
  })

  grapholscape.on(LifecycleEvent.RendererChange, updateDiagrams)
}