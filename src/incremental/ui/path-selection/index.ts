import { EdgeSingular, NodeSingular } from "cytoscape";
import { RendererStatesEnum } from "../../../model";
import IncrementalCore from "../../old-controller";
import { edgeHandlesOptions } from "../../edge-handles-options";
import { showMessage, PathSelector } from "../../../ui";

export async function pathSelectionInit(
  ic: IncrementalCore,
  sourceIri: string,
  targetIri: string) {

  const paths = await ic.endpointController?.highlightsManager?.getShortestKPaths(
    sourceIri,
    targetIri
  )

  if (paths && paths.length > 0) {
    const pathSelector = new PathSelector(ic.grapholscape.theme)
    pathSelector.paths = paths

    pathSelector.getDisplayedName = (entity) => {
      if (!entity.iri)
        return
  
      const grapholEntity = ic.grapholscape.ontology.getEntity(entity.iri)
      return grapholEntity?.getDisplayedName(
        ic.grapholscape.entityNameType,
        ic.grapholscape.language,
      )
    }
  
    if (ic.grapholscape.uiContainer) {
      ic.grapholscape.uiContainer.appendChild(pathSelector)
    }
  
    return pathSelector

  } else if ((paths as any).type === 'error') {
    showMessage((paths as any).message, 'Warning', ic.grapholscape.uiContainer, 'warning')
  } else {
    showMessage('Can\'t find any path between selected classes', 'Info', ic.grapholscape.uiContainer)
  }
}

export function handlePathEdgeDraw(targetNode: NodeSingular, ic: IncrementalCore, onComplete = (sourceNode: NodeSingular, targetNode: NodeSingular, loadingEdge: EdgeSingular) => { }) {
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