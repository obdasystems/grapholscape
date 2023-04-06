import { RendererStatesEnum } from "../../../model"
import { GscapeConfirmDialog, WidgetEnum } from "../../../ui"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import GscapeVKGPreferences from "./vkg-preferences"

export { default as GscapeVKGPreferences } from './vkg-preferences'

export function VKGPreferencesFactory(incrementalController: IncrementalController) {
  const vkgPreferences = new GscapeVKGPreferences()
  vkgPreferences.showCounters = incrementalController.countersEnabled
  incrementalController.grapholscape.widgets.set(WidgetEnum.VKG_PREFERENCES, vkgPreferences)
  incrementalController.grapholscape.uiContainer?.querySelector('.gscape-ui-buttons-tray')?.appendChild(vkgPreferences)

  if (incrementalController.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL || !incrementalController.endpointController)
    vkgPreferences.disable()

  if (incrementalController.endpointController) {
    // Starting data
    setEndpointList()
  }

  incrementalController.on(IncrementalEvent.EndpointChange, newEndpoint => {
    vkgPreferences.selectedEndpointName = newEndpoint.name
  })

  incrementalController.on(IncrementalEvent.LimitChange, limit => {
    vkgPreferences.limit = limit
  })

  incrementalController.on(IncrementalEvent.ReasonerSet, () => {
    if (incrementalController.grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      vkgPreferences.enable()
    }

    setEndpointList()
    vkgPreferences.limit = incrementalController.endpointController?.limit || 100
  })

  vkgPreferences.onTogglePanel = () => setEndpointList()

  vkgPreferences.onEndpointChange(newEndpointName => {
    const confirmDialog = new GscapeConfirmDialog(`Are you sure? \nIf you change the current endpoint, your exploration will be reset.`)
    incrementalController.grapholscape.uiContainer?.appendChild(confirmDialog)
    confirmDialog.show()
    confirmDialog.onConfirm = async () => {
      incrementalController.reset()
      incrementalController.endpointController?.setEndpoint(newEndpointName)
      incrementalController.endpointController?.setLanguage(incrementalController.grapholscape.language)
    }
  })

  vkgPreferences.onLimitChange(limit => {
    incrementalController.endpointController?.setLimit(limit)
  })

  vkgPreferences.onShowCountersChange(state => {
    incrementalController.countersEnabled = state
  })

  vkgPreferences.onStopRequests(() => incrementalController.endpointController?.stopRequests())

  function setEndpointList() {
    incrementalController.endpointController?.getRunningEndpoints().then(endpoints => {
      vkgPreferences.endpoints = endpoints.map(e => {
        return {
          name: e.name
        }
      }).sort((a, b) => a.name.localeCompare(b.name))

      if (endpoints.length >= 1 && !vkgPreferences.selectedEndpointName) {
        incrementalController.endpointController?.setEndpoint(endpoints[0])
        incrementalController.endpointController?.setLanguage(incrementalController.grapholscape.language)
      }
    })
  }

  return vkgPreferences
}