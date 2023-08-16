import { Core, EdgeSingular, NodeSingular } from "cytoscape";
import { GrapholscapeTheme, TypesEnum } from "../../model";
import { setDesignerStyle } from "../ui/style";
import edgeHandlesDefaults from "./edge-handles-defaults";

/**
 * Start edge creation of a given type from a sourceElem
 * @param cy cytoscape instance to draw in
 * @param edgeType type of edge to draw
 * @param sourceNode source of the new edge
 * @param theme current Grapholscape's theme, for styling edge properly
 * @param onComplete callback to execute when edge is completely drawn
 * @param isReversed whether to use sourceNode as target or not, default false
 */
export default function (
  cy: Core,
  edgeType: TypesEnum,
  sourceNode: NodeSingular,
  theme: GrapholscapeTheme,
  onComplete?: (event, sourceNode: NodeSingular, targetNode: NodeSingular, addedEdge: EdgeSingular) => void,
  isReversed: boolean = false) {

  if (onComplete) {
    (cy as any).one('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
      onComplete(event, sourceNode, targetNode, addedEdge)
      // clear event listener, avoid pollution in case other services create edges
      cy.off('ehcomplete')
      cy.removeScratch('edge-creation-type')
    })

    cy.on('ehstop', () => {
      cy.off('ehcomplete')
      cy.off('ehstop')
    })
  }

  cy.scratch('edge-creation-type', edgeType)
  setDesignerStyle(cy, theme)
  let edgehandles = (cy as any).edgehandles(edgeHandlesDefaults(edgeType, isReversed))
  edgehandles.start(sourceNode)
}