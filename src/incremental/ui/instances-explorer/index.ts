import { ClassInstanceEntity, GrapholTypesEnum } from "../../../model"
import { WidgetEnum } from "../../../ui"
import { ClassInstance } from "../../api/kg-api"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import onHideMenu from "../on-hide-menu"
import GscapeInstanceExplorer, { ClassInstanceViewData, InstanceFilterEvent, InstanceSelectionEvent } from "./instance-explorer"

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
    let addedInstanceEntity: ClassInstanceEntity | undefined

    addedInstanceEntity = incrementalController.addInstance(e.detail.instance, e.detail.parentClassIris)
    addedInstanceEntity.parentClassIris.forEach(parentClassIri => {
      incrementalController.addEdge(
        `${e.detail.instance.iri}-${GrapholTypesEnum.CLASS_INSTANCE}`,
        `${parentClassIri.fullIri}-${GrapholTypesEnum.CLASS}`,
        GrapholTypesEnum.INSTANCE_OF
      )
    })

    if (e.detail.instance.connectedInstance && e.detail.filterByProperty) {
      incrementalController.addInstance(e.detail.instance.connectedInstance)
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

    incrementalController.runLayout()
  })

  instancesExplorer.addEventListener('instances-filter', async (e: InstanceFilterEvent) => {
    incrementalController.endpointController?.stopRequests('instances')
    instancesExplorer.instances = new Map()
    instancesExplorer.numberOfInstancesReceived = 0
    instancesExplorer.numberResultsAvailable = 0
    instancesExplorer.numberOfPagesShown = 1
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.referenceEntity) {
      if (instancesExplorer.referenceEntity.value.types.has(GrapholTypesEnum.CLASS)) {
        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(
          instancesExplorer.referenceEntity?.value.iri.fullIri,
          e.detail.shouldAskForLabels,
          e.detail.filterText,
          e.detail.filterByProperty,
          e.detail.propertyType,
          e.detail.direct,
        )
      }

      else if (instancesExplorer.referenceEntity.value.types.has(GrapholTypesEnum.CLASS_INSTANCE) && instancesExplorer.referencePropertyEntity) {
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

  instancesExplorer.tippyWidget.setProps({
    onHide: () => {
      instancesExplorer.hide()
      onHideMenu(instancesExplorer, incrementalController)
    }
  })

  return instancesExplorer
}