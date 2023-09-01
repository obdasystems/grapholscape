import { Position } from "cytoscape"
import { ClassInstanceEntity, TypesEnum } from "../../../model"
import { WidgetEnum } from "../../../ui"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import onHideMenu from "../on-hide-menu"
import GscapeInstanceExplorer, { AddAllEvent, ClassInstanceViewData, InstanceFilterEvent, InstanceSelectionEvent } from "./instance-explorer"

export { default as GscapeInstanceExplorer } from './instance-explorer'

export function InstanceExplorerFactory(incrementalController: IncrementalController) {
  const instancesExplorer = new GscapeInstanceExplorer()
  incrementalController.grapholscape.widgets.set(WidgetEnum.INSTANCES_EXPLORER, instancesExplorer)

  incrementalController.on(IncrementalEvent.NewInstances, (newInstances, numberResultsAvailable) => {
    instancesExplorer.addInstances((newInstances as ClassInstanceViewData[][]).map(i => {
      if (i[1]) {
        i[0].searchMatch = i[1].label?.value
      }

      i[0].connectedInstance = i[1]

      return i[0]
    }))

    if (!instancesExplorer.numberResultsAvailable && numberResultsAvailable)
      instancesExplorer.numberResultsAvailable = numberResultsAvailable
  })

  incrementalController.on(IncrementalEvent.InstancesSearchFinished, () => instancesExplorer.areInstancesLoading = false)

  incrementalController.on(IncrementalEvent.Reset, () => {
    instancesExplorer.clear()
  })

  instancesExplorer.addEventListener('instanceselection', async (e: InstanceSelectionEvent) => {
    incrementalController.performActionWithBlockedGraph(async () => {
      let addedInstanceEntity: ClassInstanceEntity | undefined
      let refNodeId: string | undefined
      let refPosition: Position | undefined
      if (instancesExplorer.referenceEntity && instancesExplorer.referenceEntityType) {
        refNodeId = incrementalController.getIDByIRI(
          instancesExplorer.referenceEntity.value.iri.fullIri,
          instancesExplorer.referenceEntityType,
        )
        if (refNodeId) {
          refPosition = incrementalController.diagram.representation?.cy.$id(refNodeId).position()
        }
      }


      addedInstanceEntity = incrementalController.addInstance(e.detail.instance, e.detail.parentClassIris, refPosition)
      const sourceId = incrementalController.getIDByIRI(e.detail.instance.iri, TypesEnum.CLASS_INSTANCE)
      if (!sourceId)
        return

      addedInstanceEntity.parentClassIris.forEach(parentClassIri => {
        const targetId = incrementalController.getIDByIRI(parentClassIri.fullIri, TypesEnum.CLASS)
        if (targetId) {
          incrementalController.addEdge(sourceId, targetId, TypesEnum.INSTANCE_OF)
        }
      })

      if (e.detail.instance.connectedInstance && e.detail.filterByProperty) {
        incrementalController.addInstance(e.detail.instance.connectedInstance, undefined, refPosition)
        const isDirect = (await (incrementalController.endpointController?.highlightsManager?.objectProperties()))
          ?.find(ops => ops.objectPropertyIRI === e.detail.filterByProperty)?.direct

        if (isDirect !== undefined) {
          isDirect
            ? incrementalController.addExtensionalObjectProperty(
              e.detail.filterByProperty,
              e.detail.instance.iri,
              e.detail.instance.connectedInstance.iri
            )
            : incrementalController.addExtensionalObjectProperty(
              e.detail.filterByProperty,
              e.detail.instance.connectedInstance.iri,
              e.detail.instance.iri
            )
        }
      }

      if (instancesExplorer.referenceEntity && instancesExplorer.referencePropertyEntity && addedInstanceEntity) { // add object property between instances
        const sourceInstanceIri = instancesExplorer.referenceEntity.value.iri.fullIri
        const objPropertyIri = instancesExplorer.referencePropertyEntity.value.iri.fullIri
        if (instancesExplorer.isPropertyDirect)
          incrementalController.addExtensionalObjectProperty(objPropertyIri, sourceInstanceIri, addedInstanceEntity.iri.fullIri)
        else
          incrementalController.addExtensionalObjectProperty(objPropertyIri, addedInstanceEntity.iri.fullIri, sourceInstanceIri)
      }
    })
  })

  instancesExplorer.addEventListener('instances-filter', async (e: InstanceFilterEvent) => {
    incrementalController.endpointController?.stopRequests('instances')
    instancesExplorer.instances = new Map()
    instancesExplorer.numberOfInstancesReceived = 0
    instancesExplorer.numberResultsAvailable = 0
    instancesExplorer.numberOfPagesShown = 1
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.referenceEntity) {
      if (instancesExplorer.referenceEntity.value.types.has(TypesEnum.CLASS)) {
        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(
          instancesExplorer.referenceEntity?.value.iri.fullIri,
          e.detail.shouldAskForLabels,
          e.detail.filterText,
          e.detail.filterByProperty,
          e.detail.propertyType,
          e.detail.direct,
        )
      }

      else if (instancesExplorer.referenceEntity.value.types.has(TypesEnum.CLASS_INSTANCE) && instancesExplorer.referencePropertyEntity) {
        // if (e.detail.filterByType) {
        //   instancesExplorer.propertiesFilterList = (await incrementalController.getDataPropertiesByClasses([e.detail.filterByType]))
        //     .map(dp => getEntityViewDataIncremental(dp, incrementalController))
        // }

        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesThroughObjectProperty(
          instancesExplorer.referenceEntity.value.iri.fullIri,
          instancesExplorer.referencePropertyEntity.value.iri.fullIri,
          instancesExplorer.isPropertyDirect,
          e.detail.shouldAskForLabels,
          e.detail.filterByType,
          e.detail.filterByProperty,
          e.detail.filterText,
        )
      }
    }
  })

  instancesExplorer.addEventListener('showmoreinstances', async (e: CustomEvent) => {
    incrementalController.endpointController?.stopRequests('instances')
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.requestId) {
      incrementalController.endpointController?.requestNewInstances(
        instancesExplorer.requestId,
        instancesExplorer.numberOfPagesShown + 1
      )
    }
  })

  instancesExplorer.addEventListener('addall', async (e: AddAllEvent) => {
    incrementalController.performActionWithBlockedGraph(async () => {
      let addedInstanceEntity: ClassInstanceEntity | undefined
      let refNodeId: string | undefined
      let refPosition: Position | undefined

      if (instancesExplorer.referenceEntity && instancesExplorer.referenceEntityType) {
        refNodeId = incrementalController.getIDByIRI(
          instancesExplorer.referenceEntity.value.iri.fullIri,
          instancesExplorer.referenceEntityType,
        )
        if (refNodeId) {
          refPosition = incrementalController.diagram.representation?.cy.$id(refNodeId).position()
        }
      }

      const objectProperties = await (incrementalController.endpointController?.highlightsManager?.objectProperties())

      e.detail.instances.forEach(async instance => {
        addedInstanceEntity = incrementalController.addInstance(instance, e.detail.parentClassIris, refPosition)

        const sourceId = incrementalController.getIDByIRI(instance.iri, TypesEnum.CLASS_INSTANCE)
        if (!sourceId)
          return

        addedInstanceEntity.parentClassIris.forEach(parentClassIri => {
          const targetId = incrementalController.getIDByIRI(parentClassIri.fullIri, TypesEnum.CLASS)
          if (targetId) {
            incrementalController.addEdge(sourceId, targetId, TypesEnum.INSTANCE_OF)
          }
        })

        if (instance.connectedInstance && e.detail.filterByProperty) {
          incrementalController.addInstance(instance.connectedInstance, undefined, refPosition)
          const isDirect = objectProperties?.find(ops => ops.objectPropertyIRI === e.detail.filterByProperty)?.direct

          if (isDirect !== undefined) {
            isDirect
              ? incrementalController.addExtensionalObjectProperty(
                e.detail.filterByProperty,
                instance.iri,
                instance.connectedInstance.iri
              )
              : incrementalController.addExtensionalObjectProperty(
                e.detail.filterByProperty,
                instance.connectedInstance.iri,
                instance.iri
              )
          }
        }
      })

      if (instancesExplorer.referenceEntity && instancesExplorer.referencePropertyEntity && addedInstanceEntity) { // add object property between instances
        const sourceInstanceIri = instancesExplorer.referenceEntity.value.iri.fullIri
        const objPropertyIri = instancesExplorer.referencePropertyEntity.value.iri.fullIri
        if (instancesExplorer.isPropertyDirect)
          incrementalController.addExtensionalObjectProperty(objPropertyIri, sourceInstanceIri, addedInstanceEntity.iri.fullIri)
        else
          incrementalController.addExtensionalObjectProperty(objPropertyIri, addedInstanceEntity.iri.fullIri, sourceInstanceIri)
      }
    })
  })

  instancesExplorer.tippyWidget.setProps({
    onHide: () => {
      instancesExplorer.hide()
      onHideMenu(instancesExplorer, incrementalController)
    }
  })

  return instancesExplorer
}