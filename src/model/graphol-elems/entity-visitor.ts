
import { GrapholObjectPropertyEdge } from "./edge"
import GrapholElement from "./graphol-element"
import { GrapholClassNode, GrapholDataPropertyNode, GrapholIndividualNode, GrapholObjectPropertyNode } from "./node"

export interface GrapholElementVisitor<T = void> {
  visitClass(classNode: GrapholClassNode): T
  visitDataProperty(dataProperty: GrapholDataPropertyNode): T
  visitObjectPropertyNode(objectProperty: GrapholObjectPropertyNode): T
  visitObjectPropertyEdge(objectProperty: GrapholObjectPropertyEdge): T
  visitIndividual(individual: GrapholIndividualNode): T
  visitUnknown(element: GrapholElement): T
}