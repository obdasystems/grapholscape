import { Ontology } from "../../model"
import { OntologyViewModel } from "../ontology-info/ontology-info"

export default function ontologyModelToViewData(ontologyModelData: Ontology) {
    let ontologyViewData: OntologyViewModel = {
        name: ontologyModelData.name,
        typeOrVersion: ontologyModelData.version,
        iri: ontologyModelData.iri || '',
        namespaces: ontologyModelData.namespaces,
        annotations: ontologyModelData.annotations,
    }

    return ontologyViewData
}