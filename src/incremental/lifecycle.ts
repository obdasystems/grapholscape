import { GrapholEntity } from "../model"
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
  DiagramUpdated = 'diagramUpdated',
  ReasonerSet = 'reasonerSet',
  NewDataPropertyValues = 'newDataPropertyValues',
  DataPropertyValuesLoadingFinished = 'dpvaluesloadfinish'
}

export interface IonEvent {
  (event: IncrementalEvent.RequestStopped, callback: () => void): void
  (event: IncrementalEvent.NewInstances, callback: (classInstances: ClassInstance[]) => void): void
  (event: IncrementalEvent.InstancesSearchFinished, callback: () => void): void
  (event: IncrementalEvent.LimitChange, callback: (limit: number) => void): void
  (event: IncrementalEvent.EndpointChange, callback: (endpoint: MastroEndpoint) => void): void
  (event: IncrementalEvent.Reset, callback: () => void): void
  (event: IncrementalEvent.ClassInstanceSelection, callback: (classInstanceEntity: ClassInstanceEntity) => void): void
  (event: IncrementalEvent.ClassSelection, callback: (classEntity: GrapholEntity) => void): void
  (event: IncrementalEvent.ContextClick, callback: (entity: GrapholEntity) => void): void
  (event: IncrementalEvent.DiagramUpdated, callback: () => void): void
  (event: IncrementalEvent.ReasonerSet, callback: () => void): void
  (event: IncrementalEvent.NewDataPropertyValues, callback: (instanceIri: string, dataPropertyIri: string, newValues: string[]) => void): void
  (event: IncrementalEvent.DataPropertyValuesLoadingFinished, callback: (instanceIri: string, dataPropertyIri: string) => void): void
}

export default class IncrementalLifecycle {
  private requestStopped: (() => void)[] = []
  private newInstances: ((classInstances: ClassInstance[]) => void)[] = []
  private instancesSearchFinished: (() => void)[] = []
  private limitChange: ((limit: number) => void)[] = []
  private endpointChange: ((endpoint: MastroEndpoint) => void)[] = []
  private reset: (() => void)[] = []
  private classInstanceSselection: ((classInstanceEntity: ClassInstanceEntity) => void)[] = []
  private classSelection: ((classEntity: GrapholEntity) => void)[] = []
  private contextClick: ((entity: GrapholEntity) => void)[] = []
  private diagramUpdated: (() => void)[] = []
  private reasonerSet: (() => void)[] = []
  private newDataPropertyValues: ((dataPropertyIri: string, newValues: string[]) => void)[] = []
  private dpvaluesloadfinish: ((dataPropertyIri: string) => void)[] = []


  constructor() { }

  trigger(event: IncrementalEvent.RequestStopped): void
  trigger(event: IncrementalEvent.NewInstances, classInstances: ClassInstance[]): void
  trigger(event: IncrementalEvent.InstancesSearchFinished): void
  trigger(event: IncrementalEvent.LimitChange, limit: number): void
  trigger(event: IncrementalEvent.EndpointChange, endpoint: MastroEndpoint): void
  trigger(event: IncrementalEvent.Reset): void
  trigger(event: IncrementalEvent.ClassInstanceSelection, classInstanceEntity: ClassInstanceEntity): void
  trigger(event: IncrementalEvent.ClassSelection, classEntity: GrapholEntity): void
  trigger(event: IncrementalEvent.ContextClick, entity: GrapholEntity): void
  trigger(event: IncrementalEvent.DiagramUpdated): void
  trigger(event: IncrementalEvent.ReasonerSet): void
  trigger(event: IncrementalEvent.NewDataPropertyValues, instanceIri: string, dataPropertyIri: string, newValues: string[]): void
  trigger(event: IncrementalEvent.DataPropertyValuesLoadingFinished, instanceIri: string, dataPropertyIri: string): void
  trigger(event: string, ...params: any): any {
    this[event].forEach((callback: any) => callback(...params))
  }

  on: IonEvent = (event: string, callback: any): void => {
    this[event].push(callback)
  }
}