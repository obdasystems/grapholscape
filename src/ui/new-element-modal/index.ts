import Grapholscape from '../../core';
import OntologyBuilder from '../../core/ontology-builder';
import { FunctionalityEnum, GrapholEntity, Iri, LifecycleEvent, Namespace, RendererStatesEnum, TypesEnum } from '../../model';
import { addChildClassIcon, addClassInstanceIcon, addDataPropertyIcon, addDiagramIcon, addEntityIcon, addISAIcon, addInputIcon, addObjectPropertyIcon, addParentClassIcon, addSubhierarchyIcon, renameIcon, rubbishBin } from '../assets';
import { GscapeButton } from '../common/button';
import GscapeContextMenu, { Command } from '../common/context-menu';
import getIconSlot from '../util/get-icon-slot';
import ontologyModelToViewData from '../util/get-ontology-view-data';
import { WidgetEnum } from "../util/widget-enum";
import GscapeNewElementModal from "./new-element-modal";
import edgeEditing from 'cytoscape-edge-editing'
import $ from "jquery";
import konva from "konva";
import cytoscape from 'cytoscape'
import DiagramBuilder from '../../core/diagram-builder';

edgeEditing(cytoscape, $, konva)
export { GscapeNewElementModal };
window['$'] = window['jQuery'] = $


