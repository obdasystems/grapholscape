import cytoscape, { Position } from "cytoscape";
import IncrementalController from "../controller";
import { GscapeInstanceExplorer } from "./instances-explorer";
import GscapeNavigationMenu from "./navigation-menu/navigation-menu";

const panGraph = false

export default function (menu: GscapeNavigationMenu | GscapeInstanceExplorer, incrementalController: IncrementalController) {
  if (menu.referenceEntity) {
    const cy = incrementalController.grapholscape.renderer.cy

    if (cy) {
      const node = cy.$id(menu.referenceEntity.value.iri.fullIri)

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
          node.scratch('should-unpin', true)
          incrementalController.pinNode(node)
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