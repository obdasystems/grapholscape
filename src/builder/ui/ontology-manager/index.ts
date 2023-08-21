import Grapholscape from "../../core";
import { initEditAnnotationModal } from "../annotations";
import { initEditNamespaceModal } from "../namespaces";
import OntologyManager from "./ontology-manager";

export function initOntologyManagerModal(grapholscape: Grapholscape) {
  const ontologyManager = new OntologyManager(
    grapholscape.ontology.getAnnotations(),
    grapholscape.ontology.getNamespaces(),
  )

  ontologyManager.onEditAnnotation = (annotation) => {
    ontologyManager.hide()
    const editAnnotationModal = initEditAnnotationModal(
      grapholscape,
      grapholscape.ontology,
      annotation,
      () => {
        ontologyManager.annotations = grapholscape.ontology.getAnnotations()
        ontologyManager.show()
      }
    )

    editAnnotationModal.onCancel = () => {
      ontologyManager.show()
    }
  }

  ontologyManager.onDeleteAnnotation = (annotation) => {
    grapholscape.ontology.removeAnnotation(annotation)
    ontologyManager.annotations = grapholscape.ontology.getAnnotations()
  }

  ontologyManager.onEditNamespace = (namespace, prefix) => {
    ontologyManager.hide()
    const editNamespaceModal = initEditNamespaceModal(
      grapholscape,
      grapholscape.ontology,
      namespace,
      prefix,
      () => {
        ontologyManager.namespaces = grapholscape.ontology.getNamespaces()
        ontologyManager.requestUpdate();
        ontologyManager.show()
      }
    )

    editNamespaceModal.onCancel = () => {
      ontologyManager.show()
    }
  }

  ontologyManager.onDeleteNamespace = (namespace, prefix) => {
    const oldNamespace = grapholscape.ontology.getNamespace(namespace.value)
    if(oldNamespace){
      oldNamespace.prefixes = oldNamespace.prefixes.filter(p => p!= prefix)
      if(oldNamespace.prefixes.length === 0) {
        grapholscape.ontology.namespaces = grapholscape.ontology.namespaces.filter(n => n.value != namespace.value)
      }
    }
    ontologyManager.namespaces = grapholscape.ontology.getNamespaces()
  }

  grapholscape.uiContainer?.appendChild(ontologyManager)
  ontologyManager.show()
}