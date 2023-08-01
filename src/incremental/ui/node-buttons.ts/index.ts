import { EdgeSingular, NodeSingular } from "cytoscape";
import { SVGTemplateResult, TemplateResult } from "lit";
import { Placement } from "tippy.js";
import { ClassInstanceEntity, GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../../model";
import { textSpinner, WidgetEnum } from "../../../ui";
import { classInstanceIcon, objectPropertyIcon, pathIcon } from "../../../ui/assets";
import { getEntityViewDataUnfolding, grapholEntityToEntityViewData } from "../../../util";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
import { GscapeInstanceExplorer } from "../instances-explorer";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
import showMenu from "../show-menu";
import NodeButton from "../../../ui/common/button/node-button";
import { ViewObjectPropertyUnfolding } from "../../../ui/view-model";
import { edgeHandlesOptions } from "../../edge-handles-options";

export function NodeButtonsFactory(ic: IncrementalController) {

  const instancesButton = new NodeButton(classInstanceIcon)
  instancesButton.title = 'Search instances'

  const objectPropertyButton = new NodeButton(objectPropertyIcon)
  objectPropertyButton.title = 'Navigate through object properties'

  const pathDrawingButton = new NodeButton(pathIcon)
  pathDrawingButton.title = 'Find path to another entity'

  const nodeButtonsMap = new Map<TypesEnum, NodeButton[]>()
  nodeButtonsMap.set(TypesEnum.CLASS, [objectPropertyButton])
  nodeButtonsMap.set(TypesEnum.CLASS_INSTANCE, [objectPropertyButton])

  instancesButton.onclick = (e) => handleInstancesButtonClick(e, ic)
  objectPropertyButton.onclick = (e) => handleObjectPropertyButtonClick(e, ic)
  pathDrawingButton.onmousedown = (e) => onPathDrawingButtonClick(e, ic)

  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && ic.diagram.representation) {
    setHandlersOnIncrementalCytoscape(ic.diagram.representation.cy, nodeButtonsMap)
  }

  ic.grapholscape.on(LifecycleEvent.RendererChange, (rendererState) => {
    if (rendererState === RendererStatesEnum.INCREMENTAL && ic.diagram.representation) {
      setHandlersOnIncrementalCytoscape(ic.diagram.representation.cy, nodeButtonsMap)
    }
  })

  ic.on(IncrementalEvent.Reset, () => {
    if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL && ic.diagram.representation) {
      setHandlersOnIncrementalCytoscape(ic.diagram.representation.cy, nodeButtonsMap)
      ic
        .grapholscape
        .container
        .querySelectorAll('[data-tippy-root]') // take all the tippy widgets (loading badges basically)
        .forEach(tippy => tippy.remove())
    }
  })

  ic.on(IncrementalEvent.EndpointChange, () => {
    if (!nodeButtonsMap.get(TypesEnum.CLASS)?.includes(instancesButton)) {
      nodeButtonsMap.get(TypesEnum.CLASS)?.push(instancesButton)
    }

    if (!nodeButtonsMap.get(TypesEnum.CLASS)?.includes(pathDrawingButton)) {
      nodeButtonsMap.get(TypesEnum.CLASS)?.push(pathDrawingButton)
    }
  })

  ic.on(IncrementalEvent.FocusStarted, instanceIri => {
    const nodeId = ic.getIDByIRI(instanceIri, TypesEnum.CLASS_INSTANCE)
    if (nodeId) {
      const cyNode = ic.diagram.representation?.cy.$id(nodeId)
      if (cyNode && cyNode.nonempty()) {
        addBadge(cyNode, textSpinner(), 'loading-badge')
      }
    }
  })

  ic.on(IncrementalEvent.FocusFinished, instanceIri => {
    const nodeId = ic.getIDByIRI(instanceIri, TypesEnum.CLASS_INSTANCE)
    if (nodeId) {
      const cyNode = ic.diagram.representation?.cy.$id(nodeId)
      if (cyNode && cyNode.nonempty() && cyNode.scratch('loading-badge')) {
        removeBadge(cyNode, 'loading-badge')
      }
    }
  })

  ic.on(IncrementalEvent.InstanceCheckingStarted, (instanceIri) => {
    const nodeId = ic.getIDByIRI(instanceIri, TypesEnum.CLASS_INSTANCE)
    if (nodeId) {
      const cyNode = ic.diagram.representation?.cy.$id(nodeId)
      if (cyNode && cyNode.nonempty()) {
        cyNode.addClass('unknown-parent-class')
        addBadge(cyNode, textSpinner(), 'loading-badge')
      }
    }
  })

  ic.on(IncrementalEvent.InstanceCheckingFinished, (instanceIri) => {
    const nodeId = ic.getIDByIRI(instanceIri, TypesEnum.CLASS_INSTANCE)
    if (nodeId) {
      const cyNode = ic.diagram.representation?.cy.$id(nodeId)
      if (cyNode && cyNode.nonempty() && cyNode.scratch('loading-badge')) {
        removeBadge(cyNode, 'loading-badge')
      }
    }
  })

  ic.on(IncrementalEvent.CountStarted, classIri => {
    const nodeId = ic.getIDByIRI(classIri, TypesEnum.CLASS)
    if (nodeId) {
      const node = ic.diagram.representation?.cy.$id(nodeId)
      if (!node || node.empty()) return

      removeBadge(node, 'instance-count')
      addBadge(node, textSpinner(), 'instance-count', 'bottom')
    }
  })

  ic.on(IncrementalEvent.NewCountResult, (classIri, count) => {
    const nodeId = ic.getIDByIRI(classIri, TypesEnum.CLASS)
    if (nodeId) {
      const cyNode = ic.diagram.representation?.cy.$id(nodeId)
      if (cyNode && cyNode.nonempty() && cyNode.scratch('instance-count')) {
        const instanceCountBadge = cyNode.scratch('instance-count') as NodeButton
        instanceCountBadge.contentType = 'template';

        count = count || ic.counts.get(classIri)
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
          if (ic.countersEnabled)
            instanceCountBadge.tippyWidget.show()
        })
        cyNode.on('mouseout', () => instanceCountBadge.tippyWidget.hide())

        if (count && !count.materialized) // update only if it's a fresh value
          ic.counts.set(classIri, count)
      }
    }
  })
}

