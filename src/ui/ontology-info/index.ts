import GscapeOntologyInfo, { OntologyViewModel } from "./ontology-info"
import Ontology, { Annotation } from "../../model"
import { WidgetEnum } from "../util/widget-enum"

export { GscapeOntologyInfo }

/**
 * @param {import('../../grapholscape').default} grapholscape 
 */
export default function initOntologyInfo(grapholscape) {
  const ontologyInfoComponent = new GscapeOntologyInfo()
  ontologyInfoComponent.ontology = ontologyModelToViewData(grapholscape.ontology)
  grapholscape.widgets.set(WidgetEnum.ONTOLOGY_INFO, ontologyInfoComponent)
}

function ontologyModelToViewData(ontologyModelData: Ontology) {
  let ontologyViewData: OntologyViewModel = {
    name: ontologyModelData.name,
    typeOrVersion: ontologyModelData.version,
    iri: ontologyModelData.iri || '',
    namespaces: ontologyModelData.namespaces,
    annotations: ontologyModelData.annotations,
  }

  return ontologyViewData
}