import { RDFGraph } from "../../model/rdf-graph/swagger"
import handleApiCall from "../api/handle-api-call"
import { HeadTypes, InstanceCheckingInfo, QueryStatusEnum } from "../api/model"

export type APICallResult = QueryRecords | number | QueryStatus | InstanceCheckingInfo | RDFGraph

export type QueryRecords = {
  headTerms: string[],
  headTypes: {[x: string]: HeadTypes},
  results: ResultRecord[]
}

export type ResultRecord = {
  type: string,
  shortIRI: string,
  value: string,
  lang?: string,
}[]

export type QueryStatus = {
  status: QueryStatusEnum,
  errorMessages: string[],
  hasError: boolean,
  percentage: number,
  numOntologyRewritings: number,
  numHighLevelQueries: number,
  numLowLevelQueries: number,
  executionTime: number,
  numResults: number,
}

export enum QueryPollerStatus {
  /** Stopped manually */
  STOPPED = 1,
  /** Polling ongoing and waiting for responses */
  RUNNING = 2,
  /** QueryPoller not started yet */
  IDLE = 3,
  /** Stopped automatically because stopCondition() === true */
  FINISHED = 4,
  /** Error occurred */
  ERROR = 5,
}

export abstract class QueryPoller {
  protected interval: NodeJS.Timer
  protected lastRequestFulfilled: boolean = true
  protected abstract _result?: APICallResult
  protected request: Request

  // Callbacks
  public onStop: () => void = () => { }
  public abstract onNewResults: (result: APICallResult) => void
  public onError: (error: any) => void = () => { }

  public status: QueryPollerStatus = QueryPollerStatus.IDLE

  protected static readonly TIMEOUT_LENGTH = 5000
  protected static readonly INTERVAL_LENGTH = 1000

  protected abstract stopCondition(): boolean

  protected poll() {
    this.status = QueryPollerStatus.RUNNING
    handleApiCall(fetch(this.request), () => {})
      .then((response: Response) => {
        response.json().then((result: APICallResult) => {
          // if (this.hasAnyResults() && this.status === QueryPollerStatus.STOPPED) {
          //   return
          // }

          if (this.isResultError(result)) {
            this.triggerError(result)
          } else {
            this.lastRequestFulfilled = true
            this._result = result
            this.onNewResults(result)

            if (this.stopCondition()) {
              this.status = QueryPollerStatus.FINISHED
              this.stopPolling()
            }
          }
        })
      })
      .catch(error => this.triggerError(error))
  }

  private stopPolling() {
    clearInterval(this.interval)
    this.onStop()
  }

  protected abstract isResultError(result: any): boolean

  protected abstract hasAnyResults(): boolean

  start() {
    this.interval = setInterval(() => {
      if (this.lastRequestFulfilled) {
        this.lastRequestFulfilled = false
        this.poll()
      }
    }, QueryPoller.INTERVAL_LENGTH)
  }

  stop() {
    this.status = QueryPollerStatus.STOPPED
    this.stopPolling()
  }

  private triggerError(result: APICallResult) {
    this.status = QueryPollerStatus.ERROR
    this.stopPolling()
    this.onError(this.getErrrorMessage(result))
  }

  protected getErrrorMessage(result: APICallResult): string | string[] {
    return result.toString()
  }

  abstract get result(): APICallResult | undefined
}

export class QueryResultsPoller extends QueryPoller {
  public onNewResults: (result: QueryRecords) => void = () => { }
  public numberResultsAvailable: number = 0

  protected _result: QueryRecords

  constructor(protected request: Request, private limit: number, public executionId: string) {
    super()
  }

  protected hasAnyResults(): boolean {
    return this.result && this.result.results.length > 0
  }

  protected isResultError(result: QueryRecords): boolean {
    return !result || result.results === undefined
  }

  protected stopCondition(): boolean {
    return this._result.results.length >= this.limit
  }

  get result(): QueryRecords {
    return this._result
  }
}

export class QueryStatusPoller extends QueryPoller {
  protected _result?: QueryStatus

  constructor(protected request: Request) {
    super()
  }

  public onNewResults: (result: QueryStatus) => void

  protected hasAnyResults(): boolean {
    return this.result !== undefined
  }

  protected stopCondition(): boolean {
    return this.result?.status !== QueryStatusEnum.RUNNING
  }

  protected isResultError(result: QueryStatus): boolean {
    return !result || result.hasError === true || result.status === QueryStatusEnum.UNAVAILABLE || result.status === QueryStatusEnum.ERROR
  }

  protected getErrrorMessage(result: QueryStatus): string[] {
    return result.errorMessages.map(error => JSON.parse(error))
  }

  get result(): QueryStatus | undefined {
    return this._result
  }

}

/**
 * Class to perform polling on a count query,
 * it will stop when the result received is equal
 * to the QUERY_STATUS_FINISHED constant.
 */
export class QueryCountStatePoller extends QueryPoller {
  /**
   * Callback called in case the count has finished correctly.
   */
  public onNewResults: (result: number) => void = () => { }

  protected hasAnyResults(): boolean {
    return this.result !== undefined
  }

  protected _result: number

  public static readonly QUERY_STATUS_FINISHED = 3
  public static readonly QUERY_STATUS_ERROR = 4

  constructor(protected request: Request) {
    super()
  }

  protected isResultError(result: any): boolean {
    return !result || result === QueryCountStatePoller.QUERY_STATUS_ERROR
  }

  protected stopCondition(): boolean {
    return this.result === QueryCountStatePoller.QUERY_STATUS_FINISHED
  }

  get result(): number {
    return this._result
  }

}

export class QueryConstructResultsPoller extends QueryPoller {
  protected _result: RDFGraph
  public onNewResults: (result: RDFGraph) => void = () => { }
  public numberResultsAvailable: number = 0

  constructor(protected request: Request, private limit: number, public executionId: string) {
    super()
  }

  protected hasAnyResults(): boolean {
    const diagramNodes = this.result.diagrams[0]?.nodes
    return this.result && diagramNodes !== undefined && diagramNodes.length > 0
  }

  protected isResultError(result: RDFGraph): boolean {
    return !result || !result.diagrams
  }

  protected stopCondition(): boolean {
    return this._result !== undefined
  }

  get result(): RDFGraph {
    return this._result
  }
}