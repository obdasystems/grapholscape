import { NodeSingular } from "cytoscape";
import { SVGTemplateResult, TemplateResult } from "lit";
import { Placement } from "tippy.js";
import { ClassInstanceEntity, GrapholEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../../model";
import { textSpinner, WidgetEnum } from "../../../ui";
import { classInstanceIcon, objectPropertyIcon } from "../../../ui/assets";
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
import { GscapeInstanceExplorer } from "../instances-explorer";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
import showMenu from "../show-menu";
import { getEntityViewDataIncremental } from "../utils";
import { ViewIncrementalObjectProperty } from "../view-model";
import NodeButton from "./node-button";

export function NodeButtonsFactory(incrementalController: IncrementalController) {

  const instancesButton = new NodeButton(classInstanceIcon)
  instancesButton.title = 'Search instances'

  const objectPropertyButton = new NodeButton(objectPropertyIcon)
  objectPropertyButton.title = 'Navigate through object properties'

  const nodeButtonsMap = new Map<GrapholTypesEnum, NodeButton[]>()
  nodeButtonsMap.set(GrapholTypesEnum.CLASS, [objectPropertyButton])
  nodeButtonsMap.set(GrapholTypesEnum.CLASS_INSTANCE, [objectPropertyButton])


  instancesButton.onclick = (e) => handleInstancesButtonClick(e, incrementalController)
  objectPropertyButton.onclick = (e) => handleObjectPropertyButtonClick(e, incrementalController)

  if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
    setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
  }

  incrementalController.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
      setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
    }
  })

  incrementalController.on(IncrementalEvent.Reset, () => {
    if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && incrementalController.incrementalDiagram.representation) {
      setHandlersOnIncrementalCytoscape(incrementalController.incrementalDiagram.representation.cy, nodeButtonsMap)
      incrementalController
        .grapholscape
        .container
        .querySelectorAll('[data-tippy-root]') // take all the tippy widgets (loading badges basically)
        .forEach(tippy => tippy.remove())
    }
  })

  incrementalController.on(IncrementalEvent.EndpointChange, () => {
    if (!nodeButtonsMap.get(GrapholTypesEnum.CLASS)?.includes(instancesButton)) {
      nodeButtonsMap.get(GrapholTypesEnum.CLASS)?.push(instancesButton)
    }
  })


  incrementalController.on(IncrementalEvent.InstanceCheckingStarted, (instanceIri) => {
    const cyNode = incrementalController.incrementalDiagram.representation?.cy.$id(instanceIri)
    if (cyNode) {
      cyNode.addClass('unknown-parent-class')
      addBadge(cyNode, textSpinner(), 'loading-badge')
    }
  })

  incrementalController.on(IncrementalEvent.InstanceCheckingFinished, (instanceIri) => {
    const cyNode = incrementalController.incrementalDiagram.representation?.cy.$id(instanceIri)
    if (cyNode && cyNode.scratch('loading-badge')) {
      removeBadge(cyNode, 'loading-badge')
    }
  })

  incrementalController.on(IncrementalEvent.CountStarted, classIri => {
    const node = incrementalController.incrementalDiagram.representation?.cy.$id(classIri)
    if (!node || node.empty()) return

    removeBadge(node, 'instance-count')
    addBadge(node, textSpinner(), 'instance-count', 'bottom')
  })

  incrementalController.on(IncrementalEvent.NewCountResult, (classIri, count) => {
    const cyNode = incrementalController.grapholscape.renderer.cy?.$id(classIri)
    if (cyNode && cyNode.nonempty() && cyNode.scratch('instance-count')) {
      const instanceCountBadge = cyNode.scratch('instance-count') as NodeButton
      instanceCountBadge.contentType = 'template';

      count = count || incrementalController.counts.get(classIri)
      instanceCountBadge.content = count?.value !== undefined
        ? new Intl.NumberFormat().format(count.value)
        : 'n/a'

      instanceCountBadge.highlighted = !count?.materialized
      if (count?.date) {
        instanceCountBadge.title = `Date: ${count.date}`
      } else {
        instanceCountBadge.title = 'Fresh Value'
      }


      const updateFun = cyNode.scratch('update-instance-count-position')
      if (updateFun) updateFun()

      setTimeout(() => instanceCountBadge.hide(), 1000)
      cyNode.on('mouseover', () => {
        if (incrementalController.countersEnabled)
          instanceCountBadge.tippyWidget.show()
      })
      cyNode.on('mouseout', () => instanceCountBadge.tippyWidget.hide())

      if (count && !count.materialized) // update only if it's a fresh value
        incrementalController.counts.set(classIri, count)
    }
  })
}

