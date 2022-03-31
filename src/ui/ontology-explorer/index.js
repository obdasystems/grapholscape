import GscapeExplorer from "./ontology-explorer";
import init from "./controller"

export { GscapeExplorer }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initOntologyExplorer(grapholscape) {
  const ontologyExplorerComponent = new GscapeExplorer()
  init(ontologyExplorerComponent, grapholscape)
  grapholscape.widgets.ONTOLOGY_EXPLORER = ontologyExplorerComponent
}