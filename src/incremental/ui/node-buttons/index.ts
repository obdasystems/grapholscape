import { CollectionReturnValue, NodeSingular } from "cytoscape";
import { ClassInstanceEntity, GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../../model";
import { ViewObjectProperty, WidgetEnum } from "../../../ui";
import { objectPropertyIcon, pathIcon } from "../../../ui/assets";
import NodeButton from "../../../ui/common/button/node-button";
import { grapholEntityToEntityViewData } from "../../../util";
import { IIncremental } from "../../i-incremental";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
// import { GscapeInstanceExplorer } from "../instances-explorer";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
import showMenu from "../show-menu";
import { getButtonOffset, hideButtons, showButtons } from "./show-hide-buttons";

export { hideButtons, showButtons, getButtonOffset };

export function NodeButtonsFactory(ic: IIncremental) {

  // const instancesButton = new NodeButton(classInstanceIcon)
  // instancesButton.title = 'Search instances'

  // const objectPropertyButton = new NodeButton(objectPropertyIcon)
  // objectPropertyButton.title = 'Navigate through object properties'

  // const pathDrawingButton = new NodeButton(pathIcon)
  // pathDrawingButton.title = 'Find shortest paths to another entity'

  // const nodeButtonsMap = new Map<TypesEnum, NodeButton[]>()
  // nodeButtonsMap.set(TypesEnum.CLASS, [objectPropertyButton])
  // nodeButtonsMap.set(TypesEnum.CLASS_INSTANCE, [objectPropertyButton, pathDrawingButton])

  // instancesButton.onclick = (e) => handleInstancesButtonClick(e, ic)
  // objectPropertyButton.onclick = (e) => handleObjectPropertyButtonClick(e, ic)
  // pathDrawingButton.onclick = (e) => onPathDrawingButtonClick(e, ic)

  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    setHandlersOnIncrementalCytoscape(ic)
  }

  ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      setHandlersOnIncrementalCytoscape(ic)
    }
  })

  ic.on(IncrementalEvent.Reset, () => {
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      setHandlersOnIncrementalCytoscape(ic)
      ic
        .grapholscape
        .container
        .querySelectorAll('[data-tippy-root]') // take all the tippy widgets (loading badges basically)
        .forEach(tippy => tippy.remove())
    }
  })

  // ic.on(IncrementalEvent.EndpointChange, () => {
  //   if (!nodeButtonsMap.get(TypesEnum.CLASS)?.includes(instancesButton)) {
  //     nodeButtonsMap.get(TypesEnum.CLASS)?.push(instancesButton)
  //   }

  //   if (!nodeButtonsMap.get(TypesEnum.CLASS)?.includes(pathDrawingButton)) {
  //     nodeButtonsMap.get(TypesEnum.CLASS)?.push(pathDrawingButton)
  //   }
  // })
}

function setHandlersOnIncrementalCytoscape(ic: IIncremental) {
  const cy = ic.grapholscape.incremental.diagram.representation?.cy
  if (!cy)
    return

  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  // const btns = Array.from(nodeButtons.values()).flat()
  let lastSelectedNode
  cy.on('tap', 'node', e => {
    const grapholElem = ic.grapholscape.renderer.grapholElements?.get(e.target.id())
    if (grapholElem) {
      if (lastSelectedNode) {
        hideButtons(lastSelectedNode)
      }
      showButtons(e.target, ic.getNodeButtons(grapholElem, e.target))
      lastSelectedNode = e.target
    }
  })

  cy.on('tap', e => {
    if (e.target === cy && lastSelectedNode) {
      hideButtons(lastSelectedNode)
      lastSelectedNode = undefined
    }
  })

  cy.on('pan', e => {
    if (lastSelectedNode) {
      hideButtons(lastSelectedNode)
      lastSelectedNode = undefined
    }
  })

  cy.scratch('_gscape-graph-incremental-handlers-set', true)
}

async function handleObjectPropertyButtonClick(e: MouseEvent, incrementalController: IIncremental) {
  const targetButton = e.currentTarget as NodeButton
  const navigationMenu = incrementalController.grapholscape.widgets.get(WidgetEnum.NAVIGATION_MENU) as GscapeNavigationMenu

  if (!navigationMenu) return

  if (targetButton.node && targetButton.node.data().iri) {

    let referenceEnity: GrapholEntity | ClassInstanceEntity | null | undefined
    let objectProperties: Map<GrapholEntity, ObjectPropertyConnectedClasses> = new Map()

    if (targetButton.node.data().type === TypesEnum.CLASS) {
      referenceEnity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.referenceEntityType = targetButton.node.data().type
      navigationMenu.canShowObjectPropertiesRanges = true


      objectProperties = await incrementalController.getObjectPropertiesHighlights([targetButton.node.data().iri], targetButton.node.data('type') === TypesEnum.INDIVIDUAL)
    }

    // else if (targetButton.node.data().type === TypesEnum.CLASS_INSTANCE) {
    //   referenceEnity = incrementalController.classInstanceEntities.get(targetButton.node.data().iri)
    //   if (!referenceEnity)
    //     return

    //   navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
    //   navigationMenu.referenceEntityType = targetButton.node.data().type
    //   navigationMenu.canShowObjectPropertiesRanges = false

    //   const parentClassesIris = (referenceEnity as ClassInstanceEntity).parentClassIris!.map(i => i.fullIri)
    //   objectProperties = await incrementalController.getObjectPropertiesByClasses(parentClassesIris)
    // }

    // const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
    //   incrementalController.endpointController?.highlightsManager
    // )

    navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
      const newV = grapholEntityToEntityViewData(v[0], incrementalController.grapholscape) as ViewObjectProperty
      // const viewIncrementalObjProp = newV as ViewObjectProperty
      newV.connectedClasses = v[1].list.map(classEntity => {
        return grapholEntityToEntityViewData(classEntity, incrementalController.grapholscape)
      })
      newV.direct = v[1].direct

      return newV
    })

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      showMenu(navigationMenu, incrementalController)
    }
  }
}

