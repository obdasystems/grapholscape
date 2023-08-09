import { EdgeSingular, NodeSingular } from "cytoscape";
import { Grapholscape } from "../../core";
import DiagramBuilder from "../../core/diagram-builder";
import OntologyBuilder from "../../core/ontology-builder";
import { Annotation, GrapholEntity, Iri, RendererStatesEnum, TypesEnum } from "../../model";
import { addClassInstanceIcon, addDataPropertyIcon, addInputIcon, addISAIcon, addObjectPropertyIcon, addSubhierarchyIcon, editIcon, renameIcon, rubbishBin } from "../assets";
import { Command } from "../common/context-menu";
import ontologyModelToViewData from "../util/get-ontology-view-data";
import GscapeAnnotationModal from "./annotation-modal";
import GscapeAnnotationsModal from "./annotations-modal";
import edgeHandlesDefaults from "./edge-handles-defaults";
import { initNewDataPropertyUI, initNewIndividualUI, initNewIsaUI, initNewSubHierarchyUI, initRenameEntityUI } from "./init-modals";

/**
 * Get a map storing for each element type (TypesEnum) an array of Command[].
 * Entities have common commands, their key in the map is 'Entity'.
 * The commands are actually functions taking grapholscape instance and the
 * selected elem, that are the two info needed by any command for builder.
 * @returns a Map of functions yielding a command by element's type
 */
export function getCommandsByType() {
  const commandsMap = new Map<string | TypesEnum, ((grapholscape: Grapholscape, elem: any) => Command)[]>()

  commandsMap.set('Entity', [
    rename,
    editAnnotations,
    removeEntity
  ])

  commandsMap.set(TypesEnum.CLASS, [
    addDataProperty,
    addObjectProperty,
    addIndividual,
    addISA,
    addSubhierarchy,
    addSubclassEdge,
  ])

  commandsMap.set(TypesEnum.DATA_PROPERTY, [addInclusionEdge])

  commandsMap.set(TypesEnum.INDIVIDUAL, [])

  commandsMap.set(TypesEnum.INCLUSION, [removeElement])

  commandsMap.set(TypesEnum.INSTANCE_OF, [removeElement])

  commandsMap.set(TypesEnum.ATTRIBUTE_EDGE, [removeAttributeEdge])

  return commandsMap
}

export const addDataProperty = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Data Property',
    icon: addDataPropertyIcon,
    select: () => {
      initNewDataPropertyUI(grapholscape, elem.data().iri)
    }
  }
}

export const addObjectProperty = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Object Property',
    icon: addObjectPropertyIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      let edgehandles = currentCy.edgehandles(edgeHandlesDefaults(TypesEnum.OBJECT_PROPERTY))
      edgehandles.start(elem)
      currentCy.scratch('edge-creation-type', TypesEnum.OBJECT_PROPERTY)
    }
  }
}

export const addISA = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Class in IS-A',
    icon: addISAIcon,
    select: () => {
      initNewIsaUI(grapholscape, elem.data().iri)
    }
  }
}

export const addSubclassEdge = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Subclass Edge',
    icon: addISAIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      let edgehandles = currentCy.edgehandles(edgeHandlesDefaults(TypesEnum.INCLUSION))
      edgehandles.start(elem)
      currentCy.scratch('edge-creation-type', TypesEnum.INCLUSION)
    }
  }
}

export const addIndividual = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Individual',
    icon: addClassInstanceIcon,
    select: () => {
      initNewIndividualUI(grapholscape, elem.data().iri)
    }
  }
}

export const addSubhierarchy = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Subhierarchy',
    icon: addSubhierarchyIcon,
    select: () => {
      initNewSubHierarchyUI(grapholscape, elem.data().iri)
    }
  }
}

export const rename = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Rename',
    icon: renameIcon,
    select: () => {
      const entity = grapholscape.ontology.getEntity(elem.data('iri'))
      if (entity) {
        initRenameEntityUI(grapholscape, entity, elem.id())
      }
    }
  }
}

export const editAnnotations = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Edit Annotations',
    icon: editIcon,
    select: () => {
      const annotationsModal = new GscapeAnnotationsModal()
      grapholscape.uiContainer?.appendChild(annotationsModal)
      const entity = grapholscape.ontology.getEntity(elem.data('iri'))
      const annotations = entity?.getAnnotations()
      if (entity)
        initAnnotationsModal(grapholscape, annotationsModal, entity, elem.data('type'))
    }
  }
}

export const removeEntity = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const entity = grapholscape.ontology.getEntity(elem.data().iri)
      if (entity) {
        ontologyBuilder.removeEntity(elem, entity)
      }
    }
  }
}

export const removeAttributeEdge = (grapholscape: Grapholscape, elem: EdgeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const dpNode = elem.target()
      const entity = grapholscape.ontology.getEntity(dpNode.data().iri)
      if (entity) {
        ontologyBuilder.removeEntity(dpNode, entity)
      }
    }
  }
}

