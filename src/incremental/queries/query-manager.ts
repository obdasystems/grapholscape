import { MastroEndpoint, RequestOptions } from "./model"
import { QueryCountStatePoller, QueryResultsPoller } from "./query-poller"

export default class QueryManager {
  private _prefixes: Promise<Response>
  private prefixes?: string

  constructor(private requestOptions: RequestOptions, private endpoint: MastroEndpoint) {
    this.requestOptions.headers['content-type'] = 'application/json'
    this._prefixes = fetch(this.prefixesPath, {
      method: 'get',
      headers: this.requestOptions.headers,
    })
  }

  /**
   * Start the query using the result route.
   * The QueryResultPoller will poll the query results.
   * @param queryCode 
   * @param limit the maximum number of results to retrieve, you can't perform
   * a query for results without limit
   * @returns a promise which will be resolved with the query poller, on this
   * object you can set the onNewResults callback to react every time new results
   * are obtained.
   */
  async performQuery(queryCode: string, limit: number): Promise<QueryResultsPoller> {
    const executionID = await this.startQuery(queryCode)
    return new QueryResultsPoller(this.getQueryResultRequest(executionID, limit), limit)
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
  async performQueryCount(queryCode: string): Promise<number> {
    const executionID = await this.startQuery(queryCode, true)
    const countStatePoller = new QueryCountStatePoller(this.getQueryCountStatusRequest(executionID))

    return new Promise((resolve, reject) => {
      countStatePoller.onNewResults = (state) => {
        if (state === QueryCountStatePoller.QUERY_STATUS_FINISHED) {
          fetch(`${this.queryCountPath}/${executionID}/result`, {
            method: 'get',
            headers: this.requestOptions.headers,
          })
          .then(async response => {
            resolve(await response.json())

            // The count query has finished and result has been processed
            // Now we need to delete the query execution from mastro.
            fetch(`${this.queryCountPath}/${executionID}`, {
              method: 'delete',
              headers: this.requestOptions.headers,
            })
          })
          .catch(reason => reject(reason))
        }
      }
  
      countStatePoller.start()
    })
  }

  private async getPrefixes() {
    this.prefixes = this.prefixes || await (await (await (this._prefixes)).json()).map((p: { name: any; namespace: any }) =>
      `PREFIX ${p.name} <${p.namespace}>`
    ).join('\n')

    return this.prefixes
  }

  private async startQuery(queryCode: string, isCount?: boolean): Promise<string> {
    let countURL: URL | undefined
    if (isCount) {
      countURL = this.queryCountPath
    }

    return await (
      await (
        await (fetch(await this.getNewQueryRequest(queryCode, countURL)))
      ).json()
    ).executionId
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
  private getQueryResultRequest(queryExecutionId: string, limit: number) {
    const params = new URLSearchParams({ pagesize: limit.toString(), pagenumber: '1' })

    return new Request(`${this.getQueryResultPath(queryExecutionId)}?${params.toString()}`, {
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

  private getQueryResultPath(executionId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/results`)
  }

  private get prefixesPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/prefixes`)
  }

  private get queryCountPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/count`)
  }
}