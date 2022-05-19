import { Diagram } from "../model";

export enum LifecycleEvent {
  DiagramChange = 'diagramChange',
  RendererChange = 'rendererChange'
}

export default class Lifecycle {
  diagramChange: ((diagram: Diagram) => void)[]
  rendererChange: ((renderer: string) => void)[]


  constructor() {}
  
  trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  trigger(event: LifecycleEvent, ...params: any) {
    this[event].forEach(callback => callback(params))
  }

  on(event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void
  on(event: LifecycleEvent.RendererChange, callback: (renderer: string) => void): void
  on(event: LifecycleEvent, callback): void {
    this[event].push(callback)
  }
}