export default function initDrawingElements(grapholscape: Grapholscape) {
  const commandsWidget = new GscapeContextMenu()

  const edgeHandlesDefaults = {
    canConnect: function (sourceNode: any, targetNode: any) {
      const sourceType = sourceNode.data('type')
      const targetType = targetNode.data('type')

      switch (sourceType) {

        case TypesEnum.CLASS:
          return targetType === TypesEnum.CLASS
        case TypesEnum.CLASS:
        case TypesEnum.UNION:
        case TypesEnum.DISJOINT_UNION:
          return targetType === TypesEnum.CLASS

        case TypesEnum.DATA_PROPERTY:
          return targetType === TypesEnum.DATA_PROPERTY

        default:
          return false
      }
    },
    edgeParams: function (sourceNode, targetNode) {

      let temp_id = 'temp_' + sourceNode.data('iri') + '-' + targetNode.data('iri')
      if (sourceNode.data('type') === TypesEnum.UNION || sourceNode.data('type') === TypesEnum.DISJOINT_UNION) {
        temp_id = 'temp_' + sourceNode.data('id') + '-' + targetNode.data('iri')
      }
      return {
        data: {
          id: temp_id,
          name: temp_id,
          source: sourceNode.id(),
          target: targetNode.id(),
          type: grapholscape.renderer.cy?.scratch('edge-creation-type')
        }
      }
    },
    hoverDelay: 150, // time spent hovering over a target node before it is considered selected
    snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
    snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  } as Object

  const newElementComponent = new GscapeNewElementModal()
  newElementComponent.ontology = ontologyModelToViewData(grapholscape.ontology)

  const addClassBtn = new GscapeButton()
  const classIcon = getIconSlot('icon', addEntityIcon)
  addClassBtn.appendChild(classIcon)

  addClassBtn.style.top = '90px'
  addClassBtn.style.left = '10px'
  addClassBtn.style.position = 'absolute'
  addClassBtn.title = 'Add Class'

  addClassBtn.onclick = () => {
    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Class', TypesEnum.CLASS)
  }

  const addDiagramBtn = new GscapeButton()
  const diagramIcon = getIconSlot('icon', addDiagramIcon)
  addDiagramBtn.appendChild(diagramIcon)

  addDiagramBtn.style.top = '50px'
  addDiagramBtn.style.left = '10px'
  addDiagramBtn.style.position = 'absolute'
  addDiagramBtn.title = 'Add Diagram'

  addDiagramBtn.onclick = () => {
    grapholscape.uiContainer?.appendChild(newElementComponent)
    initNewElementModal(newElementComponent, 'Add New Diagram', 'Diagram')
  }

  if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
    grapholscape.uiContainer?.appendChild(addDiagramBtn)
    grapholscape.uiContainer?.appendChild(addClassBtn)
  }

  grapholscape.on(LifecycleEvent.RendererChange, (renderer) => {
    if (renderer === RendererStatesEnum.FLOATY) {
      grapholscape.uiContainer?.appendChild(addDiagramBtn)
      grapholscape.uiContainer?.appendChild(addClassBtn)
    } else {
      addDiagramBtn.remove()
      addClassBtn.remove()
    }
  })

  grapholscape.on(LifecycleEvent.DiagramChange, () => {
    let currentCy = grapholscape.renderer.cy as any
    if (currentCy.edgeEditing('get') === undefined) {
      currentCy.edgeEditing({
        initAnchorsAutomatically: false,
        undoable: true,
        validateEdge: function (edge, newSource, newTarget) {
          const edgeType = edge.data('type')
          const sourceType = newSource.data('type')
          const targetType = newTarget.data('type')
          switch (edgeType) {
            case TypesEnum.ATTRIBUTE_EDGE:
              if (sourceType === TypesEnum.CLASS && newTarget.id() === edge.data('target')) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.INCLUSION:
              if (sourceType === targetType && (sourceType === TypesEnum.CLASS || sourceType === TypesEnum.DATA_PROPERTY)) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.OBJECT_PROPERTY:
              if (sourceType === targetType && sourceType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.UNION:
              if (sourceType === TypesEnum.UNION && targetType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.DISJOINT_UNION:
              if (sourceType === TypesEnum.DISJOINT_UNION && targetType === TypesEnum.CLASS) {
                return 'valid'
              }
              return 'invalid';
            case TypesEnum.INPUT:
              if (sourceType === TypesEnum.CLASS && (targetType === TypesEnum.DISJOINT_UNION || targetType === TypesEnum.UNION)) {
                return 'valid'
              }
              return 'invalid';
            default:
              return 'valid'
          }
        }
      })
      // avoid konvajs to put div over grapholscape's UI
      document.getElementById('cy-node-edge-editing-stage0')?.remove()
    }
    currentCy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
      if (addedEdge.data('type') === TypesEnum.OBJECT_PROPERTY) {
        grapholscape.uiContainer?.appendChild(newElementComponent)
        initNewElementModal(newElementComponent, 'Add New Object Property', TypesEnum.OBJECT_PROPERTY, sourceNode.data('iri'), targetNode.data('iri'))
      }
      currentCy.removeScratch('edge-creation-type')
    })
  })

  grapholscape.on(LifecycleEvent.DoubleTap, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY && elem.data('type') === TypesEnum.DATA_PROPERTY) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleFunctionality(elem.data('iri'))
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && !(elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleUnion(elem)
    }
    else if (grapholscape.renderState === RendererStatesEnum.FLOATY && (elem.group() === 'edges') && (elem.data('type') === TypesEnum.DISJOINT_UNION || elem.data('type') === TypesEnum.UNION)) {
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      ontologyBuilder.toggleComplete(elem)
    }
  })

  grapholscape.on(LifecycleEvent.ContextClick, (evt) => {
    const elem = evt.target
    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
      if (elem.data('type') === TypesEnum.CLASS) {
        const commands: Command[] = []

        // Logica per aggiungere comandi
        commands.push({
          content: 'Add Data Property',
          icon: addDataPropertyIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Data Property', TypesEnum.DATA_PROPERTY, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Add Object Property',
          icon: addObjectPropertyIcon,
          select: () => {
            let currentCy = grapholscape.renderer.cy as any
            let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
            edgehandles.start(elem)
            currentCy.scratch('edge-creation-type', TypesEnum.OBJECT_PROPERTY)

          }
        })

        commands.push({
          content: 'Add Parent Class',
          icon: addParentClassIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Class', TypesEnum.CLASS, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Add Child Class',
          icon: addChildClassIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Class', TypesEnum.CLASS, undefined, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Add Subclass Edge',
          icon: addISAIcon,
          select: () => {
            let currentCy = grapholscape.renderer.cy as any
            let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
            edgehandles.start(elem)
            currentCy.scratch('edge-creation-type', TypesEnum.INCLUSION)

          }
        })

        commands.push({
          content: 'Add Class Instance',
          icon: addClassInstanceIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Individual', TypesEnum.INDIVIDUAL, undefined, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Add Subhierarchy',
          icon: addSubhierarchyIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Subhierarchy', undefined, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Add Disjoint Subhierarchy',
          icon: addSubhierarchyIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            initNewElementModal(newElementComponent, 'Add New Set of SubClasses', 'Disjoint Subhierarchy', undefined, elem.data('iri'))
          }
        })

        commands.push({
          content: 'Rename',
          icon: renameIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            const entity = grapholscape.ontology.getEntity(elem.data('iri'))
            if (entity)
              initNewElementModal(newElementComponent, 'Rename Entity', elem.data('type'), elem.id(), undefined, entity)
          }
        })

        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const ontologyBuilder = new OntologyBuilder(grapholscape)
            const entity = grapholscape.ontology.getEntity(elem.data().iri)
            if (entity) {
              ontologyBuilder.removeEntity(elem, entity)
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.DATA_PROPERTY) {
        const commands: Command[] = []

        // Logica per aggiungere comandi

        commands.push({
          content: 'Add Inclusion Edge',
          icon: addISAIcon,
          select: () => {
            let currentCy = grapholscape.renderer.cy as any
            let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
            edgehandles.start(elem)
            currentCy.scratch('edge-creation-type', TypesEnum.INCLUSION)

          }
        })

        commands.push({
          content: 'Rename',
          icon: renameIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            const entity = grapholscape.ontology.getEntity(elem.data('iri'))
            if (entity)
              initNewElementModal(newElementComponent, 'Rename Entity', elem.data('type'), elem.id(), undefined, entity)
          }
        })

        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const ontologyBuilder = new OntologyBuilder(grapholscape)
            const entity = grapholscape.ontology.getEntity(elem.data().iri)
            if (entity) {
              ontologyBuilder.removeEntity(elem, entity)
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.ATTRIBUTE_EDGE) {
        const commands: Command[] = []
        commands.push({
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
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if ((elem.data('type') === TypesEnum.UNION || elem.data('type') === TypesEnum.DISJOINT_UNION)) {
        const commands: Command[] = []
        if (elem.isNode()) {

          // Logica per aggiungere comandi
          commands.push({
            content: 'Add Inclusion Edge',
            icon: addISAIcon,
            select: () => {
              let currentCy = grapholscape.renderer.cy as any
              let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
              edgehandles.start(elem)
              currentCy.scratch('edge-creation-type', elem.data('type'))

            }
          })

          commands.push({
            content: 'Add Input Edge',
            icon: addInputIcon,
            select: () => {
              let currentCy = grapholscape.renderer.cy as any
              let edgehandles = currentCy.edgehandles(edgeHandlesDefaults)
              edgehandles.start(elem)
              currentCy.scratch('edge-creation-type', TypesEnum.INPUT)

            }
          })

          commands.push({
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
          })

        }
        else {
          commands.push({
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
          })
        }

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.INPUT && (elem.connectedNodes(`[type = "${TypesEnum.UNION}"]`) || elem.connectedNodes(`[type = "${TypesEnum.DISJOINT_UNION}"]`))) {
        const commands: Command[] = []
        commands.push({
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
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.INCLUSION) {
        const commands: Command[] = []
        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const diagram = grapholscape.renderer.diagram
            if (diagram) {
              const diagramBuilder = new DiagramBuilder(diagram, RendererStatesEnum.FLOATY)
              diagramBuilder.removeElement(elem.id())
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.INSTANCE_OF) {
        const commands: Command[] = []
        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const ontologyBuilder = new OntologyBuilder(grapholscape)
            const individualNode = elem.connectedNodes(`[type = "${TypesEnum.CLASS_INSTANCE}"]`).first()
            const entity = grapholscape.ontology.getEntity(individualNode.data().iri)
            if (entity) {
              ontologyBuilder.removeEntity(individualNode, entity)
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else if (elem.data('type') === TypesEnum.OBJECT_PROPERTY) {

        const commands: Command[] = []
        commands.push({
          content: 'Rename',
          icon: renameIcon,
          select: () => {
            grapholscape.uiContainer?.appendChild(newElementComponent)
            const entity = grapholscape.ontology.getEntity(elem.data('iri'))
            if (entity)
              initNewElementModal(newElementComponent, 'Rename Entity', elem.data('type'), elem.id(), undefined, entity)
          }
        })
        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const ontologyBuilder = new OntologyBuilder(grapholscape)
            const entity = grapholscape.ontology.getEntity(elem.data().iri)
            if (entity) {
              ontologyBuilder.removeEntity(elem, entity)
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
      else {
        const commands: Command[] = []
        commands.push({
          content: 'Remove',
          icon: rubbishBin,
          select: () => {
            const ontologyBuilder = new OntologyBuilder(grapholscape)
            const entity = grapholscape.ontology.getEntity(elem.data().iri)
            if (entity) {
              ontologyBuilder.removeEntity(elem, entity)
            }
          }
        })

        try {
          const htmlNodeReference = (elem as any).popperRef()
          if (htmlNodeReference && commands.length > 0) {
            commandsWidget.attachTo(htmlNodeReference, commands)
          }
        } catch (e) { console.error(e) }
      }
    }
  })

  function initNewElementModal(newElementComponent: GscapeNewElementModal, title, entityType, sourceId?: string, targetId?: string, entity?: GrapholEntity) {

    newElementComponent.dialogTitle = title
    newElementComponent.withoutNamespace = entityType === 'Diagram' ? 'none' : 'inline'
    newElementComponent.enableMore = entityType === 'Subhierarchy' || entityType === 'Disjoint Subhierarchy' ? 'inline' : 'none'
    newElementComponent.functionalities = []
    if (entityType === TypesEnum.DATA_PROPERTY) {
      newElementComponent.functionalities.push(FunctionalityEnum.FUNCTIONAL)
    }
    else if (entityType === TypesEnum.OBJECT_PROPERTY) {
      newElementComponent.functionalities.push(FunctionalityEnum.ASYMMETRIC, FunctionalityEnum.FUNCTIONAL, FunctionalityEnum.INVERSE_FUNCTIONAL, FunctionalityEnum.IRREFLEXIVE, FunctionalityEnum.REFLEXIVE, FunctionalityEnum.SYMMETRIC, FunctionalityEnum.TRANSITIVE)
    }
    if (title === 'Rename Entity') {
      newElementComponent.entity = entity
    }
    if (title === 'Rename Entity') {
      newElementComponent.entity = entity
    }
    newElementComponent.show()

    newElementComponent.checkNamespace = (namespace) => {

      if (!grapholscape.ontology.getNamespace(namespace)) {
        const ns = new Namespace([], namespace)
        grapholscape.ontology.addNamespace(ns)
      }
    }

    newElementComponent.onConfirm = (iriString, functionalities = [], complete = false, datatype = '') => {
      newElementComponent.hide()
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (entityType === TypesEnum.CLASS) {
        if (entity && sourceId) {
          ontologyBuilder.renameEntity(entity.iri, sourceId, iriString[0])
        }
        else if (sourceId) {
          ontologyBuilder.addNodeElement(iriString[0], entityType, sourceId, "superclass")
        }
        else if (targetId) {
          ontologyBuilder.addNodeElement(iriString[0], entityType, targetId, "subclass")
        } else {
          ontologyBuilder.addNodeElement(iriString[0], entityType)
        }
      }
      else if (entityType === TypesEnum.DATA_PROPERTY) {
        if (entity && sourceId) {
          ontologyBuilder.renameEntity(entity.iri, sourceId, iriString[0])
        }
        else
          ontologyBuilder.addNodeElement(iriString[0], entityType, sourceId, undefined, functionalities, datatype)
      } else if (entityType === TypesEnum.INDIVIDUAL && targetId) {
        ontologyBuilder.addNodeElement(iriString[0], entityType, targetId)
      }
      else if (entityType === TypesEnum.OBJECT_PROPERTY && sourceId) {
        if (entity) {
          ontologyBuilder.renameEntity(entity.iri, sourceId, iriString[0])
        }
        else if (targetId) {
          grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
          ontologyBuilder.addEdgeElement(iriString[0], entityType, sourceId, targetId, TypesEnum.CLASS, functionalities)
        }

      }
      else if (entityType === 'Diagram') {
        ontologyBuilder.addDiagram(iriString[0])
      }
      else if (entityType === 'Subhierarchy' && targetId) {
        ontologyBuilder.addSubhierarchy(iriString, targetId, false, complete)
      }
      else if (entityType === 'Disjoint Subhierarchy' && targetId) {
        ontologyBuilder.addSubhierarchy(iriString, targetId, true, complete)
      }
    }

    newElementComponent.onRefactor = (iriString) => {
      newElementComponent.hide()
      const ontologyBuilder = new OntologyBuilder(grapholscape)
      if (entity && sourceId) {
        ontologyBuilder.refactorEntity(entity, sourceId, iriString[0])
      }
    }

    newElementComponent.onCancel = () => {
      newElementComponent.hide()
      if (entityType === TypesEnum.OBJECT_PROPERTY) {
        grapholscape.renderer.cy?.$id('temp_' + sourceId + '-' + targetId).remove()
      }
    }
  }

  grapholscape.widgets.set(WidgetEnum.NEW_CLASS, addClassBtn)
  grapholscape.widgets.set(WidgetEnum.NEW_DIAGRAM, addDiagramBtn)
}


