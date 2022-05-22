import { Diagram } from "../model";
import GrapholscapeTheme from "../model/theme";

export enum LifecycleEvent {
  DiagramChange = 'diagramChange',
  RendererChange = 'rendererChange',
  ThemeChange = 'themeChange',
}

export default class Lifecycle {
  diagramChange: ((diagram: Diagram) => void)[] = []
  rendererChange: ((renderer: string) => void)[] = []
  themeChange: ((theme: GrapholscapeTheme) => void)[] = []


  constructor() {}
  
  trigger(event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void
  trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  trigger(event: LifecycleEvent, ...params: any) {
    this[event].forEach((callback: any) => callback(params))
  }

  on(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  on(event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void
  on(event: LifecycleEvent.RendererChange, callback: (renderer: string) => void): void
  on(event: LifecycleEvent, callback: any): void {
    this[event].push(callback)
  }
}