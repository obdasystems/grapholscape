export type MastroEndpoint = {
  description?: string
  name: string
  mastroID?: MastroID
  needRestart?: boolean
  user?: string
}

export type MastroID = {
  avpID: string
  datasourceID: string
  mappingID: string
  ontologyID: {
    ontologyName: string
    ontologyVersion: string
  }
}

export enum QueryStatusEnum {
  FINISHED = 'FINISHED',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR',
  RUNNING = 'RUNNING',
  READY = 'READY',
}

export type RequestOptions = {
  basePath: string,
  version: string,
  name: string,
  headers: any,
  onError: (errorObject: any) => void
}