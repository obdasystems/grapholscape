import IncrementalController from "../../controller";
import GscapePathSelector, { PathSelectionEvent } from "./path-selector";

export async function pathSelectionInit(ic: IncrementalController, sourceIri: string, targetIri: string) {
  if (ic.grapholscape.uiContainer) {
    const path = await ic.endpointController?.highlightsManager?.getShortestPath(
      sourceIri,
      targetIri
    )

    if (!path) return

    const pathSelector = new GscapePathSelector()
    ic.grapholscape.uiContainer.appendChild(pathSelector)

    pathSelector.getDisplayedName = (entity) => {
      if (!entity.iri)
        return

      const grapholEntity = ic.grapholscape.ontology.getEntity(entity.iri)
      return grapholEntity?.getDisplayedName(
        ic.grapholscape.entityNameType,
        ic.grapholscape.language,
      )
    }

    pathSelector.addEventListener('path-selection', (evt: PathSelectionEvent) => {
      if (evt.detail.entities) {
        ic.addPath(evt.detail.entities)
      }
    })

    pathSelector.addEventListener('show-more-paths', async () => {
      pathSelector.canShowMore = false

      const paths = await ic.endpointController?.highlightsManager?.getShortestKPaths(
        sourceIri,
        targetIri
      )
      
      if (paths)
        pathSelector.paths = paths
    })

    pathSelector.canShowMore = true
    pathSelector.paths = path
    pathSelector.show()
    return pathSelector
  }

}