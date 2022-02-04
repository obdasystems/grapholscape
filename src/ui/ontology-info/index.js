import GscapeOntologyInfo from "./ontology-info"
import { ontologyModelToViewData } from "../../util/model-obj-transformations"

export default GscapeOntologyInfo

export const ontologyInfo = (ontology) => 
  new GscapeOntologyInfo(ontologyModelToViewData(ontology))
