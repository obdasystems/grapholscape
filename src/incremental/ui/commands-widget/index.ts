import { LifecycleEvent, RendererStatesEnum } from "../../../model";
import { GscapeContextMenu } from "../../../ui";
import IncrementalBase from "../../i-incremental";

export * from './commands';
export function CommandsWidgetFactory(ic: IncrementalBase) {
  const commandsWidget = new GscapeContextMenu()

  ic.grapholscape.on(LifecycleEvent.ContextClick, event => {
    // const commands: Command[] = []

    if (
      event.target === ic.grapholscape.renderer.cy ||
      !event.target.data().iri ||
      ic.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL
    )
      return

    const entity = ic.grapholscape.ontology.getEntity(event.target.data().iri)
    const grapholElement = ic.diagram.representation?.grapholElements.get(event.target.id())
    if (!entity || !grapholElement) return

    // if (grapholElement.is(TypesEnum.OBJECT_PROPERTY) &&
    //   event.target.source().data().type === TypesEnum.CLASS_INSTANCE &&
    //   event.target.target().data().type === TypesEnum.CLASS_INSTANCE) {
    //   commands.push({
    //     content: 'Show Instance Types',
    //     icon: classIcon,
    //     select: () => {
    //       ic.showObjectPropertyTypes(
    //         entity.iri.fullIri,
    //         event.target.source().id(),
    //         event.target.target().id(),
    //       )
    //     },
    //   })
    // }

    // if (grapholElement.is(TypesEnum.CLASS_INSTANCE)) {

    //   commands.push(IncrementalCommands.focusInstance(() => ic.expandObjectPropertiesOnInstance(entity.iri.fullIri)))

    //   commands.push(IncrementalCommands.performInstanceChecking(async () => {
    //     const allClassesIris = ic
    //       .grapholscape
    //       .ontology
    //       .getEntitiesByType(TypesEnum.CLASS)
    //       .map(e => e.iri.fullIri)

    //     const badgeController = new BadgeController(ic)
    //     badgeController.addLoadingBadge(entity.iri.fullIri, TypesEnum.CLASS_INSTANCE)
    //     const instanceCheckingClasses = await ic
    //       .endpointController
    //       ?.instanceCheck(entity.iri.fullIri, allClassesIris, false)
    //       .finally(() => badgeController.removeLoadingBadge(entity.iri.fullIri, TypesEnum.CLASS_INSTANCE))

    //     instanceCheckingClasses?.forEach(classIri => {
    //       const classEntity = ic.grapholscape.ontology.getEntity(classIri);
    //       if (classEntity) {
    //         (entity as ClassInstanceEntity).addParentClass(classEntity.iri)
    //       }
    //     })

    //     showParentClass(ic, entity as ClassInstanceEntity, event.target.position())
    //   }))

    //   if (!(entity as ClassInstanceEntity).isRDFTypeUnknown) {
    //     commands.push(IncrementalCommands.showParentClass(() => showParentClass(ic, entity as ClassInstanceEntity, event.target.position())))
    //   }
    // }

    // const classIri = entity.iri.fullIri

    // if (grapholElement.is(TypesEnum.CLASS)) {

    //   if (ic.endpointController?.isReasonerAvailable()) {
    //     commands.push(IncrementalCommands.getInstances(() => {
    //       ic.expandInstancesOnClass(classIri)
    //     }))
    //   }

    //   const superHierarchies = ic.grapholscape.ontology.getSuperHierarchiesOf(classIri)
    //   const subHierarchies = ic.grapholscape.ontology.getSubHierarchiesOf(classIri)

    //   if (superHierarchies && superHierarchies.length > 0) {
    //     const areAllSuperHierarchiesVisible = ic.areHierarchiesVisible(superHierarchies)

    //     commands.push(IncrementalCommands.showHideSuperHierarchies(
    //       areAllSuperHierarchiesVisible,
    //       () => {
    //         areAllSuperHierarchiesVisible ? ic.hideSuperHierarchiesOf(classIri) : ic.showSuperHierarchiesOf(classIri)
    //       }
    //     ))
    //   }

    //   if (subHierarchies && subHierarchies.length > 0) {
    //     const areAllSubHierarchiesVisible = ic.areHierarchiesVisible(subHierarchies)

    //     commands.push(
    //       IncrementalCommands.showHideSubHierarchies(
    //         areAllSubHierarchiesVisible,
    //         () => {
    //           areAllSubHierarchiesVisible ? ic.hideSubHierarchiesOf(classIri) : ic.showSubHierarchiesOf(classIri)
    //         }
    //       ),
    //     )
    //   }

    //   const subClasses = ic.neighbourhoodFinder.getSubclassesIris(classIri)
    //   const superClasses = ic.neighbourhoodFinder.getSuperclassesIris(classIri)
    //   const equivalentClasses = ic.neighbourhoodFinder.getEquivalentClassesIris(classIri)

    //   if (subClasses.length > 0) {
    //     const areAllSubclassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, subClasses, 'sub')
    //     commands.push(
    //       IncrementalCommands.showHideSubClasses(
    //         areAllSubclassesVisible,
    //         () => {
    //           areAllSubclassesVisible
    //             ? subClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
    //             : ic.showSubClassesOf(classIri, subClasses)
    //         }
    //       )
    //     )
    //   }

    //   if (superClasses.length > 0) {
    //     const areAllSuperclassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, superClasses, 'super')
    //     commands.push(
    //       IncrementalCommands.showHideSuperClasses(
    //         areAllSuperclassesVisible,
    //         () => {
    //           areAllSuperclassesVisible
    //             ? superClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
    //             : ic.showSuperClassesOf(classIri, superClasses)
    //         }
    //       )
    //     )
    //   }

    //   if (equivalentClasses.length > 0) {
    //     const areAllEquivalentClassesVisible = ic.areAllConnectedClassesVisibleForClass(classIri, equivalentClasses, 'equivalent')
    //     commands.push(
    //       IncrementalCommands.showHideEquivalentClasses(
    //         areAllEquivalentClassesVisible,
    //         () => {
    //           areAllEquivalentClassesVisible
    //             ? equivalentClasses.forEach(sc => ic.removeEntity(sc, [classIri]))
    //             : ic.showEquivalentClassesOf(classIri, equivalentClasses)
    //         }
    //       )
    //     )
    //   }

    //   if (ic.endpointController?.isReasonerAvailable() && ic.countersEnabled) {
    //     commands.push({
    //       icon: counter,
    //       content: 'Count Instances',
    //       select: () => ic.showFreshClassCount(entity.iri.fullIri)
    //     })
    //   }

    // }

    // if (!grapholElement.is(TypesEnum.CLASS_INSTANCE) && ic.endpointController?.isReasonerAvailable() && ic.dataLineageEnabled) {
    //   commands.push({
    //     content: 'Data Lineage',
    //     icon: sankey,
    //     select: () => ic.onShowDataLineage(entity.iri.fullIri),
    //   })
    // }

    // commands.push(
    //   IncrementalCommands.remove(() => {
    //     if (grapholElement.is(TypesEnum.OBJECT_PROPERTY)) {
    //       const grapholOccurrence = ic.diagram.representation?.grapholElements.get(event.target.id())
    //       if (grapholOccurrence) {
    //         entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
    //       }
    //       ic.diagram.removeElement(event.target.id())
    //       ic.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
    //     } else {
    //       ic.removeEntity(entity.iri.fullIri)
    //     }
    //   })
    // )

    const commands = ic.getContextMenuCommands(grapholElement, event.target)
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

// function showParentClass(incrementalController: IncrementalCore, instanceEntity: ClassInstanceEntity, position: Position) {
//   const parentClassIris = instanceEntity.parentClassIris
//   let parentClassNode: GrapholNode | undefined
//   let classInstanceId = incrementalController.getIDByIRI(instanceEntity.iri.fullIri, TypesEnum.CLASS_INSTANCE)
//   if (classInstanceId) {
//     incrementalController.performActionWithBlockedGraph(() => {
//       parentClassIris?.forEach(parentClassIri => {
//         parentClassNode = incrementalController.addClass(parentClassIri.fullIri, false, position)
//         if (parentClassNode) {
//           incrementalController.addEdge(
//             classInstanceId!,
//             parentClassNode.id,
//             TypesEnum.INSTANCE_OF
//           )
//         }
//       })
//     })

//     if (parentClassIris?.length === 1 && parentClassNode) {
//       setTimeout(() => {
//         incrementalController.grapholscape.centerOnElement(parentClassNode!.id)
//       }, 250)
//     }
//   }
// }