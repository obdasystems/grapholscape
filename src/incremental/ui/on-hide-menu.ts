import IncrementalController from "../controller";
import { GscapeInstanceExplorer } from "./instances-explorer";
import GscapeNavigationMenu from "./navigation-menu/navigation-menu";

export default function(menu: GscapeNavigationMenu | GscapeInstanceExplorer, incrementalController: IncrementalController) {
    incrementalController.endpointController?.stopRequests('instances')
    
    if (menu.referenceEntity && menu.referenceEntityType) {
      const refNode = incrementalController
        .diagram
        .representation
        ?.cy.$id(`${menu.referenceEntity.value.iri.fullIri}-${menu.referenceEntityType}`)

      if (refNode?.scratch('should-unpin')) {
        refNode.removeScratch('should-unpin')
        incrementalController.unpinNode(refNode)
      }
    }
}