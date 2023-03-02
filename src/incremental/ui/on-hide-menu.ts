import IncrementalController from "../controller";
import { GscapeInstanceExplorer } from "./instances-explorer";
import GscapeNavigationMenu from "./navigation-menu/navigation-menu";

export default function(menu: GscapeNavigationMenu | GscapeInstanceExplorer, incrementalController: IncrementalController) {
    incrementalController.endpointController?.stopRequests()
    
    if (menu.referenceEntity) {
      const refNode = incrementalController
        .incrementalDiagram
        .representation
        ?.cy.$id(menu.referenceEntity.value.iri.fullIri)

      if (refNode?.scratch('should-unpin')) {
        refNode.removeScratch('should-unpin')
        incrementalController.unpinNode(refNode)
      }
    }
}