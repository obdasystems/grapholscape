import { QueryStatusEnum } from "../api/model"

export type APICallResult = QueryRecords | number | QueryStatus

export type QueryRecords = {
  headTerms: string[],
  results: {
    type: string,
    shortIRI: string,
    value: string
  }[][]
}

export type QueryStatus = {
  status: QueryStatusEnum,
  errorMessages: string[],
  hasError: boolean,
}

export enum QueryPollerStatus {
  STOPPED = 1,
  RUNNING = 2,
  IDLE = 3,
}

export abstract class QueryPoller {
  protected interval: NodeJS.Timer
  protected lastRequestFulfilled: boolean = true
  protected abstract _result: APICallResult
  protected request: Request

  // Callbacks
  public onStop: () => void = () => { }
  public abstract onNewResults: (result: APICallResult) => void
  public onError: (error: any) => void = () => { }

  public status: QueryPollerStatus = QueryPollerStatus.IDLE

  protected static readonly TIMEOUT_LENGTH = 5000
  protected static readonly INTERVAL_LENGTH = 1000

  protected abstract stopCondition(): boolean

  private poll() {
    this.status = QueryPollerStatus.RUNNING
    fetch(this.request)
      .then((response: Response) => {
        response.json().then((result: APICallResult) => {
          if (this.hasAnyResults() && this.status === QueryPollerStatus.STOPPED)
            return

          if (this.isResultError(result)) {
            this.triggerError(result)
          } else {
            this.lastRequestFulfilled = true
            this._result = result
            this.onNewResults(result)

            if (this.stopCondition()) {
              this.stop()
            }
          }
        })
      })
      .catch(error => this.triggerError(error))
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
    clearInterval(this.interval)
    this.onStop()
  }

  private triggerError(result: APICallResult) {
    this.onError(this.getErrrorMessage(result))
    this.stop()
  }

  protected getErrrorMessage(result: APICallResult): string | string[] {
    return result.toString()
  }

  abstract get result(): APICallResult
}

export class QueryResultsPoller extends QueryPoller {
  public onNewResults: (result: QueryRecords) => void = () => { }

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
  protected _result: QueryStatus

  constructor(protected request: Request) {
    super()
  }

  public onNewResults: (result: QueryStatus) => void

  protected hasAnyResults(): boolean {
    return this.result !== undefined
  }

  protected stopCondition(): boolean {
    return this.result.status !== QueryStatusEnum.RUNNING
  }

  protected isResultError(result: QueryStatus): boolean {
    return !result || result.hasError === true || result.status === QueryStatusEnum.UNAVAILABLE || result.status === QueryStatusEnum.ERROR
  }

  protected getErrrorMessage(result: QueryStatus): string[] {
    return result.errorMessages.map(error => JSON.parse(error))
  }

  get result(): QueryStatus {
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