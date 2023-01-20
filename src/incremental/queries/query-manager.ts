import { MastroEndpoint, QueryStatusEnum, RequestOptions } from "../api/model"
import { QueryCountStatePoller, QueryResultsPoller, QueryStatusPoller } from "./query-poller"

export default class QueryManager {
  private _prefixes?: Promise<string> = new Promise(() => { })
  private _runningQueryPollerByExecutionId: Map<string, QueryResultsPoller> = new Map()
  private _runningQueryStatePollerByExecutionId: Map<string, QueryStatusPoller> = new Map()
  private _runningCountQueryPollerByExecutionId: Map<string, QueryCountStatePoller> = new Map()

  constructor(private requestOptions: RequestOptions, private endpoint: MastroEndpoint) {
    this.requestOptions.headers['content-type'] = 'application/json'

    this._prefixes = new Promise((resolve) => {
      this.handleCall(
        fetch(this.prefixesPath, {
          method: 'get',
          headers: this.requestOptions.headers,
        })
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
   * @param pageNumber the page number in case you're handling pagination
   * @returns a promise which will be resolved with the query poller, on this
   * object you can set the onNewResults callback to react every time new results
   * are obtained.
   */
  async performQuery(queryCode: string, pageSize: number, pageNumber = 1): Promise<QueryResultsPoller> {
    const executionId = await this.startQuery(queryCode)
    const queryResultsPoller = new QueryResultsPoller(this.getQueryResultRequest(executionId, pageSize, pageNumber), pageSize, executionId)
    this._runningQueryPollerByExecutionId.set(executionId, queryResultsPoller)

    queryResultsPoller.onError = this.requestOptions.onError

    const queryStatusPoller = new QueryStatusPoller(this.getQueryStatusRequest(executionId))
    this._runningQueryStatePollerByExecutionId.set(executionId, queryStatusPoller)

    queryStatusPoller.start()
    queryStatusPoller.onNewResults = (result) => {
      if (result.status === QueryStatusEnum.FINISHED || 
        result.status === QueryStatusEnum.ERROR ||
        result.status === QueryStatusEnum.UNAVAILABLE ||
        result.hasError
      ) {
        queryResultsPoller.stop()
        queryStatusPoller.stop()
      }
    }

    queryStatusPoller.onError = (errors) => {
      for (let error of errors)
        this.requestOptions.onError(error)

      queryResultsPoller.stop()
    }

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
    const executionId = await this.startQuery(queryCode, true)
    const countStatePoller = new QueryCountStatePoller(this.getQueryCountStatusRequest(executionId))

    this._runningCountQueryPollerByExecutionId.set(executionId, countStatePoller)

    return new Promise((resolve, reject) => {
      countStatePoller.onNewResults = (state) => {
        if (state === QueryCountStatePoller.QUERY_STATUS_FINISHED && this._runningCountQueryPollerByExecutionId.get(executionId)) {
          this.handleCall(fetch(`${this.queryCountPath}/${executionId}/result`, {
            method: 'get',
            headers: this.requestOptions.headers,
          })).then(async response => {
            resolve(await response.json())

            // The count query has finished and result has been processed
            // Now we need to delete the query execution from mastro.
            this.stopCountQuery(executionId)
          }).catch(reason => reject(reason))
        }
      }

      countStatePoller.onError = (error) => {
        reject(error)
        this.handleCall(fetch(`${this.queryCountPath}/${executionId}/error`, {
          method: 'get',
          headers: this.requestOptions.headers,
        }))
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
      this.handleCall(fetch(this.getQueryStatusRequest(executionID)))
        .then(response => resolve(response.json()))
        .catch(error => {
          this.requestOptions.onError(error)
          reject(error)
        })
    })
  }

  stopRunningQueries() {
    this._runningQueryPollerByExecutionId.forEach((_, executionId) => this.stopQuery(executionId))
    // this._runningQueryStatePollerByExecutionId.forEach((_, executionId) => this.stopQuery(executionId))
    this._runningCountQueryPollerByExecutionId.forEach((_, executionId) => this.stopCountQuery(executionId))
  }

  stopQuery(executionId: string) {
    this._runningQueryPollerByExecutionId.get(executionId)?.stop() // stop polling
    this._runningQueryPollerByExecutionId.delete(executionId)
    this.handleCall(fetch(this.getQueryStopPath(executionId), {
      method: 'put',
      headers: this.requestOptions.headers,
    }))
  }

  stopCountQuery(executionId: string) {
    this._runningCountQueryPollerByExecutionId.get(executionId)?.stop()
    this._runningCountQueryPollerByExecutionId.delete(executionId)

    this.handleCall(fetch(`${this.queryCountPath}/${executionId}/stop`, {
      method: 'put',
      headers: this.requestOptions.headers,
    }))
  }

  private async getPrefixes() {
    return this._prefixes
  }

  private async startQuery(queryCode: string, isCount?: boolean): Promise<string> {
    let countURL: URL | undefined
    if (isCount) {
      countURL = this.queryCountPath
    }

    return new Promise(async (resolve) => {
      this.handleCall(
        fetch(await this.getNewQueryRequest(queryCode, countURL))
      ).then(async response => {
        resolve((await response.json()).executionId)
      })
    })
  }

  // Request for starting a query
  private async getNewQueryRequest(queryCode: string, customURL?: URL): Promise<Request> {
    const url: URL = customURL || this.queryStartPath

    return new Request(url, {
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

  private get prefixesPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/prefixes`)
  }

  private get queryCountPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/count`)
  }

  private handleCall(apiCall: Promise<Response>): Promise<Response> {
    return new Promise((resolve, reject) => {
      apiCall
        .then(async response => {
          if (response.status !== 200) {
            const result = await (response.json() || response.text())
            this.requestOptions.onError(result)
            reject(result)
          } else {
            resolve(response)
          }
        })
        .catch(error => {
          this.requestOptions.onError(error)
          reject(error)
        })
    })
  }
}