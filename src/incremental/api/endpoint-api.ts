import handleApiCall from "./handle-api-call"
import { MastroEndpoint, RequestOptions } from "./model"

export interface IEndpointApi {
  getRunningEndpoints: () => Promise<MastroEndpoint[]>
}

export default class EndpointApi implements IEndpointApi {

  constructor(private requestOptions: RequestOptions) { }

  async getRunningEndpoints() {
    const runningEndpoints = (await (await handleApiCall(fetch(`${this.requestOptions.basePath}/endpoints/running`, {
      method: 'get',
      headers: this.requestOptions.headers,
    }), this.requestOptions.onError)).json()).endpoints as MastroEndpoint[]

    return runningEndpoints.filter(endpoint =>
      endpoint.mastroID?.ontologyID.ontologyName === this.requestOptions.name &&
      endpoint.mastroID.ontologyID.ontologyVersion === this.requestOptions.version
    )
  }
}