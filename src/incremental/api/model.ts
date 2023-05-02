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

export enum QuerySemantics {
  CQ = 'cq',
  FULL_SPARQL = 'eql'
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
}

export type MWSEntity = {
  entityIRI: string,
  entityID: string,
  entityPrefixIRI: string,
  entityRemainder: string,
  entityType: string,
}

export type EmptyUnfoldingEntities = {
  emptyUnfoldingClasses: MWSEntity[],
  emptyUnfoldingDataProperties: MWSEntity[],
  emptyUnfoldingObjectProperties: MWSEntity[],
}

export type MaterializedCounts = {
  countsMap: Map<string, CountEntry>,
  endTime: number,
  percentage: number,
  startTime: number,
  state: QueryStatusEnum,
}

export type CountEntry = {
  count: number,
  error?: string,
  state: QueryStatusEnum,
  entity: MWSEntity,
}

export enum HeadTypes {
  OBJECT = 'OBJECT',
  VALUE = 'VALUE',
}