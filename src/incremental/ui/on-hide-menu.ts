import { IncrementalRendererState } from "../../core";
import { Iri, RendererStatesEnum, TypesEnum } from "../../model";
import { IIncremental } from "../i-incremental";
// import { GscapeInstanceExplorer } from "./instances-explorer";
// import GscapeNavigationMenu from "./navigation-menu/navigation-menu";

export default function(menu: any, ic: IIncremental) {
    // incrementalController.endpointController?.stopRequests('instances')
    
    if (menu.referenceEntity && menu.referenceEntityType) {
      const entity = ic.grapholscape.ontology.getEntity(menu.referenceEntity.value.iri.fullIri)
      const refNodeId = entity?.getOccurrenceByType(menu.referenceEntityType, RendererStatesEnum.INCREMENTAL)?.id
      if (!refNodeId) return

      const refNode = ic
        .diagram
        .representation
        ?.cy.$id(refNodeId)

      if (refNode?.scratch('should-unpin')) {
        refNode.removeScratch('should-unpin');
        (ic.grapholscape.renderer.renderState as IncrementalRendererState).unpinNode(refNode)
      }
    }
}