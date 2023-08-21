import { Grapholscape } from "../../../core"
import { Namespace, Ontology } from "../../../model"
import ontologyModelToViewData from "../../../ui/util/get-ontology-view-data"
import GscapeNamespaceModal from "./namespace-modal"

export function initEditNamespaceModal(grapholscape: Grapholscape, ontology: Ontology, namespace?: Namespace, prefix?: string, onConfirm?: () => void) {
    const editNamespaceModal = new GscapeNamespaceModal()
    editNamespaceModal.ontology = ontologyModelToViewData(grapholscape.ontology)
    grapholscape.uiContainer?.appendChild(editNamespaceModal)
    editNamespaceModal.namespace = namespace
    editNamespaceModal.prefixx = prefix
    editNamespaceModal.onConfirm = (oldNamespace, oldPrefix, newnamespace, newprefix) => {
        if(oldNamespace){
            if(oldNamespace.toString() === newnamespace){
                oldNamespace.prefixes = oldNamespace.prefixes.filter(p => p!=oldPrefix)
                oldNamespace.addPrefix(newprefix)
            }
            else{
                oldNamespace.prefixes = oldNamespace.prefixes.filter(p => p!=oldPrefix)
                if(oldNamespace.prefixes.length === 0) {
                    grapholscape.ontology.namespaces = grapholscape.ontology.namespaces.filter(n => n.value != oldNamespace.value)
                }
                const namespace = ontology.getNamespace(newnamespace)
                if(namespace){
                    namespace.addPrefix(newprefix)
                } else{
                    const newNamespace = new Namespace([newprefix], newnamespace)
                    ontology.addNamespace(newNamespace)
                }
            }
        } else {
            const namespace = ontology.getNamespace(newnamespace)
            if(namespace){
                namespace.addPrefix(newprefix)
            } else{
                const newNamespace = new Namespace([newprefix], newnamespace)
                ontology.addNamespace(newNamespace)
            }
        }

        if (onConfirm) {
            onConfirm()
        }
    }
    editNamespaceModal.show()

    return editNamespaceModal
}