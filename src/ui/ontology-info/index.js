import GscapeOntologyInfo from "./ontology-info"
import { ontologyModelToViewData } from "../../util/model-obj-transformations"

export { GscapeOntologyInfo }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initOntologyInfo(grapholscape) {
  const ontologyInfoComponent = new GscapeOntologyInfo()
  ontologyInfoComponent.ontology = ontologyModelToViewData(grapholscape.ontology)
  grapholscape.widgets.ONTOLOGY_INFO = ontologyInfoComponent
}