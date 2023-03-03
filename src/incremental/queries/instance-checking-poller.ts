import { InstanceCheckingInfo, QueryStatusEnum } from "../api/model";
import { QueryPoller } from "./query-poller";

export default class InstanceCheckingPoller extends QueryPoller {
  protected _result: InstanceCheckingInfo;
  public onNewResults: (result: InstanceCheckingInfo) => void;

  constructor(protected request: Request) {
    super()
  }

  protected stopCondition(): boolean {
    return this.result.state === QueryStatusEnum.FINISHED || this.result.state === QueryStatusEnum.STOPPED
  }

  protected isResultError(result: any): boolean {
    return false
  }

  protected hasAnyResults(): boolean {
    return this.result.resultClasses ? this.result.resultClasses.length > 0 : false
  }

  get result(): InstanceCheckingInfo {
    return this._result
  }
}