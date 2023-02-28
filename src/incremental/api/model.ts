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
  STOPPED = 'STOPPED',
}

export type RequestOptions = {
  basePath: string,
  version: string,
  name: string,
  headers: any,
  onError: (errorObject: any) => void
}

export type InstanceCheckingInfo = {
  startTime: number
  endTime: number
  state: QueryStatusEnum
  percentage: number
  resultClasses: MWSEntity[]
  leafClasses?: MWSEntity[]
}

export type MWSEntity = {
  entityIRI: string
}