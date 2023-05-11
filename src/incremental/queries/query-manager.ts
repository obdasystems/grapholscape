import handleApiCall from "../api/handle-api-call"
import { MastroEndpoint, QuerySemantics, QueryStatusEnum, RequestOptions } from "../api/model"
import InstanceCheckingPoller from "./instance-checking-poller"
import { QueryCountStatePoller, QueryResultsPoller, QueryStatusPoller } from "./query-poller"

export default class QueryManager {
  private _prefixes?: Promise<string> = new Promise(() => { })
  private _runningQueryPollerByExecutionId: Map<string, { resultPollers: Set<QueryResultsPoller>, statusPollers: Set<QueryStatusPoller> }> = new Map()
  private _runningCountQueryPollerByExecutionId: Map<string, QueryCountStatePoller> = new Map()
  private _runningInstanceCheckingPollerByThreadId: Map<string, InstanceCheckingPoller> = new Map()

  constructor(private requestOptions: RequestOptions, private endpoint: MastroEndpoint) {
    this.requestOptions.headers['content-type'] = 'application/json'

    this._prefixes = new Promise((resolve) => {
      handleApiCall(
        fetch(this.prefixesPath, {
          method: 'get',
          headers: this.requestOptions.headers,
        }),
        this.onError
      ).then(async response => {
        const prefixesResponse = await response.json()

        resolve(prefixesResponse.map((p: { name: any; namespace: any }) =>
          `PREFIX ${p.name} <${p.namespace}>`).join('\n')
        )
      })
    })
  }

  /**
   * Start the query using the result route.
   * The QueryResultPoller will poll the query results.
   * @param queryCode 
   * @param pageSize the maximum number of results to retrieve
   * @param querySemantics either use conjunctive queries evaluation or full SPARQL. default: **CQ**
   * @param keepAlive keep query running even if stopRunningQueries gets invoked. default: **False**
   * @returns a promise which will be resolved with the query poller, on this
   * object you can set the onNewResults callback to react every time new results
   * are obtained.
   */
  async performQuery(queryCode: string, pageSize: number, querySemantics: QuerySemantics = QuerySemantics.CQ, keepAlive = false): Promise<QueryResultsPoller> {
    const executionId = await this.startQuery(queryCode, querySemantics)

    // return this.getQueryResults(executionId, pageSize, pageNumber)
    const queryResultsPoller = new QueryResultsPoller(this.getQueryResultRequest(executionId, pageSize, 1), pageSize, executionId)
    if (!keepAlive) {
      const pollers = this._runningQueryPollerByExecutionId.get(executionId)
      if (pollers) {
        pollers.resultPollers.add(queryResultsPoller)
      } else {
        this._runningQueryPollerByExecutionId.set(executionId, {
          resultPollers: new Set([queryResultsPoller]),
          statusPollers: new Set(),
        })
      }
    }

    queryResultsPoller.onError = this.requestOptions.onError

    const queryStatusPoller = new QueryStatusPoller(this.getQueryStatusRequest(executionId))
    this._runningQueryPollerByExecutionId.get(executionId)?.statusPollers.add(queryStatusPoller)

    queryStatusPoller.start()
    queryStatusPoller.onNewResults = (result) => {
      queryResultsPoller.numberResultsAvailable = result.numResults
      if (result.status !== QueryStatusEnum.RUNNING) {
        queryResultsPoller.stop()
        this._runningQueryPollerByExecutionId.delete(executionId)
        queryStatusPoller.stop()
      }
    }

    queryStatusPoller.onError = (errors) => {
      for (let error of errors)
        this.requestOptions.onError(error)

      queryResultsPoller.stop()
      this._runningQueryPollerByExecutionId.delete(executionId)
    }

    // queryStatusPoller.onStop = () => {
    //   this._runningQueryStatePollerByExecutionId.delete(executionId)
    // }

    return queryResultsPoller
  }

  async getQueryResults(executionId: string, pageSize: number, pageNumber: number): Promise<QueryResultsPoller> {
    const queryResultsPoller = new QueryResultsPoller(this.getQueryResultRequest(executionId, pageSize, pageNumber), pageSize, executionId)

    const pollers = this._runningQueryPollerByExecutionId.get(executionId)
    if (pollers) {
      pollers.resultPollers.add(queryResultsPoller)
    } else {
      this._runningQueryPollerByExecutionId.set(executionId, {
        resultPollers: new Set([queryResultsPoller]),
        statusPollers: new Set(),
      })
    }

    queryResultsPoller.onError = this.requestOptions.onError

    // const queryStatusPoller = new QueryStatusPoller(this.getQueryStatusRequest(executionId))

    // queryStatusPoller.onNewResults = (result) => {
    //   if (result.status !== QueryStatusEnum.RUNNING) {
    //     // queryResultsPoller.stop()
    //     // this._runningQueryPollerByExecutionId.get(executionId)?.delete(queryResultsPoller)
    //     // if (this._runningQueryPollerByExecutionId.get(executionId)?.size === 0) {
    //     //   this._runningQueryPollerByExecutionId.delete(executionId)
    //     // }

    //     queryStatusPoller.stop()
    //   }
    // }

    // queryStatusPoller.onError = (errors) => {
    //   for (let error of errors)
    //     this.requestOptions.onError(error)

    //   queryResultsPoller.stop()
    //   this._runningQueryPollerByExecutionId.delete(executionId)
    // }

    // queryStatusPoller.start()

    return queryResultsPoller
  }

