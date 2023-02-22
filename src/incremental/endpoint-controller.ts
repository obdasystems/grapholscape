import EndpointApi from "./api/endpoint-api";
import VKGApi from "./api/kg-api";
import { MastroEndpoint, MastroID, RequestOptions } from "./api/model";
import HighlightsManager from "./highlights-manager";
import IncrementalLifecycle, { IncrementalEvent } from "./lifecycle";


export default class EndpointController {

  private endpointApi: EndpointApi
  private endpoints: MastroEndpoint[]
  private selectedEndpoint?: MastroEndpoint
  private vkgApi?: VKGApi
  highlightsManager?: HighlightsManager

  constructor(private requestOptions: RequestOptions, private lifecycle: IncrementalLifecycle) {
    this.endpointApi = new EndpointApi(this.requestOptions)
    this.getRunningEndpoints()
  }

  async getRunningEndpoints(): Promise<MastroEndpoint[]> {
    this.endpoints = await this.endpointApi.getRunningEndpoints()
    return this.endpoints
  }

  setEndpoint(endpoint: MastroEndpoint): void
  setEndpoint(endpointName: string): void
  setEndpoint(endpoint: string | MastroEndpoint) {
    const _endpoint = typeof(endpoint) === 'string' ? this.endpoints.find(e => e.name === endpoint) : endpoint

    if (_endpoint) {
      this.selectedEndpoint = _endpoint
      if (!this.vkgApi) {
        this.vkgApi = new VKGApi(this.requestOptions, _endpoint)
        this.highlightsManager = new HighlightsManager(this.vkgApi)
      } else {
        this.vkgApi.setEndpoint(_endpoint)
      }
      this.lifecycle.trigger(IncrementalEvent.EndpointChange, _endpoint)
    } else {
      console.warn(`[VKG-API] The endpoint you tried to set cannot be found`)
    }
  }

  setLimit(limit: number) {
    if (this.vkgApi) {
      this.vkgApi.limit = limit
      this.lifecycle.trigger(IncrementalEvent.LimitChange, limit)
    }
  }

  clear() {
    this.highlightsManager?.clear()
    this.stopRequests()
  }

  stopRequests() {
    this.vkgApi?.stopAllQueries()
  }

  // get selectedEndpoint() {
  //   return this.endpoints?.find(e => e.name === this.endpointSelector.selectedEndpointName)
  // }
  // set selectedEndpoint(newEndpoint: MastroEndpoint | undefined) {
  //   if (newEndpoint)
  //     this.endpointSelector.selectedEndpointName = newEndpoint.name
  // }

  // onEndpointChange(callback: (newEndpoint: MastroEndpoint) => void) {
  //   this._onEndpointChange = callback
  // }

  // onAutoEndpointSelection(callback: (newEndpoint: MastroEndpoint) => void) {
  //   this._onAutoEndpointSelection = callback
  // }


}