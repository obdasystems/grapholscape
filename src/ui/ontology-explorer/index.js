import GscapeExplorer from "./ontology-explorer";
import init from "./controller"

export { GscapeExplorer }

const ontologyExplorerComponent = new GscapeExplorer()

export function initOntologyExplorer(grapholscape) {
  init(ontologyExplorerComponent, grapholscape)
}

export default ontologyExplorerComponent