import { Filter } from "../model";
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
  EntityNameTypeChange = 'entityNameTypeChange',
  Filter = 'filter',
  Unfilter = 'unfilter',
  FilterRequest = 'filterRequest',
  UnfilterRequest = 'unfilterRequest',
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
  filter: ((filter: Filter) => void)[] = []
  unfilter: ((filter: Filter) => void)[] = []
  filterRequest: ((filter: Filter) => boolean) = () => true
  unfilterRequest: ((filter: Filter) => boolean) = () => true


  constructor() { }

  trigger(event: LifecycleEvent.EntitySelection, entity: GrapholEntity): void
  trigger(event: LifecycleEvent.NodeSelection, node: GrapholNode): void
  trigger(event: LifecycleEvent.EdgeSelection, edge: GrapholEdge): void
  trigger(event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void
  trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  trigger(event: LifecycleEvent.LanguageChange, language: Language): void
  trigger(event: LifecycleEvent.EntityNameTypeChange, nameType: EntityNameType): void
  trigger(event: LifecycleEvent.Filter, filter: Filter): void
  trigger(event: LifecycleEvent.Unfilter, filter: Filter): void
  trigger(event: LifecycleEvent.FilterRequest, filter: Filter): boolean
  trigger(event: LifecycleEvent.UnfilterRequest, filter: Filter): boolean
  trigger(event: string, ...params: any): any {

    if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
      return this[event](params[0])
    }

    this[event].forEach((callback: any) => callback(...params))
  }

  on(event: LifecycleEvent.EntitySelection, callback: (entity: GrapholEntity) => void): void
  on(event: LifecycleEvent.NodeSelection, callback: (node: GrapholNode) => void): void
  on(event: LifecycleEvent.EdgeSelection, callback: (edge: GrapholEdge) => void): void
  on(event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void
  on(event: LifecycleEvent.RendererChange, callback: (renderer: string) => void): void
  on(event: LifecycleEvent.LanguageChange, callback: (language: string) => void): void
  on(event: LifecycleEvent.EntityNameTypeChange, callback: (nameType: EntityNameType) => void): void
  on(event: LifecycleEvent.Filter, callback: (filter: Filter) => void): void
  on(event: LifecycleEvent.Unfilter, callback: (filter: Filter) => void): void
  on(event: LifecycleEvent.FilterRequest, callback: (filter: Filter) => boolean): void
  on(event: LifecycleEvent.UnfilterRequest, callback: (filter: Filter) => boolean): void
  on(event: string, callback: any): void {

    if (event === LifecycleEvent.FilterRequest || LifecycleEvent.UnfilterRequest) {
      this[event] = callback
      return
    }

    this[event].push(callback)
  }
}