function setHandlersOnIncrementalCytoscape(cy: cytoscape.Core, nodeButtons: Map<TypesEnum, NodeButton[]>) {
  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  cy.on('mouseover', 'node', e => {
    const targetNode = e.target
    const targetType = targetNode.data().type

    if (!targetNode.hasClass('unknown-parent-class') && (targetType === TypesEnum.CLASS || targetType === TypesEnum.CLASS_INSTANCE)) {
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

    if (targetButton.node.data().type === TypesEnum.CLASS) {
      referenceEnity = incrementalController.grapholscape.ontology.getEntity(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.referenceEntityType = targetButton.node.data().type
      navigationMenu.canShowObjectPropertiesRanges = true


      objectProperties = await incrementalController.getObjectPropertiesByClasses([targetButton.node.data().iri])
    }

    else if (targetButton.node.data().type === TypesEnum.CLASS_INSTANCE) {
      referenceEnity = incrementalController.classInstanceEntities.get(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)
      navigationMenu.referenceEntityType = targetButton.node.data().type
      navigationMenu.canShowObjectPropertiesRanges = false

      const parentClassesIris = (referenceEnity as ClassInstanceEntity).parentClassIris!.map(i => i.fullIri)
      objectProperties = await incrementalController.getObjectPropertiesByClasses(parentClassesIris)
    }

    const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
      incrementalController.endpointController?.highlightsManager
    )

    navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
      const newV = getEntityViewDataUnfolding(v[0], incrementalController.grapholscape, hasUnfoldings)
      const viewIncrementalObjProp = newV as ViewObjectPropertyUnfolding
      viewIncrementalObjProp.connectedClasses = v[1].list.map(classEntity => {
        return getEntityViewDataUnfolding(classEntity, incrementalController.grapholscape, hasUnfoldings)
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
    const entityType = targetButton.node.data().type
    if (referenceEntity && entityType === TypesEnum.CLASS) {
      if (!instanceExplorer.referenceEntity ||
        !instanceExplorer.referenceEntity.value.iri.equals(referenceEntity.iri) ||
        instanceExplorer.numberOfInstancesReceived === 0) {
        instanceExplorer.clear()

        instanceExplorer.areInstancesLoading = true
        instanceExplorer.referenceEntity = grapholEntityToEntityViewData(referenceEntity, incrementalController.grapholscape)
        instanceExplorer.referenceEntityType = targetButton.node.data().type

        const hasUnfoldings = incrementalController.endpointController?.highlightsManager?.hasUnfoldings.bind(
          incrementalController.endpointController?.highlightsManager
        )

        const dataProperties = await incrementalController.getDataPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectPropertiesMap = await incrementalController.getObjectPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectProperties = Array.from(objectPropertiesMap).map(([opEntity, connectedClasses]) => {
          let opViewDataIncremental = getEntityViewDataUnfolding(opEntity, incrementalController.grapholscape, hasUnfoldings)

          return {
            entityViewData: opViewDataIncremental.entityViewData,
            loading: opViewDataIncremental.loading,
            hasUnfolding: opViewDataIncremental.hasUnfolding,
            connectedClasses: [],
            direct: connectedClasses.direct,
          } as ViewObjectPropertyUnfolding
        })

        instanceExplorer.propertiesFilterList = dataProperties
          .map(dp => getEntityViewDataUnfolding(dp, incrementalController.grapholscape, hasUnfoldings))
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

function onPathDrawingButtonClick(e: MouseEvent, ic: IncrementalController) {
  if (ic.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
    const cy = ic.grapholscape.renderer.cy as any
    if (cy && !cy.scratch('eh')) {
      let eh = cy.edgehandles()
      cy.scratch('eh', eh)
      eh.start((e.currentTarget as NodeButton).node)
      cy.on('ehcomplete', async (evt, sourceNode: NodeSingular, targetNode: NodeSingular, addedEdge: EdgeSingular) => {
        addedEdge.remove()
        const sourceIri = sourceNode.data('iri')
        const targetIri = targetNode.data('iri')
        if (sourceIri && targetIri) {
          const path = await ic.endpointController?.highlightsManager?.getShortestPath(
            sourceIri,
            targetIri
          )

          if (path && path[0]?.entities) {
            ic.addPath(path[0].entities)
          }
        }
      })

      const onStop = (ev: MouseEvent) => {
        const eh = cy.scratch('eh')
        if (eh) {
          eh.stop()
          eh.destroy()
          cy.removeScratch('eh')
          cy.removeListener('ehcomplete ehstop')
        }
        
        
        document.removeEventListener('mouseup', onStop)
      }

      document.addEventListener('mouseup', (ev: MouseEvent) => onStop(ev))
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