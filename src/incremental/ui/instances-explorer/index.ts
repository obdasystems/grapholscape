import { Annotation, AnnotationsKind, ClassInstanceEntity, GrapholTypesEnum, Iri } from "../../../model"
import { WidgetEnum } from "../../../ui"
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import GscapeInstanceExplorer, { InstanceFilterEvent, InstanceSelectionEvent } from "./instance-explorer"

export { default as GscapeInstanceExplorer } from './instance-explorer'

export function InstanceExplorerFactory(incrementalController: IncrementalController) {

  const instancesExplorer = new GscapeInstanceExplorer()
  incrementalController.grapholscape.widgets.set(WidgetEnum.INSTANCES_EXPLORER, instancesExplorer)

  incrementalController.on(IncrementalEvent.NewInstances, newInstances => instancesExplorer.instances = newInstances)

  incrementalController.on(IncrementalEvent.InstancesSearchFinished, () => instancesExplorer.areInstancesLoading = false)

  incrementalController.on(IncrementalEvent.Reset, () => {
    instancesExplorer.clear()
  })

  instancesExplorer.addEventListener('instanceselection', async (e: InstanceSelectionEvent) => {
    let addedInstanceEntity: ClassInstanceEntity | undefined

    addedInstanceEntity = await incrementalController.addInstance(e.detail.instance, e.detail.parentClassIris)
    if (addedInstanceEntity) {
      incrementalController.addEdge(e.detail.instance.iri, addedInstanceEntity.parentClassIri.fullIri, GrapholTypesEnum.INSTANCE_OF)
    }

    if (instancesExplorer.referenceEntity && instancesExplorer.referencePropertyEntity && addedInstanceEntity) { // add object property between instances
      const sourceInstanceIri = instancesExplorer.referenceEntity.value.iri.fullIri
      const objPropertyIri = instancesExplorer.referencePropertyEntity.value.iri.fullIri
      if (instancesExplorer.isPropertyDirect)
        incrementalController.addExtensionalObjectProperty(objPropertyIri, sourceInstanceIri, addedInstanceEntity.iri.fullIri)
      else
        incrementalController.addExtensionalObjectProperty(objPropertyIri, addedInstanceEntity.iri.fullIri, sourceInstanceIri)
    }

    instancesExplorer.setInstanceAdProcessed(e.detail.instance.iri)
    incrementalController.runLayout()
  })


  instancesExplorer.addEventListener('instances-filter', async (e: InstanceFilterEvent) => {
    incrementalController.endpointController?.stopRequests()
    instancesExplorer.instances = []
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.referenceEntity) {
      if (instancesExplorer.referenceEntity.value.type === GrapholTypesEnum.CLASS) {
        incrementalController.endpointController?.requestInstancesForClass(
          instancesExplorer.referenceEntity?.value.iri.fullIri,
          e.detail.filterText,
          e.detail.filterByProperty
        )
      }

      else if (instancesExplorer.referenceEntity.value.type === GrapholTypesEnum.CLASS_INSTANCE && instancesExplorer.referencePropertyEntity) {
        if (e.detail.filterByType)
          instancesExplorer.searchFilterList = (await incrementalController.getDataPropertiesByClass(e.detail.filterByType))
            .map(dp => grapholEntityToEntityViewData(dp, incrementalController.grapholscape))

        incrementalController.endpointController?.requestInstancesForObjectPropertyRange(
          instancesExplorer.referenceEntity.value.iri.fullIri,
          instancesExplorer.referencePropertyEntity.value.iri.fullIri,
          instancesExplorer.isPropertyDirect,
          e.detail.filterByType,
          e.detail.filterText,
        )
      }
    }
  })

  instancesExplorer.tippyWidget.setProps({
    onHide: () => incrementalController.endpointController?.stopRequests()
  })

  return instancesExplorer
}