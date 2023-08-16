import { EdgeSingular } from "cytoscape";

export enum AnchorPosition {
  SOURCE = 'source',
  TARGET = 'target'
}

/**
 * Display anchors node on edge endpoints
 * @param edge 
 * @param position add source or target anchor, if undefined adds both
 */
export function addAnchorsOnEdge(edge: EdgeSingular, position?: AnchorPosition) {
  if (!position || position === AnchorPosition.SOURCE) {
    const sourceAnchor = edge.cy().add({
      data: {
        id: `${edge.id()}-anchor-${AnchorPosition.SOURCE}`,
        edgeRef: edge,
        type: edge.data().type,
        anchorPosition: AnchorPosition.SOURCE,
      },
      classes: 'anchor-node',
      position: edge.sourceEndpoint(),
    })
    edge.scratch('source-anchor', sourceAnchor)
  }

  if (!position || position === AnchorPosition.TARGET) {
    const targetAnchor = edge.cy().add({
      data: {
        id: `${edge.id()}-anchor-${AnchorPosition.TARGET}`,
        edgeRef: edge,
        type: edge.data().type,
        anchorPosition: AnchorPosition.TARGET,
      },
      classes: 'anchor-node',
      position: edge.targetEndpoint(),
    })

    edge.scratch('target-anchor', targetAnchor)
  }
}

/**
 * Remove anchors node, assuming edge is not attached to any anchor
 * @param edge
 * @param position remove source or target anchor, if undefined removes both
 */
export function removeAnchorsOnEdge(edge: EdgeSingular, position?: AnchorPosition) {
  if (!position || position === AnchorPosition.SOURCE) {
    edge.scratch('source-anchor')?.remove()
    edge.removeScratch('source-anchor')
  }

  if (!position || position === AnchorPosition.TARGET) {
    edge.scratch('target-anchor')?.remove()
    edge.removeScratch('target-anchor')
  }
}