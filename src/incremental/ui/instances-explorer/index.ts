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

  instancesExplorer.addEventListener('instanceselection', (e: InstanceSelectionEvent) => {
    incrementalController.performActionWithBlockedGraph(() => {
      incrementalController.addInstance(e.detail.instance, e.detail.parentClassIris[0])
      incrementalController.addEdge(e.detail.instance.iri, e.detail.parentClassIris[0], GrapholTypesEnum.INSTANCE_OF)
    })
  })


  instancesExplorer.addEventListener('instances-filter', (e: InstanceFilterEvent) => {
    incrementalController.endpointController?.stopRequests()
    instancesExplorer.instances = []
    instancesExplorer.areInstancesLoading = true

    if (instancesExplorer.referenceEntity) {
      incrementalController.endpointController?.requestInstancesForClass(
        instancesExplorer.referenceEntity?.value.iri.fullIri,
        e.detail.filterText,
        e.detail.filterByProperty
      )
    }
  })

  return instancesExplorer
}