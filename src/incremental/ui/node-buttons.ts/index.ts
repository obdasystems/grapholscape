import { NodeSingular } from "cytoscape";
import { ClassInstanceEntity, GrapholEntity, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum } from "../../../model";
import { icons, WidgetEnum } from "../../../ui";
import getIconSlot from "../../../ui/util/get-icon-slot";
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data";
import IncrementalController from "../../controller";
import { IncrementalEvent } from "../../lifecycle";
import { ObjectPropertyConnectedClasses } from "../../neighbourhood-finder";
import { GscapeInstanceExplorer } from "../instances-explorer";
import GscapeNavigationMenu from "../navigation-menu/navigation-menu";
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

}

function setHandlersOnIncrementalCytoscape(cy: cytoscape.Core, nodeButtons: Map<GrapholTypesEnum, NodeButton[]>) {
  if (cy.scratch('_gscape-graph-incremental-handlers-set'))
    return

  cy.on('mouseover', 'node', e => {
    const targetNode = e.target
    const targetType = targetNode.data().type

    if (targetType === GrapholTypesEnum.CLASS || targetType === GrapholTypesEnum.CLASS_INSTANCE) {
      nodeButtons.get(targetType)?.forEach((btn, i) => {
        // set position relative to default placemente (right)
        btn.cxtWidgetProps.offset = (info) => {
          const btnHeight = info.popper.height + 4
          const btnWidth = info.popper.width
          return [
            -(btnHeight / 2) - (i * btnHeight) + (btnHeight * (nodeButtons.get(targetType)!.length / 2)), // y
            -btnWidth / 2 // x
          ]
        }

        btn.node = targetNode
        btn.attachTo(targetNode.popperRef());
      })
    }
  })

  cy.on('mouseout', 'node', e => {
    nodeButtons.forEach((buttons, _) => buttons.forEach(btn => {
      btn.node = undefined
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
      

      objectProperties = await incrementalController.getObjectPropertiesByClass(targetButton.node.data().iri)
    }

    if (targetButton.node.data().type === GrapholTypesEnum.CLASS_INSTANCE) {
      referenceEnity = incrementalController.classInstanceEntities.get(targetButton.node.data().iri)
      if (!referenceEnity)
        return

      navigationMenu.referenceEntity = grapholEntityToEntityViewData(referenceEnity, incrementalController.grapholscape)

      const [parentClassIri] = (referenceEnity as ClassInstanceEntity).parentClassIris
      objectProperties = await incrementalController.getObjectPropertiesByClass(parentClassIri.fullIri)
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
      navigationMenu.attachTo((targetButton.node as any).popperRef())
      navigationMenu.popperRef = (targetButton.node as any).popperRef()
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
        const dataProperties = await incrementalController.getDataPropertiesByClass(referenceEntity.iri.fullIri)
        const objectPropertiesMap = await incrementalController.getObjectPropertiesByClass(referenceEntity.iri.fullIri)
        const objectProperties = Array.from(objectPropertiesMap).map(([opEntity, _]) => opEntity)

        instanceExplorer.searchFilterList = dataProperties
          .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))
          .concat(objectProperties.map(op => grapholEntityToEntityViewData(op, incrementalController.grapholscape)))
          .sort((a, b) => a.displayedName.localeCompare(b.displayedName))

        incrementalController.endpointController?.requestInstancesForClass(referenceEntity.iri.fullIri)
      }
    }

    // TODO: check why sometimes here targetButton.node is undefined, happens only few times
    // it should be defined due to previous initial if
    if (targetButton.node) {
      instanceExplorer.attachTo((targetButton.node as any).popperRef())
      instanceExplorer.popperRef = (targetButton.node as any).popperRef()
    }
  }
}