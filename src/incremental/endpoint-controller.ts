import EndpointApi from "./api/endpoint-api";
import { MastroEndpoint, RequestOptions } from "./api/model";

/**
export default class EndpointController {

  private endpointApi: EndpointApi
  private endpointSelector: GscapeVKGPreferences = new GscapeVKGPreferences()
  private endpoints: MastroEndpoint[]
  private _onEndpointChange: (newEndpoint: MastroEndpoint) => void = (newEndpoint) => { }
  private _onAutoEndpointSelection: (newEndpoint: MastroEndpoint) => void = (newEndpoint) => { }

  constructor(container: Element, requestOptions: RequestOptions) {
    this.endpointApi = new EndpointApi(requestOptions)
    container.appendChild(this.endpointSelector)

    this.endpointSelector.onEndpointChange(newEndpointName => {
      const newEndpoint = this.endpoints.find(e => e.name === newEndpointName)
      if (newEndpoint) {
        this._onEndpointChange(newEndpoint)
        //this.endpointSelector.selectedEndpointName = newEndpoint.name
      }
    })

    this.endpointSelector.onTogglePanel = this.updateEndpointList.bind(this)
  }

  async updateEndpointList() {
    this.endpoints = await this.endpointApi.getRunningEndpoints()
    this.endpointSelector.endpoints = this.endpoints.map(e => { return { name: e.name } }).sort((a,b) => a.name.localeCompare(b.name))
    if (this.endpoints.length >= 1 && !this.endpointSelector.selectedEndpointName) {
      this.endpointSelector.selectedEndpointName = this.endpointSelector.endpoints[0].name
      this.selectedEndpoint ? this._onAutoEndpointSelection(this.selectedEndpoint) : null
    }
  }

  get selectedEndpoint() {
    return this.endpoints?.find(e => e.name === this.endpointSelector.selectedEndpointName)
  }
  set selectedEndpoint(newEndpoint: MastroEndpoint | undefined) {
    if (newEndpoint)
      this.endpointSelector.selectedEndpointName = newEndpoint.name
  }

  onEndpointChange(callback: (newEndpoint: MastroEndpoint) => void) {
    this._onEndpointChange = callback
  }

  onAutoEndpointSelection(callback: (newEndpoint: MastroEndpoint) => void) {
    this._onAutoEndpointSelection = callback
  }

  onLimitChange(callback: (newLimit: number) => void) {
    this.endpointSelector.onLimitChange(callback)
  }

  onStopRequests(callback: () => void) {
    this.endpointSelector.onStopRequests(callback)
  }

  hideView() {
    this.endpointSelector.hide()
  }

  showView() {
    this.endpointSelector.show()
  }
}

customElements.define('gscape-endpoint-selector', GscapeVKGPreferences)
*/