import { Collection, EdgeSingular, NodeSingular, SingularElementReturnValue } from "cytoscape";
import { Diagram, DiagramRepresentation, GrapholElement, GrapholTypesEnum } from "../../model";
import { cytoscapeFilter } from "./filtering";

export interface GrapholTransformer {
  transform(diagram: Diagram): DiagramRepresentation
}

export default abstract class BaseGrapholTransformer implements GrapholTransformer{
  abstract transform(diagram: Diagram): DiagramRepresentation
  protected result: DiagramRepresentation

  protected get newCy() { return this.result.cy }
  
  // filter nodes if the criterion function returns true
  // criterion must be a function returning a boolean value for a given a node
  protected filterByCriterion(criterion: (element: cytoscape.SingularElementReturnValue) => boolean) {
    let count = 0
    this.newCy.$('*').forEach(node => {
      if (criterion(node)) {
        count += 1
        cytoscapeFilter(node.id(), '', this.newCy)
      }
    })
  }

  protected deleteFilteredElements() {
    this.deleteElements(this.newCy.elements('.filtered'))
  }

  protected isRestriction(grapholElement: GrapholElement) {
    if (!grapholElement) return false
    return grapholElement.is(GrapholTypesEnum.DOMAIN_RESTRICTION) ||
      grapholElement.is(GrapholTypesEnum.RANGE_RESTRICTION)
  }

  protected getGrapholElement(id: string) {
    return this.result.grapholElements.get(id)
  }

  protected deleteElements(elements: Collection) {
    elements.forEach(elem => {
      this.deleteElement(elem)
    })
  }

  protected deleteElement(elem: EdgeSingular)
  protected deleteElement(elem: NodeSingular)
  protected deleteElement(elem: SingularElementReturnValue) {
    this.newCy.remove(elem)
    this.result.grapholElements.delete(elem.id())
  }
}