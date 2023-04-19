import Grapholscape from '../../core'
import { LifecycleEvent } from '../../model'
import GscapeDiagramSelector from './diagram-selector'
/**
 * 
 * @param {import('./index').default} diagramSelectorComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(diagramSelectorComponent: GscapeDiagramSelector, grapholscape: Grapholscape) {
  // const diagramsViewData = grapholscape.ontology.diagrams
  diagramSelectorComponent.diagrams = grapholscape.ontology.diagrams
  if (grapholscape.diagramId || grapholscape.diagramId === 0) {
    diagramSelectorComponent.currentDiagramId = grapholscape.diagramId
  }
  diagramSelectorComponent.onDiagramSelection = (diagram) => grapholscape.showDiagram(diagram)

  grapholscape.on(LifecycleEvent.DiagramChange, diagram => 
    diagramSelectorComponent.currentDiagramId = diagram.id
  )
}