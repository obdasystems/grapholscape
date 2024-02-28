import cytoscape, { Position } from "cytoscape";
import { GscapeInstanceExplorer } from "./instances-explorer";
import GscapeNavigationMenu from "./navigation-menu/navigation-menu";
import { IIncremental } from "../i-incremental";
import { IncrementalRendererState } from "../../core";
import { RendererStatesEnum } from "../../model";

const panGraph = false

export default function (menu: GscapeNavigationMenu | GscapeInstanceExplorer, ic: IIncremental) {
  if (menu.referenceEntity && menu.referenceEntityType) {
    const cy = ic.grapholscape.renderer.cy

    if (cy) {
      const entity = ic.grapholscape.ontology.getEntity(menu.referenceEntity.value.iri.fullIri)
      const nodeId = entity?.getOccurrenceByType(menu.referenceEntityType, RendererStatesEnum.INCREMENTAL)?.id
      if (!nodeId) return

      const node = cy.$id(nodeId)

      if (node) {
        if (panGraph)
          cy?.animate({
            panBy: getPositionToPan(cy, node.renderedPosition()),
            queue: false,
            complete: () => menu.attachTo((node as any).popperRef())
          })
        else {
          menu.attachTo((node as any).popperRef())
          menu.show()
        }

        if (!node.data().pinned) {
          node.scratch('should-unpin', true);
          (ic.grapholscape.renderer.renderState as IncrementalRendererState).pinNode(node)
        }
      }
    }
  }
}

function getPositionToPan(cy: cytoscape.Core, nodePosition: Position) {
  const middlePos = { x: 150, y: cy.height() / 2}
  const y = middlePos.y > nodePosition.y ? middlePos.y - nodePosition.y : -(nodePosition.y - middlePos.y)
  return {
    x: middlePos.x - nodePosition.x,
    y: y,
  }
}