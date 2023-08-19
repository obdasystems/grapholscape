import Grapholscape from '../../core'
import { GrapholEntity, TypesEnum, Ontology, Annotation, Iri } from '../../../model'
import ontologyModelToViewData from '../../../ui/util/get-ontology-view-data'
import GscapeAnnotationModal from './annotation-modal'
import GscapeAnnotationsModal from './annotations-modal'

export { GscapeAnnotationModal }
export { GscapeAnnotationsModal }
export * from './annotations-template'

// #####################################
// ## INIT ANNOTATION MODALS          ##
// #####################################

export function initAnnotationsModal(grapholscape: Grapholscape, entity: GrapholEntity, entityType: TypesEnum) {
  const modal = new GscapeAnnotationsModal()
  grapholscape.uiContainer?.appendChild(modal)
  modal.dialogTitle = entity.iri.remainder
  modal.entityType = entityType
  modal.annotations = entity.getAnnotations()
  modal.show()

  modal.onEditAnnotation = (annotation) => {
    modal.hide()
    const editAnnotationModal = initEditAnnotationModal(
      grapholscape,
      entity,
      annotation,
      () => {
        modal.annotations = entity.getAnnotations()
        modal.show()
      }
    )

    editAnnotationModal.onCancel = () => modal.show()
  }

  modal.onDeleteAnnotation = (annotation) => {
    entity.removeAnnotation(annotation)
    modal.annotations = entity.getAnnotations()
  }
}

/**
 * Build the modal with the editing form for an AnnotatedElement
 * (i.e. entities or ontology).
 * On confirm add/replace the annotation on the annotatedElement and invoke
 * the onConfirm callbacks, used by other components to react to this
 * modal being removed.
 * @param grapholscape for uiContainer and ontology
 * @param annotatedElement the element owning the annotation to edit/add
 * @param annotation [optional] the annotation to edit, if undefined new annotation will be added 
 * @param onConfirm [optional] do something when the editing is completed
 * @returns GscapeAnnotationModal
 */
export function initEditAnnotationModal(grapholscape: Grapholscape, annotatedElement: GrapholEntity | Ontology, annotation?: Annotation, onConfirm?: () => void) {
  const editAnnotationModal = new GscapeAnnotationModal()
  editAnnotationModal.ontology = ontologyModelToViewData(grapholscape.ontology)
  grapholscape.uiContainer?.appendChild(editAnnotationModal)
  editAnnotationModal.annotation = annotation
  editAnnotationModal.onConfirm = (oldAnnotation, property, lexicalForm, datatype, language) => {
    const propertyIri = new Iri(property, grapholscape.ontology.namespaces)
    const newAnnotation = new Annotation(propertyIri, lexicalForm, language, datatype)
    if (oldAnnotation && !oldAnnotation.equals(newAnnotation)) {
      annotatedElement.removeAnnotation(oldAnnotation)
    }
    annotatedElement.addAnnotation(newAnnotation)

    if (onConfirm) {
      onConfirm()
    }
  }
  editAnnotationModal.show()

  return editAnnotationModal
}