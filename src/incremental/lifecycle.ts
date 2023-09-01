import { GrapholEntity, TypesEnum } from "../model"
import ClassInstanceEntity from "../model/graphol-elems/class-instance-entity"
import { ClassInstance } from "./api/kg-api"
import { MastroEndpoint } from "./api/model"

export enum IncrementalEvent {
  RequestStopped = 'requestStopped',
  NewInstances = 'newInstances',
  InstancesSearchFinished = 'instancesSearchFinished',
  LimitChange = 'limitChange',
  EndpointChange = 'endpointChange',
  Reset = 'reset',
  ClassInstanceSelection = 'classInstanceSselection',
  ClassSelection = 'classSelection',
  ContextClick = 'contextClick',
  DoubleTap = 'doubleTap',
  DiagramUpdated = 'diagramUpdated',
  ReasonerSet = 'reasonerSet',
  NewDataPropertyValues = 'newDataPropertyValues',
  DataPropertyValuesLoadingFinished = 'dpvaluesloadfinish',
  InstanceCheckingStarted = 'instanceCheckingStarted',
  InstanceCheckingFinished = 'instanceCheckingFinished',
  CountStarted = 'countStarted',
  NewCountResult = 'newCountResult',
  LoadingStarted = 'loadingStarted',
  LoadingFinished = 'loadingFinished',
}

export interface IonEvent {
  (event: IncrementalEvent.RequestStopped, callback: () => void): void
  (event: IncrementalEvent.NewInstances, callback: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void): void
  (event: IncrementalEvent.InstancesSearchFinished, callback: () => void): void
  (event: IncrementalEvent.LimitChange, callback: (limit: number) => void): void
  (event: IncrementalEvent.EndpointChange, callback: (endpoint: MastroEndpoint) => void): void
  (event: IncrementalEvent.Reset, callback: () => void): void
  (event: IncrementalEvent.ClassInstanceSelection, callback: (classInstanceEntity: ClassInstanceEntity) => void): void
  (event: IncrementalEvent.ClassSelection, callback: (classEntity: GrapholEntity) => void): void
  (event: IncrementalEvent.DiagramUpdated, callback: () => void): void
  (event: IncrementalEvent.ReasonerSet, callback: () => void): void
  (event: IncrementalEvent.NewDataPropertyValues, callback: (instanceIri: string, dataPropertyIri: string, newValues: string[]) => void): void
  (event: IncrementalEvent.DataPropertyValuesLoadingFinished, callback: (instanceIri: string, dataPropertyIri: string) => void): void,
  (event: IncrementalEvent.InstanceCheckingStarted, callback: (instanceIri: string) => void): void,
  (event: IncrementalEvent.InstanceCheckingFinished, callback: (instanceIri: string) => void): void,
  (event: IncrementalEvent.NewCountResult, callback: (classIri: string, result?: { value: number, materialized: boolean, date?: string }) => void): void,
  (event: IncrementalEvent.CountStarted, callback: (classIri: string) => void): void,
  (event: IncrementalEvent.LoadingStarted, callback: (entityIri: string, entityType: TypesEnum) => void): void,
  (event: IncrementalEvent.LoadingFinished, callback: (entityIri: string, entityType: TypesEnum) => void): void,
}

export default class IncrementalLifecycle {
  private requestStopped: (() => void)[] = []
  private newInstances: ((classInstances: ClassInstance[][], numberResultsAvailable?: number) => void)[] = []
  private instancesSearchFinished: (() => void)[] = []
  private limitChange: ((limit: number) => void)[] = []
  private endpointChange: ((endpoint: MastroEndpoint) => void)[] = []
  private reset: (() => void)[] = []
  private classInstanceSselection: ((classInstanceEntity: ClassInstanceEntity) => void)[] = []
  private classSelection: ((classEntity: GrapholEntity) => void)[] = []
  private diagramUpdated: (() => void)[] = []
  private reasonerSet: (() => void)[] = []
  private newDataPropertyValues: ((dataPropertyIri: string, newValues: string[]) => void)[] = []
  private dpvaluesloadfinish: ((instanceIri: string, dataPropertyIri: string) => void)[] = []
  private instanceCheckingStarted: ((instanceIri: string) => void)[] = []
  private instanceCheckingFinished: ((instanceIri: string) => void)[] = []
  private newCountResult: ((classIri: string, result?: { value: number, materialized: boolean, date?: string }) => void)[] = []
  private countStarted: ((classIri: string) => void)[] = []
  private loadingStarted: ((entityIri: string, entityType: TypesEnum) => void)[] = []
  private loadingFinished: ((entityIri: string, entityType: TypesEnum) => void)[] = []


  constructor() { }

  trigger(event: IncrementalEvent.RequestStopped): void
  trigger(event: IncrementalEvent.NewInstances, classInstances: ClassInstance[][], numberResultsAvailable: number): void
  trigger(event: IncrementalEvent.InstancesSearchFinished): void
  trigger(event: IncrementalEvent.LimitChange, limit: number): void
  trigger(event: IncrementalEvent.EndpointChange, endpoint: MastroEndpoint): void
  trigger(event: IncrementalEvent.Reset): void
  trigger(event: IncrementalEvent.ClassInstanceSelection, classInstanceEntity: ClassInstanceEntity): void
  trigger(event: IncrementalEvent.ClassSelection, classEntity: GrapholEntity): void
  trigger(event: IncrementalEvent.DiagramUpdated): void
  trigger(event: IncrementalEvent.ReasonerSet): void
  trigger(event: IncrementalEvent.NewDataPropertyValues, instanceIri: string, dataPropertyIri: string, newValues: string[]): void
  trigger(event: IncrementalEvent.DataPropertyValuesLoadingFinished, instanceIri: string, dataPropertyIri: string): void
  trigger(event: IncrementalEvent.InstanceCheckingStarted, instanceIri: string): void
  trigger(event: IncrementalEvent.InstanceCheckingFinished, instanceIri: string): void
  trigger(event: IncrementalEvent.NewCountResult, classIri: string, result?: { value: number, materialized: boolean, date?: string }): void
  trigger(event: IncrementalEvent.CountStarted, classIri: string): void
  trigger(event: IncrementalEvent.LoadingStarted, entityIri: string, entityType: TypesEnum): void
  trigger(event: IncrementalEvent.LoadingFinished, entityIri: string, entityType: TypesEnum): void
  trigger(event: string, ...params: any): any {
    this[event].forEach((callback: any) => callback(...params))
  }

  on: IonEvent = (event: string, callback: any): void => {
    this[event].push(callback)
  }
}