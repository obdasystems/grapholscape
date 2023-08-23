import { EdgeSingular, NodeSingular } from "cytoscape";
import Grapholscape from "../core";
import DiagramBuilder from "../../core/diagram-builder";
import { RendererStatesEnum, TypesEnum } from "../../model";
import * as UI from '../../ui';
import drawNewEdge from "../edge-creation/draw-new-edge";
import OntologyBuilder from "../ontology-builder";
import { initAnnotationsModal } from "./annotations";
import { initNewDataPropertyUI, initNewIndividualUI, initNewIsaUI, initNewObjectPropertyUI, initNewSubHierarchyUI, initRenameEntityUI } from "./init-modals";

const {
  icons,
} = UI

/**
 * Get a map storing for each element type (TypesEnum) an array of Command[].
 * Entities have common commands, their key in the map is 'Entity'.
 * The commands are actually functions taking grapholscape instance and the
 * selected elem, that are the two info needed by any command for builder.
 * @returns a Map of functions yielding a command by element's type
 */
export function getCommandsByType() {
  const commandsMap = new Map<string | TypesEnum, ((grapholscape: Grapholscape, elem: any) => UI.Command)[]>()

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

export const addDataProperty = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Data Property',
    icon: icons.addDataPropertyIcon,
    select: () => {
      initNewDataPropertyUI(grapholscape, elem.data().iri)
    }
  }
}

export const addObjectProperty = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Object Property',
    icon: icons.addObjectPropertyIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      drawNewEdge(
        currentCy,
        TypesEnum.OBJECT_PROPERTY,
        elem,
        grapholscape.theme,
        (_, sourceNode, targetNode, addedEdge) => { // ehcomplete
          addedEdge.remove()
          initNewObjectPropertyUI(grapholscape, sourceNode.data().iri, targetNode.data().iri)
      })
    }
  }
}

export const addISA = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Class in IS-A',
    icon: icons.addClassIcon,
    select: () => {
      initNewIsaUI(grapholscape, elem.data().iri)
    }
  }
}

export const addSubclassEdge = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Subclass Edge',
    icon: icons.addISAIcon,
    select: () => {
      
      let currentCy = grapholscape.renderer.cy as any
      drawNewEdge(currentCy, TypesEnum.INCLUSION, elem, grapholscape.theme, (_, sourceNode, targetNode, addedEdge) => {
        addedEdge.remove()
        if (grapholscape.renderer.diagram) {
          const diagramBuilder = new DiagramBuilder(grapholscape.renderer.diagram, RendererStatesEnum.FLOATY)
          diagramBuilder.addEdge(sourceNode.id(), targetNode.id(), TypesEnum.INCLUSION)
        }
      })
    }
  }
}

export const addIndividual = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Individual',
    icon: icons.addIndividualIcon,
    select: () => {
      initNewIndividualUI(grapholscape, elem.data().iri)
    }
  }
}

export const addSubhierarchy = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Subhierarchy',
    icon: icons.addSubhierarchyIcon,
    select: () => {
      initNewSubHierarchyUI(grapholscape, elem.data().iri)
    }
  }
}

export const rename = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Rename',
    icon: icons.renameIcon,
    select: () => {
      const entity = grapholscape.ontology.getEntity(elem.data('iri'))
      if (entity) {
        initRenameEntityUI(grapholscape, entity, elem.id())
      }
    }
  }
}

export const editAnnotations = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Edit Annotations',
    icon: icons.editIcon,
    select: () => {      
      const entity = grapholscape.ontology.getEntity(elem.data('iri'))
      if (entity)
        initAnnotationsModal(grapholscape, entity, elem.data('type'))
    }
  }
}

export const removeEntity = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const entity = grapholscape.ontology.getEntity(elem.data().iri)
      if (entity) {
        ontologyBuilder.removeEntity(elem, entity)
      }
    }
  }
}

