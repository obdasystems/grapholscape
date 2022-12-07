import GscapeEndpointSelector from "../ui/incremental-ui/endpoint-selector";
import EndpointApi from "./api/endpoint-api";
import { MastroEndpoint, RequestOptions } from "./api/model";

export default class EndpointController {

  private endpointApi: EndpointApi
  private endpointSelector: GscapeEndpointSelector = new GscapeEndpointSelector()
  private endpoints: MastroEndpoint[]
  private _onEndpointChange: (newEndpoint: MastroEndpoint) => void = (newEndpoint) => { }

  constructor(container: Element, requestOptions: RequestOptions) {
    this.endpointApi = new EndpointApi(requestOptions)
    container.appendChild(this.endpointSelector)

    this.endpointSelector.onEndpointChange(newEndpointName => {
      const newEndpoint = this.endpoints.find(e => e.name === newEndpointName)
      if (newEndpoint)
        this._onEndpointChange(newEndpoint)
    })

    this.endpointSelector.onTogglePanel = this.updateEndpointList.bind(this)
  }

  async updateEndpointList() {
    this.endpoints = await this.endpointApi.getRunningEndpoints()
    this.endpointSelector.endpoints = this.endpoints.map(e => { return { name: e.name } })
    if (this.endpoints.length === 1) {
      this.endpointSelector.selectedEndpointName = this.endpointSelector.endpoints[0].name
      this.selectedEndpoint ? this._onEndpointChange(this.selectedEndpoint) : null
    }
  }

  get selectedEndpoint () {
    return this.endpoints?.find(e => e.name === this.endpointSelector.selectedEndpointName)
  }

  onEndpointChange(callback: (newEndpoint: MastroEndpoint) => void) {
    this._onEndpointChange = callback
  }

  hideView() {
    this.endpointSelector.hide()
  }

  showView() {
    this.endpointSelector.show()
  }
}

customElements.define('gscape-endpoint-selector', GscapeEndpointSelector)