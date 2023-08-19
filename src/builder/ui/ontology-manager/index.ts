import { Grapholscape } from "../../../core";
import { initEditAnnotationModal } from "../annotations";
import OntologyManager from "./ontology-manager";

export function initOntologyManagerModal(grapholscape: Grapholscape) {
  const ontologyManager = new OntologyManager(
    grapholscape.ontology.getAnnotations(),
    grapholscape.ontology.namespaces,
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
    ontologyManager.annotations = this.grapholscape.ontology.getAnnotations()
  }

  grapholscape.uiContainer?.appendChild(ontologyManager)
  ontologyManager.show()
}