function setHandlersOnIncrementalCytoscape(cy: cytoscape.Core, nodeButtons: Map<GrapholTypesEnum, NodeButton[]>) {
  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  cy.on('mouseover', 'node', e => {
    const targetNode = e.target
    const targetType = targetNode.data().type

    if (!targetNode.hasClass('unknown-parent-class') && (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE)) {
      nodeButtons.get(targetType)?.forEach((btn, i) => {
        // set position relative to default placemente (right)
        btn.cxtWidgetProps.offset = (info) => getButtonOffset(info, i, nodeButtons.get(targetType)!.length)
        btn.node = targetNode

        // save the function to attach the button in the scratch for later usage
        targetNode.scratch(`place-node-button-${i}`, () => btn.attachTo(targetNode.popperRef()))
        targetNode.on('position', targetNode.scratch(`place-node-button-${i}`)) // on position change, call the function in the scratch
        btn.attachTo(targetNode.popperRef())
      })
    }
  })

  cy.on('mouseout', 'node', e => {
    const targetNode = e.target as NodeSingular
    nodeButtons.forEach((buttons, _) => buttons.forEach((btn, i) => {
      btn.hide();
      const updatePosFunction = targetNode.scratch(`place-node-button-${i}`)
      if (updatePosFunction) {
        targetNode.removeListener('position', undefined, updatePosFunction)
        targetNode.removeScratch(`place-node-button-${i}`)
      }
    }))
  })

  cy.scratch('_gscape-graph-incremental-handlers-set', true)
}

async function handleObjectPropertyButtonClick(e: MouseEvent, incrementalController: IncrementalController) {
  const targetButton = e.currentTarget as NodeButton
  const navigationMenu = incrementalController.grapholscape.widgets.get(WidgetEnum.NAVIGATION_MENU) as GscapeNavigationMenu

  if (!navigationMenu) return

  if (targetButton.node && targetButton.node.data().iri) {

    let referenceEnity: GrapholEntity | ClassInstanceEntity | null | undefined
    let objectProperties: Map<GrapholEntity, ObjectPropertyConnectedClasses> = new Map()

    if (targetButton.node.data().type === GrapholTypesEnum.CLASS) {
      referenceEnity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.canShowObjectPropertiesRanges = true


      objectProperties = await incrementalController.getObjectPropertiesByClasses([targetButton.node.data().iri])
    }

    else if (targetButton.node.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
      referenceEnity = incrementalController.classInstanceEntities.get(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.canShowObjectPropertiesRanges = false

      const parentClassesIris = (referenceEnity as ClassInstanceEntity).parentClassIris!.map(i => i.fullIri)
      objectProperties = await incrementalController.getObjectPropertiesByClasses(parentClassesIris)
    }

    navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
      const newV = getEntityViewDataIncremental(v[0], incrementalController)
      const viewIncrementalObjProp = newV as ViewIncrementalObjectProperty
      viewIncrementalObjProp.connectedClasses = v[1].list.map(classEntity => {
        return getEntityViewDataIncremental(classEntity, incrementalController)
      })
      viewIncrementalObjProp.direct = v[1].direct

      return viewIncrementalObjProp
    })

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      showMenu(navigationMenu, incrementalController)
    }
  }
}

