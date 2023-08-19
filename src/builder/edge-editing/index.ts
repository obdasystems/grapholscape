import { EdgeSingular, EventObject, NodeSingular } from "cytoscape";
import Grapholscape from "../core";
import { TypesEnum } from "../../model";
import drawNewEdge from "../edge-creation/draw-new-edge";
import { addAnchorsOnEdge, AnchorPosition, removeAnchorsOnEdge } from "./anchor-utilities";

export default function edgeEditing(grapholscape: Grapholscape) {
  let selectedEdge: EdgeSingular | undefined

  const cy = grapholscape.renderer.cy
  if (!cy)
    return

  const onMouseDownOnAnchor = (evt: EventObject) => {
    if (!selectedEdge)
      return

    const anchor = evt.target
    let newTempEdgeSource: NodeSingular
    const isEditingFromSource = anchor.data().anchorPosition === AnchorPosition.SOURCE
    if (isEditingFromSource) {
      newTempEdgeSource = selectedEdge.target()
      removeAnchorsOnEdge(selectedEdge, AnchorPosition.TARGET)
    } else {
      newTempEdgeSource = selectedEdge.source()
      removeAnchorsOnEdge(selectedEdge, AnchorPosition.SOURCE)
    }

    cy.on('ehstop', () => {
      onEditingCompleted()
    })

    cy.scratch('edge-creation-label', selectedEdge.data().displayedName)
    cy.scratch('edge-creation-reversed', isEditingFromSource)

    drawNewEdge(
      cy,
      selectedEdge.data().type,
      newTempEdgeSource,
      grapholscape.theme,
      (evt, sourceNode, targetNode, addedEdge) => { // eh-complete
        addedEdge.remove()

        selectedEdge?.move({
          source: !isEditingFromSource ? sourceNode.id() : targetNode.id(),
          target: !isEditingFromSource ? targetNode.id() : sourceNode.id(),
        })

        onEditingCompleted()
      },
      isEditingFromSource
    )

    anchor.once('drag', () => {
      selectedEdge?.addClass('editing')
    })
  }

  const onEditingCompleted = () => {
    if (selectedEdge) {
      removeAnchorsOnEdge(selectedEdge)
      selectedEdge.removeClass('editing')
    }
    selectedEdge = undefined

    cy.removeScratch('edge-creation-label')
    cy.removeScratch('edge-creation-reversed')
    cy.off('mousedown', onMouseDownOnAnchor)
    // cy?.off('mouseup', onEditingCompleted)
  }

  cy.on('tap', (evt) => {
    onEditingCompleted() // complete previously started editing

    if (evt.target.isEdge && evt.target.isEdge()) {
      const edge = evt.target as EdgeSingular

      if (edge.data().type !== TypesEnum.ATTRIBUTE_EDGE) {

        switch (edge.data().type) {
          case TypesEnum.UNION:
          case TypesEnum.DISJOINT_UNION:
          case TypesEnum.COMPLETE_UNION:
          case TypesEnum.COMPLETE_DISJOINT_UNION:
            addAnchorsOnEdge(edge, AnchorPosition.TARGET) // only target
            break

          case TypesEnum.INPUT:
            addAnchorsOnEdge(edge, AnchorPosition.SOURCE) // only source
            break

          default:
            addAnchorsOnEdge(edge)
            break
        }

      }

      selectedEdge = edge
      // originalSource = edge.source()
      // originalTarget = edge.target()
      cy.on('mousedown', '.anchor-node', onMouseDownOnAnchor)
    }
  })
}