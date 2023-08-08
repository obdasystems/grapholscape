import { EdgeSingular, NodeSingular } from "cytoscape";
import { RendererStatesEnum } from "../../../model";
import IncrementalController from "../../controller";
import { edgeHandlesOptions } from "../../edge-handles-options";
import GscapePathSelector from "./path-selector";

export function pathSelectionInit(
  ic: IncrementalController,
  sourceIri: string,
  targetIri: string) {

  const pathSelector = new GscapePathSelector(ic.grapholscape.theme)

  ic.endpointController?.highlightsManager?.getShortestKPaths(
    sourceIri,
    targetIri
  ).then(paths => pathSelector.paths = paths)

  pathSelector.getDisplayedName = (entity) => {
    if (!entity.iri)
      return

    const grapholEntity = ic.grapholscape.ontology.getEntity(entity.iri)
    return grapholEntity?.getDisplayedName(
      ic.grapholscape.entityNameType,
      ic.grapholscape.language,
    )
  }

  // pathSelector.canShowMore = true

  if (ic.grapholscape.uiContainer) {
    ic.grapholscape.uiContainer.appendChild(pathSelector)
  }

  return pathSelector
}

export function handlePathEdgeDraw(targetNode: NodeSingular, ic: IncrementalController, onComplete = (sourceNode: NodeSingular, targetNode: NodeSingular, loadingEdge: EdgeSingular) => { }) {
  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    const cy = ic.grapholscape.renderer.cy as any
    if (cy && !cy.scratch('eh')) {
      let eh = cy.edgehandles(edgeHandlesOptions)
      cy.scratch('eh', eh)
      eh.start(targetNode)
      cy.on('ehcomplete', async (evt, sourceNode: NodeSingular, targetNode: NodeSingular, addedEdge: EdgeSingular) => {
        onComplete(sourceNode, targetNode, addedEdge)
      })

      const onStop = (ev: MouseEvent) => {
        const eh = cy.scratch('eh')
        if (eh) {
          eh.stop()
          eh.destroy()
          cy.removeScratch('eh')
          cy.removeListener('ehcomplete ehstop')
        }

        document.removeEventListener('mouseup', onStop)
      }

      document.addEventListener('mouseup', (ev: MouseEvent) => onStop(ev))
    }
  }
}