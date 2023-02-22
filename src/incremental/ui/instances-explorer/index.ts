import { WidgetEnum } from "../../../ui"
import grapholEntityToEntityViewData from "../../../util/graphol-entity-to-entity-view-data"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import GscapeInstanceExplorer from "./instance-explorer"

export { default as GscapeInstanceExplorer } from './instance-explorer'

export function InstanceExplorerFactory(incrementalController: IncrementalController) {

  const instancesExplorer = new GscapeInstanceExplorer()
  incrementalController.grapholscape.widgets.set(WidgetEnum.INSTANCES_EXPLORER, instancesExplorer)

  incrementalController.on(IncrementalEvent.NewInstances, newInstances => {
    instancesExplorer.instances = newInstances.map(instance => 
      grapholEntityToEntityViewData(incrementalController.getClassInstanceEntity(instance.iri), incrementalController.grapholscape)
    )
  })

  incrementalController.on(IncrementalEvent.Reset, () => {
    instancesExplorer.instances = []
    instancesExplorer.areInstancesLoading = false
  })


  instancesExplorer.onEntitySearch = (searchText) => {
    console.log(searchText)
  }

  instancesExplorer.onEntitySearchByDataPropertyValue = (dataPropertyIri, searchText) => {
    console.log(dataPropertyIri, searchText)
  }

  return instancesExplorer
}