async function handleInstancesButtonClick(e: MouseEvent, incrementalController: IncrementalController) {
  const targetButton = e.currentTarget as NodeButton
  const instanceExplorer = incrementalController.grapholscape.widgets.get(WidgetEnum.INSTANCES_EXPLORER) as GscapeInstanceExplorer

  if (!instanceExplorer)
    return

  if (targetButton.node && targetButton.node.data().iri) {
    const referenceEntity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)

    if (referenceEntity && referenceEntity.type === GrapholTypesEnum.CLASS) {
      if (!instanceExplorer.referenceEntity ||
        !instanceExplorer.referenceEntity.value.iri.equals(referenceEntity.iri) ||
        instanceExplorer.numberOfInstancesReceived === 0) {
        instanceExplorer.clear()

        instanceExplorer.areInstancesLoading = true
        instanceExplorer.referenceEntity = grapholEntityToEntityViewData(referenceEntity, incrementalController.grapholscape)
        const dataProperties = await incrementalController.getDataPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectPropertiesMap = await incrementalController.getObjectPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectProperties = Array.from(objectPropertiesMap).map(([opEntity, connectedClasses]) => {
          let opViewDataIncremental = getEntityViewDataIncremental(opEntity, incrementalController)

          return {
            entityViewData: opViewDataIncremental.entityViewData,
            loading: opViewDataIncremental.loading,
            hasUnfolding: opViewDataIncremental.hasUnfolding,
            connectedClasses: [],
            direct: connectedClasses.direct,
          } as ViewIncrementalObjectProperty
        })

        instanceExplorer.propertiesFilterList = dataProperties
          .map(dp => getEntityViewDataIncremental(dp, incrementalController))
          .concat(objectProperties)
          .sort((a, b) => a.entityViewData.displayedName.localeCompare(b.entityViewData.displayedName))

        instanceExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(referenceEntity.iri.fullIri)

        if (instanceExplorer.requestId) {
          incrementalController
            .endpointController
            ?.shouldQueryUseLabels(instanceExplorer.requestId)
            ?.then(async shouldAskForLabels => {
              if (!shouldAskForLabels) {
                instanceExplorer.shouldAskForLabels = shouldAskForLabels
                instanceExplorer.areInstancesLoading = true
                instanceExplorer.requestId = await incrementalController.endpointController
                  ?.requestInstancesForClass(
                    referenceEntity.iri.fullIri,
                    shouldAskForLabels
                  )
              }

            })
        }
      }
    }

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      showMenu(instanceExplorer, incrementalController)
    }
  }
}


function getButtonOffset(info: { popper: { height: number, width: number } }, buttonIndex = 0, numberOfButtons = 1): [number, number] {
  const btnHeight = info.popper.height + 4
  const btnWidth = info.popper.width
  return [
    -(btnHeight / 2) - (buttonIndex * btnHeight) + (btnHeight * (numberOfButtons / 2)), // y
    -btnWidth / 2 // x
  ]
}

export function removeBadge(cyNode: NodeSingular, name: string) {
  if (!cyNode.scratch(name)) return

  (cyNode.scratch(name) as NodeButton).tippyWidget.destroy()
  cyNode.removeClass('unknown-parent-class')
  cyNode.removeScratch(name)
  cyNode.removeAllListeners()
  cyNode.cy().removeListener('pan', cyNode.scratch(`update-${name}-position`))
  cyNode.removeScratch(`update-${name}-position`)
}

export function addBadge(
  node: NodeSingular,
  content: string | number | TemplateResult | SVGTemplateResult,
  name: string,
  placement: Placement = 'bottom',
  isIcon = false,
) {

  const badge = isIcon
    ? new NodeButton(content)
    : new NodeButton(content, 'template')

  badge.cxtWidgetProps.placement = placement

  node.scratch(name, badge)
  node.scratch(`update-${name}-position`, () => {
    badge.attachToSilently((node as any).popperRef())
  })
  badge.cxtWidgetProps.offset = info => getButtonOffset(info)
  badge.attachTo((node as any).popperRef())
  // update badge position on node moving around and on viewport pan state change
  node.on('position', node.scratch(`update-${name}-position`))
  node.cy().on('pan', node.scratch(`update-${name}-position`))
  node.scratch(`update-${name}-position`)

  node.on('remove', (e) => removeBadge(e.target, name))

  return badge
}