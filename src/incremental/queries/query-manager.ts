import { MastroEndpoint, RequestOptions } from "./model"
import QueryPoller from "./query-poller";

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

  async performQuery(queryCode: string, limit: number): Promise<QueryPoller> {
    const executionID = await this.startQuery(queryCode)
    const queryPoller = new QueryPoller(this.getQueryResultRequest(executionID, limit), limit)
    return queryPoller
  }

  private async getPrefixes() {
    this.prefixes = this.prefixes || await (await (await (this._prefixes)).json()).map((p: { name: any; namespace: any }) =>
      `PREFIX ${p.name} <${p.namespace}>`
    ).join('\n')

    return this.prefixes
  }

  private async startQuery(queryCode: string): Promise<string> {
    return await (
      await (
        await (fetch(await this.getNewQueryRequest(queryCode)))
      ).json()
    ).executionId
  }

  private async getNewQueryRequest(queryCode: string): Promise<Request> {
    return new Request(this.queryStartPath, {
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

  private getQueryResultRequest(queryExecutionId: string, limit: number) {
    const params = new URLSearchParams({ pagesize: limit.toString(), pagenumber: '1' })

    return new Request(`${this.getQueryResultPath(queryExecutionId)}?${params.toString()}`, {
      method: 'get',
      headers: this.requestOptions.headers
    })
  }

  private get queryStartPath() {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/start`)
  }

  private getQueryResultPath(executionId: string) {
    return new URL(`${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/query/${executionId}/results`)
  }

  private get prefixesPath() {
    return `${this.requestOptions.basePath}/endpoint/${this.endpoint.name}/prefixes`
  }
}