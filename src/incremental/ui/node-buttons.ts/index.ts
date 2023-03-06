import { ClassInstanceEntity, GrapholEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../../model";
import { icons, WidgetEnum } from "../../../ui";
import getIconSlot from "../../../ui/util/get-icon-slot";
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
import { GscapeInstanceExplorer } from "../instances-explorer";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
import showMenu from "../show-menu";
import LoadingBadge from "./loading-badge";
import NodeButton from "./node-button";

export function NodeButtonsFactory(incrementalController: IncrementalController) {

  const instancesButton = new NodeButton()
  instancesButton.appendChild(getIconSlot('icon', icons.entityIcons["class-instance"]))
  instancesButton.style.setProperty('--gscape-border-radius-btn', '50%')
  instancesButton.title = 'Search instances'

  const objectPropertyButton = new NodeButton()
  objectPropertyButton.appendChild(getIconSlot('icon', icons.entityIcons["object-property"]))
  objectPropertyButton.style.setProperty('--gscape-border-radius-btn', '50%')
  objectPropertyButton.title = 'Navigate through object properties'

  const nodeButtonsMap = new Map<GrapholTypesEnum, NodeButton[]>()
  nodeButtonsMap.set(GrapholTypesEnum.CLASS, [instancesButton, objectPropertyButton])
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
    }
  })


  incrementalController.on(IncrementalEvent.InstanceCheckingStarted, (instanceIri) => {
    const cyNode = incrementalController.incrementalDiagram.representation?.cy.$id(instanceIri)
    if (cyNode) {
      const _loadingButton = new LoadingBadge()
      cyNode.addClass('unknown-parent-class')
      cyNode.scratch('loading-button', _loadingButton)
      cyNode.scratch('update-loading-button-position', () => {
        _loadingButton.attachTo((cyNode as any).popperRef())
      })
      _loadingButton.cxtWidgetProps.offset = info => getButtonOffset(info)

      // update badge position on node moving around and on viewport pan state change
      cyNode.on('position', cyNode.scratch('update-loading-button-position'))
      cyNode.cy().on('pan', cyNode.scratch('update-loading-button-position'))
      cyNode.scratch('update-loading-button-position')()
    }
  })

  incrementalController.on(IncrementalEvent.InstanceCheckingFinished, (instanceIri) => {
    const cyNode = incrementalController.incrementalDiagram.representation?.cy.$id(instanceIri)

    if (cyNode && cyNode.scratch('loading-button')) {
      (cyNode.scratch('loading-button') as NodeButton).remove()
      cyNode.removeClass('unknown-parent-class')
      cyNode.removeScratch('loading-button')
      cyNode.removeListener('position', cyNode.scratch('update-loading-button-positon'))
      cyNode.cy().removeListener('pan', cyNode.scratch('update-loading-button-position'))
      cyNode.removeScratch('update-loading-button-position')
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
        btn.attachTo(targetNode.popperRef());
      })
    }
  })

  cy.on('mouseout', 'node', e => {
    nodeButtons.forEach((buttons, _) => buttons.forEach(btn => {
      btn.hide()
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

      if ((referenceEnity as ClassInstanceEntity).parentClassIris) {
        const parentClassesIris = (referenceEnity as ClassInstanceEntity).parentClassIris!.map(i => i.fullIri)
        objectProperties = await incrementalController.getObjectPropertiesByClasses(parentClassesIris)
      }
    }

    navigationMenu.objectProperties = Array.from(objectProperties).map(v => {
      return {
        objectProperty: grapholEntityToEntityViewData(v[0], incrementalController.grapholscape),
        connectedClasses: v[1].list.map(classEntity => {
          return grapholEntityToEntityViewData(classEntity, incrementalController.grapholscape)
        }),
        direct: v[1].direct,
      }
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
      if (!instanceExplorer.referenceEntity || !instanceExplorer.referenceEntity.value.iri.equals(referenceEntity.iri)) {
        instanceExplorer.clear()

        instanceExplorer.areInstancesLoading = true
        instanceExplorer.referenceEntity = grapholEntityToEntityViewData(referenceEntity, incrementalController.grapholscape)
        const dataProperties = await incrementalController.getDataPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectPropertiesMap = await incrementalController.getObjectPropertiesByClasses([referenceEntity.iri.fullIri])
        const objectProperties = Array.from(objectPropertiesMap).map(([opEntity, _]) => opEntity)

        instanceExplorer.searchFilterList = dataProperties
          .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
          .concat(objectProperties.map(op => grapholEntityToEntityViewData(op, incrementalController.grapholscape)))
          .sort((a, b) => a.displayedName.localeCompare(b.displayedName))

        instanceExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(referenceEntity.iri.fullIri)
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