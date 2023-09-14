import Grapholscape from "../core";
import { Diagram, FunctionalityEnum, GrapholEntity, Namespace, TypesEnum } from "../../model";
import OntologyBuilder from "../ontology-builder";
import GscapeNewElementModal, { ConfirmEventDetail, ModalTypeEnum, NewDataPropertyDetail, NewDiagramDetail, NewEntityDetail, NewIsaDetail, NewObjectPropertyDetail, NewSubHierarchyDetail, RenameEntityDetail } from "./new-element-modal";

export function initNewDiagramUI(grapholscape: Grapholscape) {
  getModal(
    grapholscape,
    ModalTypeEnum.DIAGRAM,
    'Add New Diagram',
    (confirmDetail: NewDiagramDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.addDiagram(confirmDetail.diagramName)
    }
  )
}

// #####################################
// ## SINGLE ENTITIES                 ##
// #####################################

export function initNewEntityUI(grapholscape: Grapholscape, entityType: TypesEnum) {
  getModal(
    grapholscape,
    entityType,
    `Add New ${getEntityTypeInTitle(entityType)}`,
    (confirmDetail: NewEntityDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.addNodeElement(confirmDetail.iri,
        confirmDetail.type,
        undefined,
        undefined,
        [],
        '',
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

export function initNewDataPropertyUI(grapholscape: Grapholscape, ownerClassIri: string | undefined) {

  getModal(
    grapholscape,
    TypesEnum.DATA_PROPERTY,
    'Add New Data Property',
    (confirmDetail: NewDataPropertyDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)

      const functionProperties = confirmDetail.isFunctional ? [FunctionalityEnum.FUNCTIONAL] : []

      ontologyBuilder.addNodeElement(
        confirmDetail.iri,
        TypesEnum.DATA_PROPERTY,
        ownerClassIri,
        undefined,
        functionProperties,
        confirmDetail.datatype,
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

export function initNewObjectPropertyUI(grapholscape: Grapholscape, sourceClassIri: string, targetClassIri: string) {
  getModal(
    grapholscape,
    TypesEnum.OBJECT_PROPERTY,
    'Add New Object Property',
    (confirmDetail: NewObjectPropertyDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)

      ontologyBuilder.addEdgeElement(
        confirmDetail.iri,
        TypesEnum.OBJECT_PROPERTY,
        sourceClassIri,
        targetClassIri,
        TypesEnum.CLASS,
        confirmDetail.functionProperties,
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

export function initNewIndividualUI(grapholscape: Grapholscape, ownerClassIri: string | undefined) {
  getModal(
    grapholscape,
    TypesEnum.INDIVIDUAL,
    'Add New Individual',
    (confirmDetail: NewObjectPropertyDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.addNodeElement(confirmDetail.iri,
        TypesEnum.INDIVIDUAL,
        ownerClassIri,
        undefined,
        [],
        '',
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

// #####################################
// ## ISA(s)                          ##
// #####################################

export function initNewIsaUI(grapholscape: Grapholscape, sourceIri: string) {
  getModal(
    grapholscape,
    ModalTypeEnum.ISA,
    'Add New Class',
    (confirmDetail: NewIsaDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.addNodeElement(confirmDetail.iri,
        TypesEnum.CLASS,
        sourceIri,
        confirmDetail.isaDirection,
        [],
        '',
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

export function initNewSubHierarchyUI(grapholscape: Grapholscape, sourceIri: string) {

  getModal(
    grapholscape,
    ModalTypeEnum.HIERARCHY,
    'Add New Set of SubClasses',
    (confirmDetail: NewSubHierarchyDetail) => { // onConfirm
      const ontologyBuilder = new OntologyBuilder(grapholscape)

      ontologyBuilder.addSubhierarchy(
        confirmDetail.inputClassesIri,
        sourceIri,
        confirmDetail.isDisjoint,
        confirmDetail.isComplete,
        confirmDetail.deriveLabel,
        confirmDetail.convertCamel,
        confirmDetail.convertSnake,
        confirmDetail.lang)
    }
  )
}

// #####################################
// ## MISC                            ##
// #####################################

export function initRenameEntityUI(grapholscape: Grapholscape, entity: GrapholEntity, elemId: string) {
  const modal = getModal(
    grapholscape,
    ModalTypeEnum.RENAME_ENTITY,
    'Rename Entity',
    (confirmDetail: RenameEntityDetail) => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (confirmDetail.isRefactor) {
        ontologyBuilder.refactorEntity(entity, elemId, confirmDetail.newIri)
      } else {
        ontologyBuilder.renameEntity(entity.iri, elemId, confirmDetail.newIri)
      }
    }
  )

  modal.remainderToRename = entity.iri.remainder
  if (entity.iri.namespace)
    modal.selectedNamespaceIndex = modal.namespaces.indexOf(entity.iri.namespace)
}

export function initRenameDiagramUI(grapholscape: Grapholscape, diagram: Diagram | undefined) {
  const modal = getModal(
    grapholscape,
    ModalTypeEnum.DIAGRAM,
    'Rename Diagram',
    (confirmDetail: NewDiagramDetail) => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if(diagram)
        ontologyBuilder.renameDiagram(confirmDetail.diagramName)
    }
  )
  if(diagram)
    modal.diagramName = diagram.name

}

function getModal(
  grapholscape: Grapholscape,
  type: ModalTypeEnum | TypesEnum,
  title: string,
  onConfirm: (detail: ConfirmEventDetail) => void) {

  const modal = new GscapeNewElementModal(type, title)
  modal.namespaces = grapholscape.ontology.namespaces

  modal.addEventListener('confirm', (evt: CustomEvent<ConfirmEventDetail>) => {
    const ns: string = (evt.detail as any).namespace
    if (ns) {
      checkNamespace(grapholscape, ns)
    }
    onConfirm(evt.detail)
    modal.remove()
  })

  if (grapholscape.uiContainer)
    grapholscape.uiContainer.appendChild(modal)
  modal.show()

  return modal
}

function getEntityTypeInTitle(entityType: TypesEnum) {
  return (entityType.charAt(0).toUpperCase() + entityType.slice(1)).replace('-', ' ')
}

function checkNamespace(grapholscape: Grapholscape, namespace: string) {
  if (!grapholscape.ontology.getNamespace(namespace)) {
    const ns = new Namespace([], namespace)
    grapholscape.ontology.addNamespace(ns)
  }
}