export const removeElement = (grapholscape: Grapholscape, elem: NodeSingular | EdgeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const diagram = grapholscape.renderer.diagram
      if (diagram) {
        const diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        diagramBuilder.removeElement(elem.id())
      }
    }
  }
}

export const removeHierarchyByNode = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (elem.edges().nonempty()) {
        elem.edgesWith(`[ type = "${TypesEnum.CLASS}" ]`).forEach(e => {
          const classNode = e.connectedNodes(`[ type = "${TypesEnum.CLASS}" ]`).first()
          let hierarchy = grapholscape.ontology.hierarchiesBySuperclassMap.get(classNode.data('iri'))?.find(h => h.id === `${elem.data('hierarchyID')}`)
          if (hierarchy) {
            ontologyBuilder.removeHierarchy(hierarchy)
          }
          else {
            hierarchy = grapholscape.ontology.hierarchiesBySubclassMap.get(classNode.data('iri'))?.find(h => h.id === `${elem.data('hierarchyID')}`)
            if (hierarchy) {
              ontologyBuilder.removeHierarchy(hierarchy)
            }
          }
        })
      }
      else {
        const diagram = grapholscape.renderer.diagram
        if (diagram) {
          const diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
          diagramBuilder.removeElement(elem.id())
        }
      }
    }
  }
}

export const removeHierarchySuperClassEdge = (grapholscape: Grapholscape, elem: EdgeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const hierarchyID = elem.connectedNodes(`[type = "${elem.data('type')}"]`).first().data('hierarchyID')
      const superclassIri = elem.target().data('iri')
      const hierarchy = grapholscape.ontology.hierarchiesBySuperclassMap.get(superclassIri)?.find(h => h.id === hierarchyID)
      if (hierarchy)
        ontologyBuilder.removeHierarchySuperclass(hierarchy, superclassIri)
    }
  }
}

export const removeHierarchyInputEdge = (grapholscape: Grapholscape, elem: EdgeSingular) => {
  return {
    content: 'Remove',
    icon: rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const hierarchyID = elem.connectedNodes(`[type $= "${TypesEnum.UNION}"]`).first().data('hierarchyID')
      const inputclassIri = elem.connectedNodes(`[type = "${TypesEnum.CLASS}"]`).first().data('iri')
      const hierarchy = grapholscape.ontology.hierarchiesBySubclassMap.get(inputclassIri)?.find(h => h.id === hierarchyID)
      if (hierarchy)
        ontologyBuilder.removeHierarchyInput(hierarchy, inputclassIri)
    }
  }
}

export const addInputEdge = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Input Edge',
    icon: addInputIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      let edgehandles = currentCy.edgehandles(edgeHandlesDefaults(TypesEnum.INPUT))
      edgehandles.start(elem)
      currentCy.scratch('edge-creation-type', TypesEnum.INPUT)
    }
  }
}

export const addInclusionEdge = (grapholscape: Grapholscape, elem: NodeSingular) => {
  return {
    content: 'Add Inclusion Edge',
    icon: addISAIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      let edgehandles = currentCy.edgehandles(edgeHandlesDefaults(TypesEnum.INCLUSION))
      edgehandles.start(elem)
      currentCy.scratch('edge-creation-type', TypesEnum.INCLUSION)

    }
  }
}


// TODO: Refactor somewhere else
function initAnnotationsModal(grapholscape: Grapholscape, modal: GscapeAnnotationsModal, entity: GrapholEntity, entityType: TypesEnum) {
  modal.dialogTitle = entity.iri.remainder
  modal.entityType = entityType
  modal.annotations = entity.getAnnotations()
  modal.show()

  const editAnnotationModal = new GscapeAnnotationModal()
  editAnnotationModal.ontology = ontologyModelToViewData(grapholscape.ontology)

  modal.initEditAnnotation = (annotation) => {
    modal.hide()
    grapholscape.uiContainer?.appendChild(editAnnotationModal)
    editAnnotationModal.annotation = annotation
    editAnnotationModal.show()

    editAnnotationModal.onConfirm = (oldAnnotation, property, lexicalForm, datatype, language) => {
      editAnnotationModal.hide()
      const propertyIri = new Iri(property, grapholscape.ontology.namespaces)
      const newAnnotation = new Annotation(propertyIri, lexicalForm, language, datatype)
      if (oldAnnotation && !oldAnnotation.equals(newAnnotation)) {
        entity.removeAnnotation(oldAnnotation)
      }
      entity.addAnnotation(newAnnotation)
      modal.annotations = entity.getAnnotations()
      modal.show()
    }

    editAnnotationModal.onCancel = () => {
      editAnnotationModal.hide()
      modal.show()
    }
  }

  modal.deleteAnnotation = (annotation) => {
    entity.removeAnnotation(annotation)
    modal.annotations = entity.getAnnotations()
  }
  modal.onCancel = () => {
    modal.hide()
  }
}