import GscapeOntologyInfo from "./ontology-info"
import { ontologyModelToViewData } from "../../util/model-obj-transformations"

export { GscapeOntologyInfo }

const ontologyInfoComponent = new GscapeOntologyInfo()

export function initOntologyInfo(ontology) {
  ontologyInfoComponent.ontology = ontologyModelToViewData(ontology)
}

export default ontologyInfoComponent  
