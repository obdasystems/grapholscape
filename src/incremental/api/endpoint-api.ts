import { MastroEndpoint, RequestOptions } from "./model"

export interface IEndpointApi {
  getRunningEndpoints: () => Promise<MastroEndpoint[]>
}

export default class EndpointApi implements IEndpointApi {

  constructor(private requestOptions: RequestOptions) { }

  async getRunningEndpoints() {
    const runningEndpoints = (await (await fetch(`${this.requestOptions.basePath}/endpoints/running`, {
      method: 'get',
      headers: this.requestOptions.headers,

    })).json()).endpoints as MastroEndpoint[]

    return runningEndpoints.filter(endpoint =>
      endpoint.mastroID?.ontologyID.ontologyName === this.requestOptions.name &&
      endpoint.mastroID.ontologyID.ontologyVersion === this.requestOptions.version
    )
  }
}