  /**
   * Start the query using count route, then QueryCountStatePoller
   * will poll for the query state, when it receives the finished state,
   * it yield the result back to the callback onNewResults.
   * In this callback a fetch to the result route will retrieve the
   * actual result and resolve the promise.
   * @param queryCode 
   * @returns a promise which will be resolved with the result
   */
  async performQueryCount(queryCode: string, onStopCallback?: () => void): Promise<number> {
    const executionId = await this.startQuery(queryCode, QuerySemantics.CQ, true)
    const countStatePoller = new QueryCountStatePoller(this.getQueryCountStatusRequest(executionId))

    this._runningCountQueryPollerByExecutionId.set(executionId, countStatePoller)

    return new Promise((resolve, reject) => {
      countStatePoller.onNewResults = (state) => {
        if (state === QueryCountStatePoller.QUERY_STATUS_FINISHED && this._runningCountQueryPollerByExecutionId.get(executionId)) {
          handleApiCall(fetch(`${this.queryCountPath}/${executionId}/result`, {
            method: 'get',
            headers: this.requestOptions.headers,
          }), this.onError).then(async response => {
            resolve(await response.json())

            // The count query has finished and result has been processed
            // Now we need to delete the query execution from mastro.
            this.stopCountQuery(executionId)
          }).catch(reason => reject(reason))
        }
      }

      countStatePoller.onError = (error) => {
        reject(error)
        handleApiCall(fetch(`${this.queryCountPath}/${executionId}/error`, {
          method: 'get',
          headers: this.requestOptions.headers,
        }), this.onError)
          .then(async errorResponse => {
            this.requestOptions.onError(await errorResponse.text())
          })
          .finally(() => this.stopCountQuery(executionId))

      }

      if (onStopCallback)
        countStatePoller.onStop = onStopCallback

      countStatePoller.start()
    })
  }

  async getQueryStatus(executionID: string): Promise<{ status: QueryStatusEnum, hasError: boolean }> {
    return new Promise((resolve, reject) => {
      handleApiCall(fetch(this.getQueryStatusRequest(executionID)), this.onError)
        .then(response => resolve(response.json()))
        .catch(error => {
          this.requestOptions.onError(error)
          reject(error)
        })
    })
  }

