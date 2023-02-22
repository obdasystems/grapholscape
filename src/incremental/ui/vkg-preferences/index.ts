import { RendererStatesEnum } from "../../../model"
import { GscapeConfirmDialog, WidgetEnum } from "../../../ui"
import IncrementalController from "../../controller"
import { IncrementalEvent } from "../../lifecycle"
import GscapeVKGPreferences from "./vkg-preferences"

export { default as GscapeVKGPreferences } from './vkg-preferences'

export function VKGPreferencesFactory(incrementalController: IncrementalController) {
  const vkgPreferences = new GscapeVKGPreferences()

  incrementalController.grapholscape.widgets.set(WidgetEnum.VKG_PREFERENCES, vkgPreferences)
  incrementalController.grapholscape.uiContainer?.querySelector('.gscape-ui-buttons-tray')?.appendChild(vkgPreferences)

  if (incrementalController.grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
    vkgPreferences.hide()

  // Starting data
  setEndpointList()

  incrementalController.on(IncrementalEvent.EndpointChange, newEndpoint => {
    vkgPreferences.selectedEndpointName = newEndpoint.name
  })

  incrementalController.on(IncrementalEvent.LimitChange, limit => {
    vkgPreferences.limit = limit
  })

  vkgPreferences.onTogglePanel = () => setEndpointList()

  vkgPreferences.onEndpointChange(newEndpointName => {
    const confirmDialog = new GscapeConfirmDialog(`Are you sure? \nIf you change the current endpoint, your exploration will be reset.`)
    incrementalController.grapholscape.uiContainer?.appendChild(confirmDialog)
    confirmDialog.show()
    confirmDialog.onConfirm = async () => {
      incrementalController.reset()
      const endpoints = await incrementalController.getRunningEndpoints()
      const newEndpoint = endpoints.find(e => e.name === newEndpointName)

      if (newEndpoint)
        incrementalController.setEndpoint(newEndpoint)
    }
  })

  vkgPreferences.onLimitChange(limit => {
    incrementalController.setLimit(limit)
  })

  function setEndpointList() {
    incrementalController.getRunningEndpoints().then(endpoints => {
      vkgPreferences.endpoints = endpoints.map(e => {
        return {
          name: e.name
        }
      }).sort((a,b) => a.name.localeCompare(b.name))

      if (endpoints.length >= 1 && !vkgPreferences.selectedEndpointName) {
        incrementalController.setEndpoint(endpoints[0])
      }
    })
  }

  return vkgPreferences
}