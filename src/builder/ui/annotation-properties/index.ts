import { Grapholscape } from "../../../core"
import { Iri, Ontology } from "../../../model"
import AnnotationProperty from "../../../model/annotation-property"
import ontologyModelToViewData from "../../../ui/util/get-ontology-view-data"
import GscapeAnnotationPropertyModal from "./ann-property-modal"

export function initEditAnnPropertyModal(grapholscape: Grapholscape, ontology: Ontology, annProperty?: AnnotationProperty, onConfirm?: () => void) {
    const editPropertyModal = new GscapeAnnotationPropertyModal()
    editPropertyModal.ontology = ontologyModelToViewData(grapholscape.ontology)
    grapholscape.uiContainer?.appendChild(editPropertyModal)
    editPropertyModal.annProperty = annProperty
    editPropertyModal.onConfirm = (oldProperty, newProperty) => {
        if(oldProperty){
            if(oldProperty.toString() != newProperty){

                ontology.annProperties = ontology.annProperties.filter(p => !p.equals(oldProperty))
                const property = ontology.getAnnotationProperty(newProperty)
                if(!property){
                    const newProp = new AnnotationProperty(newProperty, ontology.namespaces)
                    ontology.addAnnotationProperty(newProp)
                }
            }
        } else {
            const property = ontology.getAnnotationProperty(newProperty)
            if(!property){
                const newProp = new AnnotationProperty(newProperty, ontology.namespaces)
                ontology.addAnnotationProperty(newProp)
            }
        }

        if (onConfirm) {
            onConfirm()
        }
    }
    editPropertyModal.show()

    return editPropertyModal
}