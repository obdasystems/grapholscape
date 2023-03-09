import { ClassInstanceEntity, GrapholTypesEnum } from "../../../model";
import GscapeContextMenu, { Command } from "../../../ui/common/context-menu";
import { IncrementalCommands } from "../../../ui/incremental-ui";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";

export function CommandsWidgetFactory(incrementalController: IncrementalController) {
  const commandsWidget = new GscapeContextMenu()

  incrementalController.on(IncrementalEvent.ContextClick, entity => {
    const commands: Command[] = []

    if (entity.is(GrapholTypesEnum.CLASS_INSTANCE) && !(entity as ClassInstanceEntity).isRDFTypeUnknown) {

      commands.push(IncrementalCommands.performInstanceChecking(async () => {
        const allClassesIris = incrementalController
          .grapholscape
          .ontology
          .getEntitiesByType(GrapholTypesEnum.CLASS)
          .map(e => e.iri.fullIri)

        const instanceCheckingClasses = await incrementalController
          .endpointController
          ?.instanceCheck(entity.iri.fullIri, allClassesIris)

        instanceCheckingClasses?.forEach(classIri => {
          const classEntity = incrementalController.grapholscape.ontology.getEntity(classIri);
          if (classEntity) {
            (entity as ClassInstanceEntity).addParentClass(classEntity.iri)
          }
        })

        showParentClass(incrementalController, entity as ClassInstanceEntity)
      }))

      commands.push(IncrementalCommands.showParentClass(() => showParentClass(incrementalController, entity as ClassInstanceEntity)))
    }

    const classIri = entity.iri.fullIri

    if (entity.is(GrapholTypesEnum.CLASS)) {
      const superHierarchies = incrementalController.grapholscape.ontology.hierarchiesBySubclassMap.get(classIri)
      const subHierarchies = incrementalController.grapholscape.ontology.hierarchiesBySuperclassMap.get(classIri)

      if (superHierarchies && superHierarchies.length > 0) {
        const areAllSuperHierarchiesVisible = incrementalController.areHierarchiesVisible(superHierarchies)

        commands.push(IncrementalCommands.showHideSuperHierarchies(
          areAllSuperHierarchiesVisible,
          () => {
            areAllSuperHierarchiesVisible ? incrementalController.hideSuperHierarchiesOf(classIri) : incrementalController.showSuperHierarchiesOf(classIri)
          }
        ))
      }

      if (subHierarchies && subHierarchies.length > 0) {
        const areAllSubHierarchiesVisible = incrementalController.areHierarchiesVisible(subHierarchies)

        commands.push(
          IncrementalCommands.showHideSubHierarchies(
            areAllSubHierarchiesVisible,
            () => {
              areAllSubHierarchiesVisible ? incrementalController.hideSubHierarchiesOf(classIri) : incrementalController.showSubHierarchiesOf(classIri)
            }
          ),
        )
      }

      const subClasses = incrementalController.neighbourhoodFinder.getSubclassesIris(classIri)
      const superClasses = incrementalController.neighbourhoodFinder.getSuperclassesIris(classIri)
      const equivalentClasses = incrementalController.neighbourhoodFinder.getEquivalentClassesIris(classIri)

      if (subClasses.length > 0) {
        const areAllSubclassesVisible = incrementalController.areAllConnectedClassesVisibleForClass(classIri, subClasses, 'sub')
        commands.push(
          IncrementalCommands.showHideSubClasses(
            areAllSubclassesVisible,
            () => {
              areAllSubclassesVisible
                ? subClasses.forEach(sc => incrementalController.removeEntity(sc, [classIri]))
                : incrementalController.showSubClassesOf(classIri, subClasses)
            }
          )
        )
      }

      if (superClasses.length > 0) {
        const areAllSuperclassesVisible = incrementalController.areAllConnectedClassesVisibleForClass(classIri, superClasses, 'super')
        commands.push(
          IncrementalCommands.showHideSuperClasses(
            areAllSuperclassesVisible,
            () => {
              areAllSuperclassesVisible
                ? superClasses.forEach(sc => incrementalController.removeEntity(sc, [classIri]))
                : incrementalController.showSuperClassesOf(classIri, superClasses)
            }
          )
        )
      }

      if (equivalentClasses.length > 0) {
        const areAllEquivalentClassesVisible = incrementalController.areAllConnectedClassesVisibleForClass(classIri, equivalentClasses, 'equivalent')
        commands.push(
          IncrementalCommands.showHideEquivalentClasses(
            areAllEquivalentClassesVisible,
            () => {
              areAllEquivalentClassesVisible
                ? equivalentClasses.forEach(sc => incrementalController.removeEntity(sc, [classIri]))
                : incrementalController.showEquivalentClassesOf(classIri, equivalentClasses)
            }
          )
        )
      }
    }

    commands.push(
      IncrementalCommands.remove(() => incrementalController.removeEntity(classIri))
    )

    try {
      const htmlNodeReference = (incrementalController.grapholscape.renderer.cy?.$id(classIri) as any).popperRef()
      if (htmlNodeReference && commands.length > 0) {
        commandsWidget.attachTo(htmlNodeReference, commands)
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