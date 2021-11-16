import GscapeExplorer from "./ontology-explorer";
import init from "./controller"

export default GscapeExplorer

export const ontologyExplorerComponent = new GscapeExplorer()

export const ontologyExplorer = (grapholscape) => {
  init(ontologyExplorerComponent, grapholscape)
  return ontologyExplorerComponent
}