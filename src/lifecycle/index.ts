import { Diagram } from "../model";
import GrapholEdge from "../model/graphol-elems/edge";
import GrapholEntity from "../model/graphol-elems/entity";
import GrapholNode from "../model/graphol-elems/node";
import { EntityNameType, Language } from "../model/state";
import GrapholscapeTheme from "../model/theme";

export enum LifecycleEvent {
  DiagramChange = 'diagramChange',
  RendererChange = 'rendererChange',
  ThemeChange = 'themeChange',
  EntitySelection = 'entitySelection',
  NodeSelection = 'nodeSelection',
  EdgeSelection = 'edgeSelection',
  LanguageChange = 'languageChange',
  EntityNameTypeChange = 'entityNameTypeChange'
}

export default class Lifecycle {
  diagramChange: ((diagram: Diagram) => void)[] = []
  rendererChange: ((renderer: string) => void)[] = []
  themeChange: ((theme: GrapholscapeTheme) => void)[] = []
  entitySelection: ((entity: GrapholEntity) => void)[] = []
  nodeSelection: ((grapholNode: GrapholNode) => void)[] = []
  edgeSelection: ((grapholEdge: GrapholEdge) => void)[] = []
  languageChange: ((language: Language) => void)[] = []
  entityNameTypeChange: ((nameType: EntityNameType) => void)[] = []


  constructor() { }

  trigger(event: LifecycleEvent.EntitySelection, entity: GrapholEntity): void
  trigger(event: LifecycleEvent.NodeSelection, node: GrapholNode): void
  trigger(event: LifecycleEvent.EdgeSelection, edge: GrapholEdge): void
  trigger(event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void
  trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  trigger(event: LifecycleEvent.LanguageChange, language: Language): void
  trigger(event: LifecycleEvent.EntityNameTypeChange, nameType: EntityNameType): void
  trigger(event: LifecycleEvent, ...params: any) {
    this[event].forEach((callback: any) => callback(...params))
  }

  on(event: LifecycleEvent.EntitySelection, callback: (entity: GrapholEntity) => void): void
  on(event: LifecycleEvent.NodeSelection, callback: (node: GrapholNode) => void): void
  on(event: LifecycleEvent.EdgeSelection, callback: (edge: GrapholEdge) => void): void
  on(event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void
  on(event: LifecycleEvent.RendererChange, callback: (renderer: string) => void): void
  on(event: LifecycleEvent.LanguageChange, callback: (language: string) => void): void
  on(event: LifecycleEvent.EntityNameTypeChange, callback: (nameType: EntityNameType) => void): void
  on(event: string, callback: any): void {
    this[event].push(callback)
  }
}