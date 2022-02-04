import { diagramModelToViewData } from '../../util/model-obj-transformations'
/**
 * 
 * @param {import('./index').default} diagramSelectorComponent 
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function(diagramSelectorComponent, grapholscape) {
  const diagramsViewData = grapholscape.ontology.diagrams.map(diagram => diagramModelToViewData(diagram))
  diagramSelectorComponent.diagrams = diagramsViewData
  diagramSelectorComponent.onDiagramChange = (diagram) => grapholscape.showDiagram(diagram)

  grapholscape.onDiagramChange(newDiagram => diagramSelectorComponent.actual_diagram_id = newDiagram.id)
}