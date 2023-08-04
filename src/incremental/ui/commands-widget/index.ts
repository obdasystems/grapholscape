import { NodeSingular } from "cytoscape";
import { ClassInstanceEntity, GrapholNode, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../../model";
import { classIcon, counter, pathIcon, sankey } from "../../../ui/assets";
import GscapeContextMenu, { Command } from "../../../ui/common/context-menu";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import { hideButtons } from "../node-buttons.ts";
import { handlePathEdgeDraw, pathSelectionInit } from "../path-selection";
import GscapePathSelector, { PathSelectionEvent } from "../path-selection/path-selector";
import * as IncrementalCommands from "./commands";

export function CommandsWidgetFactory(ic: IncrementalController) {
  const commandsWidget = new GscapeContextMenu()

  ic.grapholscape.on(LifecycleEvent.ContextClick, event => {
    const commands: Command[] = []

    if (
      event.target === ic.grapholscape.renderer.cy ||
      !event.target.data().iri ||
      ic.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL
    )
      return

    const entity = ic.classInstanceEntities.get(event.target.data().iri) || ic.grapholscape.ontology.getEntity(event.target.data().iri)
    const grapholElement = ic.diagram.representation?.grapholElements.get(event.target.id())
    if (!entity || !grapholElement) return

    hideButtons(event.target)

    if (grapholElement.is(TypesEnum.OBJECT_PROPERTY) &&
      event.target.source().data().type === TypesEnum.CLASS_INSTANCE &&
      event.target.target().data().type === TypesEnum.CLASS_INSTANCE) {
      commands.push({
        content: 'Show Instance Types',
        icon: classIcon,
        select: () => {
          ic.showObjectPropertyTypes(
            entity.iri.fullIri,
            event.target.source().id(),
            event.target.target().id(),
          )
        },
      })
    }

    if (
      grapholElement.is(TypesEnum.CLASS) ||
      grapholElement.is(TypesEnum.CLASS_INSTANCE)
    ) {
      commands.push({
        content: 'Find paths to',
        icon: pathIcon,
        select: () => {
          const onComplete = (sourceNode: NodeSingular, targetNode: NodeSingular) => {
            let pathSelector: GscapePathSelector | undefined
            let sourceIriForPath = sourceNode.data('iri')
            let targetIriForpath = targetNode.data('iri')
            // let pathSelector: GscapePathSelector | undefined
            if (sourceNode.data().type === TypesEnum.CLASS && sourceNode.data().type === targetNode.data().type) {
              if (sourceIriForPath && targetIriForpath) {
                pathSelector = pathSelectionInit(ic, sourceIriForPath, targetIriForpath)

                pathSelector.addEventListener('path-selection', async (evt: PathSelectionEvent) => {
                  if (evt.detail.entities)
                    ic.addPath(evt.detail.entities)
                })
              }
            } else {
              let entity: ClassInstanceEntity | undefined
              // Take parentClass IRI to find a path to the other node in the intensional level
              if (sourceNode.data().type === TypesEnum.CLASS_INSTANCE) {
                entity = ic.classInstanceEntities.get(sourceNode.data('iri'))

                if (entity) {
                  sourceIriForPath = entity.parentClassIris[0].fullIri
                }
              }

              if (targetNode.data().type === TypesEnum.CLASS_INSTANCE) {
                entity = ic.classInstanceEntities.get(targetNode.data('iri'))

                if (entity) {
                  targetIriForpath = entity.parentClassIris[0].fullIri
                }
              }

              if (sourceIriForPath && targetIriForpath) {
                pathSelector = pathSelectionInit(ic, sourceIriForPath, targetIriForpath)

                pathSelector.addEventListener('path-selection', async (evt: PathSelectionEvent) => {
                  ic.addInstancesPath(sourceNode.data().iri, targetNode.data().iri, evt.detail)
                })
              }
            }

            if (pathSelector) {
              pathSelector.show()
            }
          }

          handlePathEdgeDraw(event.target, ic, onComplete)
        }
      })
    }

    if (grapholElement.is(TypesEnum.CLASS_INSTANCE)) {

      commands.push(IncrementalCommands.focusInstance(() => ic.expandObjectPropertiesOnInstance(entity.iri.fullIri)))

      commands.push(IncrementalCommands.performInstanceChecking(async () => {
        const allClassesIris = ic
          .grapholscape
          .ontology
          .getEntitiesByType(TypesEnum.CLASS)
          .map(e => e.iri.fullIri)

        const instanceCheckingClasses = await ic
          .endpointController
          ?.instanceCheck(entity.iri.fullIri, allClassesIris)

        instanceCheckingClasses?.forEach(classIri => {
          const classEntity = ic.grapholscape.ontology.getEntity(classIri);
          if (classEntity) {
            (entity as ClassInstanceEntity).addParentClass(classEntity.iri)
          }
        })

        showParentClass(ic, entity as ClassInstanceEntity)
      }))

      if (!(entity as ClassInstanceEntity).isRDFTypeUnknown) {
        commands.push(IncrementalCommands.showParentClass(() => showParentClass(ic, entity as ClassInstanceEntity)))
      }
    }

    const classIri = entity.iri.fullIri

    if (grapholElement.is(TypesEnum.CLASS)) {
      const superHierarchies = ic.grapholscape.ontology.hierarchiesBySubclassMap.get(classIri)
      const subHierarchies = ic.grapholscape.ontology.hierarchiesBySuperclassMap.get(classIri)

      if (superHierarchies && superHierarchies.length > 0) {
        const areAllSuperHierarchiesVisible = ic.areHierarchiesVisible(superHierarchies)

        commands.push(IncrementalCommands.showHideSuperHierarchies(
          areAllSuperHierarchiesVisible,
          () => {
            areAllSuperHierarchiesVisible ? ic.hideSuperHierarchiesOf(classIri) : ic.showSuperHierarchiesOf(classIri)
          }
        ))
      }

      if (subHierarchies && subHierarchies.length > 0) {
        const areAllSubHierarchiesVisible = ic.areHierarchiesVisible(subHierarchies)

        commands.push(
          IncrementalCommands.showHideSubHierarchies(
            areAllSubHierarchiesVisible,
            () => {
              areAllSubHierarchiesVisible ? ic.hideSubHierarchiesOf(classIri) : ic.showSubHierarchiesOf(classIri)
            }
          ),
        )
      }

      const subClasses = ic.neighbourhoodFinder.getSubclassesIris(classIri)
      const superClasses = ic.neighbourhoodFinder.getSuperclassesIris(classIri)
      const equivalentClasses = ic.neighbourhoodFinder.getEquivalentClassesIris(classIri)

      if (subClasses.length > 0) {
        const areAllSubclassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, subClasses, 'sub')
        commands.push(
          IncrementalCommands.showHideSubClasses(
            areAllSubclassesVisible,
            () => {
              areAllSubclassesVisible
                ? subClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
                : ic.showSubClassesOf(classIri, subClasses)
            }
          )
        )
      }

      if (superClasses.length > 0) {
        const areAllSuperclassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, superClasses, 'super')
        commands.push(
          IncrementalCommands.showHideSuperClasses(
            areAllSuperclassesVisible,
            () => {
              areAllSuperclassesVisible
                ? superClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
                : ic.showSuperClassesOf(classIri, superClasses)
            }
          )
        )
      }

      if (equivalentClasses.length > 0) {
        const areAllEquivalentClassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, equivalentClasses, 'equivalent')
        commands.push(
          IncrementalCommands.showHideEquivalentClasses(
            areAllEquivalentClassesVisible,
            () => {
              areAllEquivalentClassesVisible
                ? equivalentClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
                : ic.showEquivalentClassesOf(classIri, equivalentClasses)
            }
          )
        )
      }

      if (ic.endpointController?.isReasonerAvailable() && ic.countersEnabled) {
        commands.push({
          icon: counter,
          content: 'Count Instances',
          select: () => {
            ic.endpointController?.requestCountForClass(entity.iri.fullIri)
          }
        })
      }

    }

    if (!grapholElement.is(TypesEnum.CLASS_INSTANCE) && ic.endpointController?.isReasonerAvailable()) {
      commands.push({
        content: 'Data Lineage',
        icon: sankey,
        select: () => ic.onShowDataLineage(entity.iri.fullIri),
      })
    }

    commands.push(
      IncrementalCommands.remove(() => {
        if (grapholElement.is(TypesEnum.OBJECT_PROPERTY)) {
          const grapholOccurrence = ic.diagram.representation?.grapholElements.get(event.target.id())
          if (grapholOccurrence) {
            entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
          }
          ic.diagram.removeElement(event.target.id())
          ic.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
        } else {
          ic.removeEntity(entity.iri.fullIri)
        }
      })
    )

    try {
      if (event.target.isEdge() && ic.grapholscape.uiContainer) {
        commandsWidget.attachToPosition(event.renderedPosition, ic.grapholscape.uiContainer, commands)
      } else {
        const htmlNodeReference = (event.target as any).popperRef()
        if (htmlNodeReference && commands.length > 0) {
          commandsWidget.attachTo(htmlNodeReference, commands)
        }
      }

    } catch (e) { console.error(e) }
  })
}

function showParentClass(incrementalController: IncrementalController, instanceEntity: ClassInstanceEntity) {
  const parentClassIris = instanceEntity.parentClassIris
  let parentClassNode: GrapholNode | undefined
  let classInstanceId = incrementalController.getIDByIRI(instanceEntity.iri.fullIri, TypesEnum.CLASS_INSTANCE)
  if (classInstanceId) {
    incrementalController.performActionWithBlockedGraph(() => {
      parentClassIris?.forEach(parentClassIri => {
        parentClassNode = incrementalController.addClass(parentClassIri.fullIri, false)
        if (parentClassNode) {
          incrementalController.addEdge(
            classInstanceId!,
            parentClassNode.id,
            TypesEnum.INSTANCE_OF
          )
        }
      })
    })

    if (parentClassIris?.length === 1 && parentClassNode) {
      setTimeout(() => {
        incrementalController.grapholscape.centerOnElement(parentClassNode!.id)
      }, 250)
    }
  }
}