export const removeAttributeEdge = (grapholscape: Grapholscape, elem: EdgeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
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

export const removeElement = (grapholscape: Grapholscape, elem: NodeSingular | EdgeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
    select: () => {
      const diagram = grapholscape.renderer.diagram
      if (diagram) {
        const diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
        diagramBuilder.removeElement(elem.id())
      }
    }
  }
}

export const removeHierarchyByNode = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (elem.edges().nonempty()) {
        const hierarchy = grapholscape.ontology.getHierarchy(elem.id())
        if (hierarchy) {
          ontologyBuilder.removeHierarchy(hierarchy)
        }
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

export const addHierarchySuperClassEdge = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Inclusion Edge',
    icon: icons.addISAIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      let edgeType = elem.data().type
      if (elem.data().hierarchyForcedComplete) {
        if (elem.data().type === TypesEnum.UNION) {
          edgeType = TypesEnum.COMPLETE_UNION
        } else {
          edgeType = TypesEnum.COMPLETE_DISJOINT_UNION
        }
      }

      drawNewEdge(currentCy, edgeType, elem, grapholscape.theme, (_, sourceNode, targetNode, addedEdge) => {
        addedEdge.remove()
        if (grapholscape.renderer.diagram) {
          const diagramBuilder = new DiagramBuilder(grapholscape.renderer.diagram, RendererStatesEnum.FLOATY)
          diagramBuilder.addEdge(sourceNode.id(), targetNode.id(), edgeType)
        }
      })
    }
  }
}

export const removeHierarchySuperClassEdge = (grapholscape: Grapholscape, elem: EdgeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const hierarchyID = elem.connectedNodes(`[type = "${elem.data('type')}"]`).first().data('hierarchyID')
      const superclassIri = elem.target().data('iri')
      const hierarchy = grapholscape.ontology.getHierarchy(hierarchyID)
      if (hierarchy)
        ontologyBuilder.removeHierarchySuperclass(hierarchy, superclassIri)
    }
  }
}

export const removeHierarchyInputEdge = (grapholscape: Grapholscape, elem: EdgeSingular): UI.Command => {
  return {
    content: 'Remove',
    icon: icons.rubbishBin,
    select: () => {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      const hierarchyID = elem.connectedNodes(`[type $= "${TypesEnum.UNION}"]`).first().data('hierarchyID')
      const inputclassIri = elem.connectedNodes(`[type = "${TypesEnum.CLASS}"]`).first().data('iri')
      const hierarchy = grapholscape.ontology.getHierarchy(hierarchyID)
      if (hierarchy)
        ontologyBuilder.removeHierarchyInput(hierarchy, inputclassIri)
    }
  }
}

export const addInputEdge = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Input Edge',
    icon: icons.addInputIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      drawNewEdge(
        currentCy,
        TypesEnum.INPUT,
        elem,
        grapholscape.theme,
        (_, sourceNode, targetNode, addedEdge) => {
          addedEdge.remove()
          if (grapholscape.renderer.diagram) {
            const diagramBuilder = new DiagramBuilder(grapholscape.renderer.diagram, RendererStatesEnum.FLOATY)
            diagramBuilder.addEdge(sourceNode.id(), targetNode.id(), TypesEnum.INPUT)
          }
        },
        true // input edges must go towards input node, but we draw them in opposite direction
      )
    }
  }
}

export const addInclusionEdge = (grapholscape: Grapholscape, elem: NodeSingular): UI.Command => {
  return {
    content: 'Add Inclusion Edge',
    icon: icons.addISAIcon,
    select: () => {
      let currentCy = grapholscape.renderer.cy as any
      drawNewEdge(currentCy, TypesEnum.INCLUSION, elem, grapholscape.theme, (_, sourceNode, targetNode, addedEdge) => {
        addedEdge.remove()
        if (grapholscape.renderer.diagram) {
          const diagramBuilder = new DiagramBuilder(grapholscape.renderer.diagram, RendererStatesEnum.FLOATY)
          diagramBuilder.addEdge(sourceNode.id(), targetNode.id(), TypesEnum.INCLUSION)
        }
      })
    }
  }
}