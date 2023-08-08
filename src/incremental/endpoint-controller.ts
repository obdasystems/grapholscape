import { TypesEnum } from "../model";
import { RDFGraph } from "../model/rdf-graph/swagger";
import EndpointApi from "./api/endpoint-api";
import VKGApi from "./api/kg-api";
import { MastroEndpoint, RequestOptions } from "./api/model";
import { OntologyPath } from "./api/swagger";
import HighlightsManager from "./highlights-manager";
import IncrementalLifecycle, { IncrementalEvent } from "./lifecycle";


export default class EndpointController {

  private endpointApi: EndpointApi
  private endpoints: MastroEndpoint[]
  private selectedEndpoint?: MastroEndpoint
  vkgApi?: VKGApi
  highlightsManager?: HighlightsManager
  pageSize = 100

  constructor(private requestOptions: RequestOptions, private lifecycle: IncrementalLifecycle) {
    this.endpointApi = new EndpointApi(this.requestOptions)
    this.getRunningEndpoints()
    this.setPageSize(this.pageSize)
  }

  async getRunningEndpoints(): Promise<MastroEndpoint[]> {
    this.endpoints = await this.endpointApi.getRunningEndpoints()
    return this.endpoints
  }

  async setEndpoint(endpoint: MastroEndpoint): Promise<void>
  async setEndpoint(endpointName: string): Promise<void>
  async setEndpoint(endpoint: string | MastroEndpoint) {
    const _endpoint = typeof (endpoint) === 'string' ? this.endpoints.find(e => e.name === endpoint) : endpoint

    if (_endpoint) {
      this.selectedEndpoint = _endpoint
      if (!this.vkgApi) {
        this.vkgApi = new VKGApi(this.requestOptions, _endpoint, this.pageSize)
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

  setPageSize(newPageSize: number) {
    this.pageSize = newPageSize
    if (this.vkgApi) {
      this.vkgApi.pageSize = newPageSize
      this.lifecycle.trigger(IncrementalEvent.LimitChange, newPageSize)
    }
  }

  clear() {
    this.highlightsManager?.clear()
    this.stopRequests()
  }

  stopRequests(requestType: 'instances' | 'counts' | 'all' = 'all') {
    switch (requestType) {
      case 'instances':
        this.vkgApi?.stopInstancesQueries()
        break

      case 'counts':
        this.vkgApi?.stopCountsQueries()
        break

      case 'all':
        this.vkgApi?.stopAllQueries()
        break
    }
  }

  requestInstancesForClass(
    classIri: string,
    includeLabels = true,
    searchText?: string,
    propertyIriFilter?: string,
    propertyType?: TypesEnum.OBJECT_PROPERTY | TypesEnum.DATA_PROPERTY,
    isDirect?: boolean,
  ) {

    if (searchText && propertyIriFilter && propertyType)
      return this.vkgApi?.getInstancesByPropertyValue(
        classIri,
        propertyIriFilter,
        propertyType,
        searchText,
        includeLabels,
        (classInstances, numberResultsAvailable) => this.lifecycle.trigger(IncrementalEvent.NewInstances, classInstances, numberResultsAvailable),
        isDirect,
        () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished),
      )
    else
      return this.vkgApi?.getInstances(
        classIri,
        includeLabels,
        (classInstances, numberResultsAvailable) => this.lifecycle.trigger(IncrementalEvent.NewInstances, classInstances, numberResultsAvailable),
        () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished),
        searchText
      )
  }

  requestNewInstances(requestId: string, pageNumber: number) {
    this.vkgApi?.getNewResults(
      requestId,
      pageNumber,
      (classInstances, numberResultsAvailable) => this.lifecycle.trigger(IncrementalEvent.NewInstances, classInstances, numberResultsAvailable),
      () => this.lifecycle.trigger(IncrementalEvent.InstancesSearchFinished)
    )
  }

  requestInstancesThroughObjectProperty(
    instanceIri: string,
    objectPropertyIri: string,
    isDirect = true,
    includeLabels = true,
    rangeClassIri?: string[],
    propertyIriFilter?: string,
    searchText?: string) {

    return this.vkgApi?.getInstancesThroughObjectProperty(
      instanceIri,
      objectPropertyIri,
      isDirect,
      includeLabels,
      (classInstances, numberResultsAvailable) => this.lifecycle.trigger(IncrementalEvent.NewInstances, classInstances, numberResultsAvailable),
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
    this.lifecycle.trigger(IncrementalEvent.CountStarted, classIri)
    this.vkgApi?.getInstancesNumber(
      classIri,
      (result) => this.lifecycle.trigger(IncrementalEvent.NewCountResult, classIri, { value: result, materialized: false }),
      () => this.lifecycle.trigger(IncrementalEvent.NewCountResult, classIri)
    )
  }

  shouldQueryUseLabels(queryExecutionId: string) {
    return this.vkgApi?.shouldQueryUseLabels(queryExecutionId)
  }

  async getMaterializedCounts() {
    if (this.selectedEndpoint)
      return await this.vkgApi?.getMaterializedCounts(this.selectedEndpoint)
  }

  async instanceCheck(instanceIri: string, classesToCheck: string[]) {
    this.lifecycle.trigger(IncrementalEvent.InstanceCheckingStarted, instanceIri)
    return new Promise((resolve: (value: string[]) => void) => {
      this.vkgApi?.instanceCheck(
        instanceIri,
        classesToCheck,
        (res) => {
          resolve(res)
          this.lifecycle.trigger(IncrementalEvent.InstanceCheckingFinished, instanceIri)
        },
        () => this.lifecycle.trigger(IncrementalEvent.InstanceCheckingFinished, instanceIri)
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

  requestInstancesPath(sourceInstanceIri: string, targetIri: string, path: OntologyPath) {
    return new Promise((resolve: (result?: RDFGraph) => void) => {
      this.vkgApi?.getExtensionalShortestPath(
        sourceInstanceIri,
        targetIri,
        path,
        (rdfGraph) => resolve(rdfGraph)
      )
    })
  }

  setLanguage(lang: string) {
    if (this.vkgApi)
      this.vkgApi.language = lang
  }

  isReasonerAvailable() {
    return this.selectedEndpoint !== undefined
  }

  get endpoint() { return this.selectedEndpoint }
}