export type QueryResult = QueryRecords | number

export type QueryRecords = {
  headTerms: string[],
  results: {
    type: string,
    shortIRI: string,
    value: string
  }[][]
}

export enum QueryPollerStatus {
  TIMEOUT_EXPIRED = 0,
  DONE = 1,
  RUNNING = 2,
  IDLE = 3,
}

export abstract class QueryPoller {
  protected interval: NodeJS.Timer
  protected timeout: NodeJS.Timeout
  protected lastRequestFulfilled: boolean = true
  protected abstract _result: QueryResult
  protected request: Request

  // Callbacks
  public onStop: () => void = () => { }
  public onTimeoutExpiration: () => void = () => { }
  public abstract onNewResults: (result: QueryResult) => void

  public status: QueryPollerStatus = QueryPollerStatus.IDLE

  protected static readonly TIMEOUT_LENGTH = 5000
  protected static readonly INTERVAL_LENGTH = 1000

  protected abstract stopCondition(): boolean
  protected abstract hasAnyResult(): boolean

  private poll() {
    this.status = QueryPollerStatus.RUNNING
    fetch(this.request).then((response: Response) => {
      response.json().then((result: QueryResult) => {
        this.lastRequestFulfilled = true
        this._result = result
        this.onNewResults(result)

        if (this.stopCondition()) {
          this.stop()
        }
      })
    })
  }

  start() {
    this.interval = setInterval(() => {
      if (this.lastRequestFulfilled) {
        this.lastRequestFulfilled = false
        this.poll()
      }
    }, QueryPoller.INTERVAL_LENGTH)

    this.timeout = setTimeout(() => {
      if (!this.hasAnyResult()) {
        this.stop(true)
      } else {
        this.stop()
      }
    }, QueryPoller.TIMEOUT_LENGTH)
  }

  stop(timeoutExpired = false) {
    if (timeoutExpired) {
      this.status = QueryPollerStatus.TIMEOUT_EXPIRED
      // console.warn(`Qyery timeout expired for query with id = [${this.executionID}]`)
      this.onTimeoutExpiration()
    } else {
      this.status = QueryPollerStatus.DONE
    }
    clearInterval(this.interval)
    clearTimeout(this.timeout)
    this.onStop()
  }

  abstract get result(): QueryResult
}

export class QueryResultsPoller extends QueryPoller {
  public onNewResults: (result: QueryRecords) => void = () => { }

  protected _result: QueryRecords

  constructor(protected request: Request, private limit: number, public executionId: string) {
    super()
  }

  protected stopCondition(): boolean {
    return this._result.results.length >= this.limit
  }

  protected hasAnyResult(): boolean {
    return this.result.results.length > 0
  }

  get result(): QueryRecords {
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

  protected _result: number

  public static readonly QUERY_STATUS_FINISHED = 3
  public static readonly QUERY_STATUS_ERROR = 4

  constructor(protected request: Request) {
    super()
  }

  protected stopCondition(): boolean {
    return this.result === QueryCountStatePoller.QUERY_STATUS_FINISHED ||
      this.result === QueryCountStatePoller.QUERY_STATUS_ERROR
  }
  protected hasAnyResult(): boolean {
    return this.result === QueryCountStatePoller.QUERY_STATUS_FINISHED
  }
  get result(): QueryResult {
    return this._result
  }

}