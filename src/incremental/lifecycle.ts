import { GrapholEntity } from "../model"

/** @internal */
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
}

/** @internal */
export interface IonIncrementalEvent {
  (event: IncrementalEvent.RequestStopped, callback: () => void): void
  // (event: IncrementalEvent.NewInstances, callback: (classInstances: ClassInstance[][], numberResultsAvailable: number) => void): void
  (event: IncrementalEvent.InstancesSearchFinished, callback: () => void): void
  (event: IncrementalEvent.LimitChange, callback: (limit: number) => void): void
  // (event: IncrementalEvent.EndpointChange, callback: (endpoint: MastroEndpoint) => void): void
  (event: IncrementalEvent.Reset, callback: () => void): void
  (event: IncrementalEvent.ClassSelection, callback: (classEntity: GrapholEntity) => void): void
  (event: IncrementalEvent.DiagramUpdated, callback: () => void): void
  (event: IncrementalEvent.ReasonerSet, callback: () => void): void
  (event: IncrementalEvent.NewDataPropertyValues, callback: (instanceIri: string, dataPropertyIri: string, newValues: string[]) => void): void
  (event: IncrementalEvent.DataPropertyValuesLoadingFinished, callback: (instanceIri: string, dataPropertyIri: string) => void): void,
}

/** @internal */
export default class IncrementalLifecycle {
  private requestStopped: (() => void)[] = []
  // private newInstances: ((classInstances: ClassInstance[][], numberResultsAvailable?: number) => void)[] = []
  private instancesSearchFinished: (() => void)[] = []
  private limitChange: ((limit: number) => void)[] = []
  // private endpointChange: ((endpoint: MastroEndpoint) => void)[] = []
  private reset: (() => void)[] = []
  private classSelection: ((classEntity: GrapholEntity) => void)[] = []
  private diagramUpdated: (() => void)[] = []
  private reasonerSet: (() => void)[] = []
  private newDataPropertyValues: ((dataPropertyIri: string, newValues: string[]) => void)[] = []
  private dpvaluesloadfinish: ((instanceIri: string, dataPropertyIri: string) => void)[] = []

  constructor() { }

  trigger(event: IncrementalEvent.RequestStopped): void
  // trigger(event: IncrementalEvent.NewInstances, classInstances: ClassInstance[][], numberResultsAvailable: number): void
  trigger(event: IncrementalEvent.InstancesSearchFinished): void
  trigger(event: IncrementalEvent.LimitChange, limit: number): void
  // trigger(event: IncrementalEvent.EndpointChange, endpoint: MastroEndpoint): void
  trigger(event: IncrementalEvent.Reset): void
  trigger(event: IncrementalEvent.ClassSelection, classEntity: GrapholEntity): void
  trigger(event: IncrementalEvent.DiagramUpdated): void
  trigger(event: IncrementalEvent.ReasonerSet): void
  trigger(event: IncrementalEvent.NewDataPropertyValues, instanceIri: string, dataPropertyIri: string, newValues: string[]): void
  trigger(event: IncrementalEvent.DataPropertyValuesLoadingFinished, instanceIri: string, dataPropertyIri: string): void
  trigger(event: string, ...params: any): any {
    this[event].forEach((callback: any) => callback(...params))
  }

  on: IonIncrementalEvent = (event: string, callback: any): void => {
    this[event].push(callback)
  }
}