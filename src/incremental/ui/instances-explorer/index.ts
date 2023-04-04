import { ClassInstanceEntity, GrapholTypesEnum } from "../../../model"
import { WidgetEnum } from "../../../ui"
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import onHideMenu from "../on-hide-menu"
import { getEntityViewDataIncremental } from "../utils"
import GscapeInstanceExplorer, { InstanceFilterEvent, InstanceSelectionEvent } from "./instance-explorer"

export { default as GscapeInstanceExplorer } from './instance-explorer'

export function InstanceExplorerFactory(incrementalController: IncrementalController) {
  const instancesExplorer = new GscapeInstanceExplorer()
  incrementalController.grapholscape.widgets.set(WidgetEnum.INSTANCES_EXPLORER, instancesExplorer)

  incrementalController.on(IncrementalEvent.NewInstances, newInstances => {
    instancesExplorer.addInstances(newInstances)
    const minNumberOfInstancesToAskMore = (incrementalController.endpointController?.limit || 10000) * instancesExplorer.numberOfPagesShown
    instancesExplorer.canShowMore = instancesExplorer.numberOfInstancesReceived >= minNumberOfInstancesToAskMore
  })

  incrementalController.on(IncrementalEvent.InstancesSearchFinished, () => instancesExplorer.areInstancesLoading = false)

  incrementalController.on(IncrementalEvent.Reset, () => {
    instancesExplorer.clear()
  })

  instancesExplorer.addEventListener('instanceselection', async (e: InstanceSelectionEvent) => {
    let addedInstanceEntity: ClassInstanceEntity | undefined

    addedInstanceEntity = incrementalController.addInstance(e.detail.instance, e.detail.parentClassIris)
    addedInstanceEntity.parentClassIris.forEach(parentClassIri => {
      incrementalController.addEdge(e.detail.instance.iri, parentClassIri.fullIri, GrapholTypesEnum.INSTANCE_OF)
    })

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
    incrementalController.endpointController?.stopRequests()
    instancesExplorer.instances = new Map()
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.referenceEntity) {
      if (instancesExplorer.referenceEntity.value.type === GrapholTypesEnum.CLASS) {
        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesForClass(
          instancesExplorer.referenceEntity?.value.iri.fullIri,
          e.detail.filterText,
          e.detail.filterByProperty
        )
      }

      else if (instancesExplorer.referenceEntity.value.type === GrapholTypesEnum.CLASS_INSTANCE && instancesExplorer.referencePropertyEntity) {
        if (e.detail.filterByType) {
          instancesExplorer.propertiesFilterList = (await incrementalController.getDataPropertiesByClasses([e.detail.filterByType]))
            .map(dp => getEntityViewDataIncremental(dp, incrementalController))
        }

        instancesExplorer.requestId = await incrementalController.endpointController?.requestInstancesForObjectPropertyRange(
          instancesExplorer.referenceEntity.value.iri.fullIri,
          instancesExplorer.referencePropertyEntity.value.iri.fullIri,
          instancesExplorer.isPropertyDirect,
          e.detail.filterByType,
          e.detail.filterByProperty,
          e.detail.filterText,
        )
      }
    }
  })

  instancesExplorer.addEventListener('showmoreinstances', async (e: CustomEvent) => {
    incrementalController.endpointController?.stopRequests()
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.requestId) {
      incrementalController.endpointController?.requestNewInstances(
        instancesExplorer.requestId,
        instancesExplorer.numberOfPagesShown + 1
      )
    }
  })

  instancesExplorer.tippyWidget.setProps({
    onHide: () => onHideMenu(instancesExplorer, incrementalController)
  })

  return instancesExplorer
}