// async function handleInstancesButtonClick(e: MouseEvent, incrementalController: IIncremental) {
//   const targetButton = e.currentTarget as NodeButton
//   const instanceExplorer = incrementalController.grapholscape.widgets.get(WidgetEnum.INSTANCES_EXPLORER) as GscapeInstanceExplorer

//   if (!instanceExplorer)
//     return

//   if (targetButton.node && targetButton.node.data().iri) {
//     const referenceEntity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)
//     const entityType = targetButton.node.data().type
//     if (referenceEntity && entityType === TypesEnum.CLASS) {
//       if (!instanceExplorer.referenceEntity ||
//         !instanceExplorer.referenceEntity.value.iri.equals(referenceEntity.iri) ||
//         instanceExplorer.numberOfInstancesReceived === 0) {
//         instanceExplorer.clear()

//         instanceExplorer.areInstancesLoading = true
//         instanceExplorer.referenceEntity = grapholEntityToEntityViewData(referenceEntity, incrementalController.grapholscape)
//         instanceExplorer.referenceEntityType = targetButton.node.data().type

//         // const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
//         //   incrementalController.endpointController?.highlightsManager
//         // )

//         const dataProperties = await incrementalController.getDataPropertiesHighlights([referenceEntity.iri.fullIri], false)
//         const objectPropertiesMap = await incrementalController.getObjectPropertiesHighlights([referenceEntity.iri.fullIri], false)
//         const objectProperties = Array.from(objectPropertiesMap).map(v => {
//           const newV = grapholEntityToEntityViewData(v[0], incrementalController.grapholscape) as ViewObjectProperty
//           // const viewIncrementalObjProp = newV as ViewObjectProperty
//           newV.connectedClasses = v[1].list.map(classEntity => {
//             return grapholEntityToEntityViewData(classEntity, incrementalController.grapholscape)
//           })
//           newV.direct = v[1].direct

//           return newV
//         })

//         instanceExplorer.propertiesFilterList = dataProperties
//           .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
//           .concat(objectProperties)
//           .sort((a, b) => a.displayedName.localeCompare(b.displayedName))

//         // instanceExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(referenceEntity.iri.fullIri)

//         // if (instanceExplorer.requestId) {
//         //   incrementalController
//         //     .endpointController
//         //     ?.shouldQueryUseLabels(instanceExplorer.requestId)
//         //     ?.then(async shouldAskForLabels => {
//         //       if (!shouldAskForLabels) {
//         //         instanceExplorer.shouldAskForLabels = shouldAskForLabels
//         //         instanceExplorer.areInstancesLoading = true
//         //         instanceExplorer.requestId = await incrementalController.endpointController
//         //           ?.requestInstancesForClass(
//         //             referenceEntity.iri.fullIri,
//         //             shouldAskForLabels
//         //           )
//         //       }

//         //     })
//         // }
//       }
//     }

//     // TODO: check why sometimes here targetButton.node is undefined, happens only few times
//     // it should be defined due to previous initial if
//     if (targetButton.node) {
//       showMenu(instanceExplorer, incrementalController)
//     }
//   }
// }

// function onPathDrawingButtonClick(e: MouseEvent, ic: IIncremental) {
//   const onComplete = async (sourceNode: NodeSingular, targetNode: NodeSingular, loadingEdge: EdgeSingular) => {
//     let pathSelector: PathSelector | undefined
//     let sourceIriForPath = sourceNode.data('iri')
//     let targetIriForpath = targetNode.data('iri')

//     const loadingAnimationInterval = setInterval(() => {
//       loadingEdge.data('on', !loadingEdge.data('on'))
//     }, 500)

//     const stopAnimation = () => {
//       loadingEdge.remove()
//       clearInterval(loadingAnimationInterval)
//     }

//     if (sourceNode.edgesTo(targetNode).filter('.loading-edge').size() > 1) {
//       stopAnimation()
//     }

//     let entity: ClassInstanceEntity | undefined
//     // Take parentClass IRI to find a path to the other node in the intensional level
//     if (sourceNode.data().type === TypesEnum.CLASS_INSTANCE) {
//       entity = ic.classInstanceEntities.get(sourceNode.data('iri'))

//       if (entity) {
//         sourceIriForPath = entity.parentClassIris[0].fullIri
//       }
//     }

//     if (targetNode.data().type === TypesEnum.CLASS_INSTANCE) {
//       entity = ic.classInstanceEntities.get(targetNode.data('iri'))

//       if (entity) {
//         targetIriForpath = entity.parentClassIris[0].fullIri
//       }
//     }

//     if (sourceIriForPath && targetIriForpath) {
//       pathSelector = await pathSelectionInit(ic, sourceIriForPath, targetIriForpath)
//       if (pathSelector) {
//         pathSelector.addEventListener('path-selection', async (evt: PathSelectionEvent) => {
//           ic.addInstancesPath(sourceNode.data().iri, targetNode.data().iri, evt.detail)
//             .finally(stopAnimation)
//         })
//       } else {
//         stopAnimation()
//       }
//     }

//     if (pathSelector) {
//       pathSelector.addEventListener('cancel', stopAnimation)
//       pathSelector.show()
//     }
//   }

//   if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
//     const targetNode = (e.currentTarget as NodeButton).node
//     if (targetNode) {
//       handlePathEdgeDraw(targetNode, ic, onComplete)
//     }
//   }
// }