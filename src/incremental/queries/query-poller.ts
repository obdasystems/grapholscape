import { MastroEndpoint, RequestOptions } from "./model"

export type QueryResult = {
  headTerms: string[],
  results: {
    type: string,
    shortIri: string,
    value: string
  }[][]
}

export enum QueryPollerStatus {
  TIMEOUT_EXPIRED = 0,
  DONE = 1,
  RUNNING = 2,
  IDLE = 3,
}

export default class QueryPoller {
  private interval: NodeJS.Timer
  private lastRequestFulfilled: boolean = true
  private timeout: NodeJS.Timeout
  private _result: QueryResult
  
  // Callbacks
  onNewResults = (result: QueryResult) => { }
  onTimeoutExpiration = () => { }
  onStop = () => { }

  status = QueryPollerStatus.IDLE

  static readonly TIMEOUT_LENGTH = 5000
  static readonly INTERVAL_LENGTH = 1000

  constructor(private request: Request, private limit: number) { }

  private poll() {
    this.status = QueryPollerStatus.RUNNING
    fetch(this.request).then((response: Response) => {
      response.json().then((result: QueryResult) => {
        if (JSON.stringify(this._result) !== JSON.stringify(result)) {
          this._result = result
          this.lastRequestFulfilled = true
          this.onNewResults(result)
        }
        
        if (result.results.length >= this.limit) {
          this.stop()
        }
      })
    })

    // handlePromise(axios.request<any>(this.queryResultRequestOptions)).then((result: QueryResult) => {
    //   this._result = result
    //   this.lastRequestFulfilled = true
    //   if (result.results.length >= this.limit) {
    //     this.stop()
    //   }
    //   this.onNewResults(result)
    // })
  }

  start() {
    this.interval = setInterval(() => {
      if (this.lastRequestFulfilled) {
        this.lastRequestFulfilled = false
        this.poll()
      }
    }, QueryPoller.INTERVAL_LENGTH)

    this.timeout = setTimeout(() => {
      if (this.result.results.length === 0) {
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

  get result() { return this._result }

  // private get queryResultRequestOptions() {
  //   const queryOptions = {
  //     url: localStorage.getItem('mastroUrl') + '/endpoint/' + this.endpoint.name + '/query/' + this.executionID + '/results',
  //     method: 'get',
  //     params: { pagesize: 10, pagenumber: 1 },
  //     headers: JSON.parse(localStorage.getItem('headers') || ''),
  //   }

  //   return new Request(queryOptions.url, {
  //     method: 'get',
  //     headers: JSON.parse(localStorage.getItem('headers') || ''),
  //     body: JSON.stringify({ pagesize: 10, pagenumber: 1 })
  //   })
  // }
}