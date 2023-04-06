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
  limit = 10

  constructor(private requestOptions: RequestOptions, private lifecycle: IncrementalLifecycle) {
    this.endpointApi = new EndpointApi(this.requestOptions)
    this.getRunningEndpoints()
    this.setLimit(this.limit)
  }

  async getRunningEndpoints(): Promise<MastroEndpoint[]> {
    this.endpoints = await this.endpointApi.getRunningEndpoints()
    return this.endpoints
  }

  async setEndpoint(endpoint: MastroEndpoint): Promise<void>
  async setEndpoint(endpointName: string): Promise<void>
  async setEndpoint(endpoint: string | MastroEndpoint) {
    const _endpoint = typeof(endpoint) === 'string' ? this.endpoints.find(e => e.name === endpoint) : endpoint

    if (_endpoint) {
      this.selectedEndpoint = _endpoint
      if (!this.vkgApi) {
        this.vkgApi = new VKGApi(this.requestOptions, _endpoint, this.limit)
      } else {
        this.vkgApi.setEndpoint(_endpoint)
      }

      const emptyUnfoldingEntities = await this.vkgApi.getEntitiesEmptyUnfoldings(_endpoint)
      this.highlightsManager = new HighlightsManager(this.vkgApi, emptyUnfoldingEntities)

      this.lifecycle.trigger(IncrementalEvent.EndpointChange, _endpoint)
    } else {
      console.warn(`[VKG-API] The endpoint you tried to set cannot be found`)
    }
  }

  setLimit(limit: number) {
    this.limit = limit
    if (this.vkgApi) {
      this.vkgApi.pageSize = limit
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

  requestInstancesForClass(classIri: string, searchText?: string, propertyIriFilter?: string) {  
    if (searchText && propertyIriFilter)
      return this.vkgApi?.getInstancesByPropertyValue(
        classIri,
        propertyIriFilter,
        searchText,
        (result) => this.lifecycle.trigger(IncrementalEvent.NewInstances, result),
        () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished),
      )
    else
      return this.vkgApi?.getInstances(
        classIri,
        (result) => this.lifecycle.trigger(IncrementalEvent.NewInstances, result),
        () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished),
        searchText
      )
  }

  requestNewInstances(requestId: string, pageNumber: number) {
    this.vkgApi?.getNewResults(
      requestId,
      pageNumber,
      (result) => this.lifecycle.trigger(IncrementalEvent.NewInstances, result),
      () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished)
    )
  }

  requestInstancesForObjectPropertyRange(instanceIri: string, objectPropertyIri: string, isDirect = true, rangeClassIri?: string, propertyIriFilter?: string, searchText?: string) {
    return this.vkgApi?.getInstanceObjectPropertyRanges(
      instanceIri,
      objectPropertyIri,
      isDirect,
      (result) => this.lifecycle.trigger(IncrementalEvent.NewInstances, result),
      rangeClassIri,
      propertyIriFilter,
      searchText,
      () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished)
    )
  }

  requestDataPropertyValues(instanceIri: string, dataPropertyIri: string) {
    this.vkgApi?.getInstanceDataPropertyValues(
      instanceIri,
      dataPropertyIri,
      (newValues) => this.lifecycle.trigger(IncrementalEvent.NewDataPropertyValues, instanceIri, dataPropertyIri, newValues),
      () => this.lifecycle.trigger(IncrementalEvent.DataPropertyValuesLoadingFinished, instanceIri, dataPropertyIri)
    )
  }

  requestCountForClass(classIri: string) {
    this.vkgApi?.getInstancesNumber(
      classIri,
      (result) => this.lifecycle.trigger(IncrementalEvent.NewCountResult, classIri, result),
      () => this.lifecycle.trigger(IncrementalEvent.NewCountResult, classIri)
    )
  }

  async instanceCheck(instanceIri: string, classesToCheck: string[]) {
    this.lifecycle.trigger(IncrementalEvent.InstanceCheckingStarted, instanceIri)
    return new Promise((resolve: (value: string[]) => void, reject) => {
      this.vkgApi?.instanceCheck(
        instanceIri,
        classesToCheck,
        (res) => {
          resolve(res)
          this.lifecycle.trigger(IncrementalEvent.InstanceCheckingFinished, instanceIri)
        },
        reject
      )
    })
  }

  async requestLabels(instanceIri: string) {
    return new Promise((resolve: (result: { value: string, language?: string }[]) => void, reject) => {
      this.vkgApi?.getInstanceLabels(
        instanceIri,
        (res) => resolve(res)
      )
    })
  }

  setLanguage(lang: string) {
    if (this.vkgApi)
      this.vkgApi.language = lang
  }
}