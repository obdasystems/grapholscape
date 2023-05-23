import { ClassInstanceEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../../model";
import { classIcon, counter, sankey } from "../../../ui/assets";
import GscapeContextMenu, { Command } from "../../../ui/common/context-menu";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
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
    if (!entity) return

    if (entity.is(GrapholTypesEnum.OBJECT_PROPERTY) &&
        event.target.source().data().type === GrapholTypesEnum.CLASS_INSTANCE &&
        event.target.target().data().type === GrapholTypesEnum.CLASS_INSTANCE) {
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

    if (entity.is(GrapholTypesEnum.CLASS_INSTANCE)) {

      commands.push(IncrementalCommands.focusInstance(() => ic.expandObjectPropertiesOnInstance(entity.iri.fullIri)))

      commands.push(IncrementalCommands.performInstanceChecking(async () => {
        const allClassesIris = ic
          .grapholscape
          .ontology
          .getEntitiesByType(GrapholTypesEnum.CLASS)
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

    if (entity.is(GrapholTypesEnum.CLASS)) {
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

    if (!entity.is(GrapholTypesEnum.CLASS_INSTANCE) && ic.endpointController?.isReasonerAvailable()) {
      commands.push({
        content: 'Data Lineage',
        icon: sankey,
        select: () => ic.onShowDataLineage(entity.iri.fullIri),
      })
    }

    commands.push(
      IncrementalCommands.remove(() => {
        if (entity.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
          ic.diagram.removeElement(event.target.id())
          entity.removeOccurrence(event.target.id(), ic.diagram.id, RendererStatesEnum.INCREMENTAL)
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
  incrementalController.performActionWithBlockedGraph(() => {
    parentClassIris?.forEach(parentClassIri => {
      incrementalController.addEntity(parentClassIri.fullIri, false)
      incrementalController.addEdge(instanceEntity.iri.fullIri,
        parentClassIri.fullIri,
        GrapholTypesEnum.INSTANCE_OF
      )
    })
  })
  if (parentClassIris?.length === 1) {
    setTimeout(() => {
      incrementalController.grapholscape.centerOnElement(parentClassIris[0].fullIri)
    }, 250)
  }
}