  async instanceCheck(instanceIri: string, classesTocheck: string[]) {
    const params = new URLSearchParams({ instance: instanceIri })
    const response = await fetch(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/instanceChecking/start?${params.toString()}`, {
      method: 'post',
      headers: this.requestOptions.headers,
      body: JSON.stringify(classesTocheck)
    })
    const threadId = await response.json()
    const instanceCheckingPoller = new InstanceCheckingPoller(new Request(
      `${this.getInstanceCheckingPath(threadId)}/info`,
      {
        method: 'get',
        headers: this.requestOptions.headers
      }
    ))

    this._runningInstanceCheckingPollerByThreadId.set(threadId, instanceCheckingPoller)

    instanceCheckingPoller.onError((error: any) => this.requestOptions.onError(error))

    return instanceCheckingPoller
  }

  stopRunningQueries() {
    this.stopInstancesQueries()
    // this._runningQueryStatePollerByExecutionId.forEach((_, executionId) => this.stopQuery(executionId))
    this.stopCountsQueries()
    // this._runningInstanceCheckingPollerByThreadId.forEach((_, threadId) => this.stopInstanceChecking(threadId))
  }

  stopInstancesQueries() {
    this._runningQueryPollerByExecutionId.forEach((_, executionId) => this.stopQuery(executionId))
  }

  stopCountsQueries() {
    this._runningCountQueryPollerByExecutionId.forEach((_, executionId) => this.stopCountQuery(executionId))
  }

  stopQuery(executionId: string) {
    // stop polling
    const pollers = this._runningQueryPollerByExecutionId.get(executionId)
    pollers?.resultPollers.forEach(poller => poller.stop())
    pollers?.statusPollers.forEach(poller => poller.stop())

    this._runningQueryPollerByExecutionId.delete(executionId)
    handleApiCall(fetch(this.getQueryStopPath(executionId), {
      method: 'put',
      headers: this.requestOptions.headers,
    }), this.onError)
  }

  stopCountQuery(executionId: string) {
    this._runningCountQueryPollerByExecutionId.get(executionId)?.stop()
    this._runningCountQueryPollerByExecutionId.delete(executionId)

    handleApiCall(fetch(`${this.queryCountPath}/${executionId}/stop`, {
      method: 'put',
      headers: this.requestOptions.headers,
    }), this.requestOptions.onError)
  }

  stopInstanceChecking(threadId: string) {
    this._runningInstanceCheckingPollerByThreadId.get(threadId)?.stop()
    this._runningInstanceCheckingPollerByThreadId.delete(threadId)

    handleApiCall(fetch(`${this.getInstanceCheckingPath(threadId)}/stop`, {
      method: 'get',
      headers: this.requestOptions.headers,
    }), this.onError)
  }

  async shouldQueryUseLabels(executionId: string) {
    const queryPollers = this._runningQueryPollerByExecutionId.get(executionId)
    return new Promise((resolve: (value: boolean) => void) => {
      if (queryPollers) {
        for (let statusPoller of queryPollers.statusPollers) {
          if (statusPoller.result?.status == QueryStatusEnum.FINISHED || statusPoller.result?.status == QueryStatusEnum.RUNNING) {
            resolve(statusPoller.result.numHighLevelQueries > 0)
          } else {
            const oldCallback = statusPoller.onNewResults

            // check at every new result without overriding previous callback
            statusPoller.onNewResults = (result) => {
              oldCallback(result)
              if (result.status == QueryStatusEnum.FINISHED || result.status == QueryStatusEnum.RUNNING) {
                resolve(result.numHighLevelQueries > 0)
              }
            }
          }
          break
        }
      }
    })
  }

  private async getPrefixes() {
    return this._prefixes
  }

  private async startQuery(queryCode: string, querySemantics: QuerySemantics, isCount?: boolean): Promise<string> {
    let countURL: URL | undefined
    if (isCount) {
      countURL = this.queryCountPath
    }

    return new Promise(async (resolve) => {
      handleApiCall(
        fetch(await this.getNewQueryRequest(queryCode, querySemantics, countURL)),
        this.onError
      ).then(async response => {
        resolve((await response.json()).executionId)
      })
    })
  }

  /**
   * Request for starting a query
   * @param queryCode the code of the query
   * @param querySemantics Conjunctive queries or FULL SPARQL
   * @param customURL URL to use, if not specified this.queryStartPath will be used
   * @returns the request object to send
   */
  private async getNewQueryRequest(queryCode: string, querySemantics: QuerySemantics, customURL?: URL): Promise<Request> {
    const url: URL = customURL || this.queryStartPath
    const params = new URLSearchParams({
      useReplaceForUrlEncoding: 'false',
      querySemantics: querySemantics,
      advanced: 'true',
      reasoning: 'true',
      expandSparqlTables: 'true'
    })

    return new Request(new URL(url.toString().concat(`?${params.toString()}`)), {
      method: 'post',
      headers: this.requestOptions.headers,
      body: JSON.stringify({
        queryCode: `${await this.getPrefixes()}\n${queryCode}`,
        queryID: Math.random(),
        queryDescription: "",
        mappingParameters: {},
      }),
    })
  }

  // Requests for polling a query
  private getQueryResultRequest(queryExecutionId: string, limit: number, pagenumber = 1) {
    const params = new URLSearchParams({ pagesize: limit.toString(), pagenumber: pagenumber.toString() })

    return new Request(`${this.getQueryResultPath(queryExecutionId)}?${params.toString()}`, {
      method: 'get',
      headers: this.requestOptions.headers
    })
  }

  private getQueryStatusRequest(queryExecutionId: string) {
    return new Request(`${this.getQueryStatePath(queryExecutionId)}`, {
      method: 'get',
      headers: this.requestOptions.headers
    })
  }

  private getQueryCountStatusRequest(queryExecutionId: string) {
    return new Request(`${this.queryCountPath}/${queryExecutionId}/state`, {
      method: `get`,
      headers: this.requestOptions.headers,
    })
  }

  private get queryStartPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/start`)
  }

  private getQueryStopPath(executionId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/stop`)
  }

  private getQueryResultPath(executionId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/results`)
  }

  private getQueryStatePath(executionId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/status`)
  }

  private getInstanceCheckingPath(threadId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/instanceChecking/${threadId}`)
  }

  private get onError() {
    return this.requestOptions.onError
  }

  private get prefixesPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/prefixes`)
  }

  private get queryCountPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/count`)
  }
}