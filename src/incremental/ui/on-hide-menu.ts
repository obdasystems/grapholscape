import IncrementalController from "../controller";
import { GscapeInstanceExplorer } from "./instances-explorer";
import GscapeNavigationMenu from "./navigation-menu/navigation-menu";

export default function(menu: GscapeNavigationMenu | GscapeInstanceExplorer, incrementalController: IncrementalController) {
    incrementalController.endpointController?.stopRequests('instances')
    
    if (menu.referenceEntity && menu.referenceEntityType) {
      const refNodeId = incrementalController.getIDByIRI(menu.referenceEntity.value.iri.fullIri, menu.referenceEntityType)
      if (!refNodeId) return

      const refNode = incrementalController
        .diagram
        .representation
        ?.cy.$id(refNodeId)

      if (refNode?.scratch('should-unpin')) {
        refNode.removeScratch('should-unpin')
        incrementalController.unpinNode(refNode)
      }
    }
}