import { Filter } from "..";
import { Diagram } from "..";
import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholNode from "../graphol-elems/node";
import { RenderStatesEnum } from "../renderers/i-render-state";
import { EntityNameType, Language } from "../state";
import GrapholscapeTheme from "../theme";

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

interface IonEvent {
  (event: LifecycleEvent.EntitySelection, callback: (entity: GrapholEntity) => void): void;
  (event: LifecycleEvent.NodeSelection, callback: (node: GrapholNode) => void): void;
  (event: LifecycleEvent.EdgeSelection, callback: (edge: GrapholEdge) => void): void;
  (event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void;
  (event: LifecycleEvent.RendererChange, callback: (renderer: RenderStatesEnum) => void): void;
  (event: LifecycleEvent.LanguageChange, callback: (language: string) => void): void
  (event: LifecycleEvent.EntityNameTypeChange, callback: (nameType: EntityNameType) => void): void;
  (event: LifecycleEvent.Filter, callback: (filter: Filter) => void): void;
  (event: LifecycleEvent.Unfilter, callback: (filter: Filter) => void): void;
  (event: LifecycleEvent.FilterRequest, callback: (filter: Filter) => boolean): void;
  (event: LifecycleEvent.UnfilterRequest, callback: (filter: Filter) => boolean): void;
}

export default class Lifecycle {
  private diagramChange: ((diagram: Diagram) => void)[] = []
  private rendererChange: ((renderer: string) => void)[] = []
  private themeChange: ((theme: GrapholscapeTheme) => void)[] = []
  private entitySelection: ((entity: GrapholEntity) => void)[] = []
  private nodeSelection: ((grapholNode: GrapholNode) => void)[] = []
  private edgeSelection: ((grapholEdge: GrapholEdge) => void)[] = []
  private languageChange: ((language: Language) => void)[] = []
  private entityNameTypeChange: ((nameType: EntityNameType) => void)[] = []
  private filter: ((filter: Filter) => void)[] = []
  private unfilter: ((filter: Filter) => void)[] = []
  private filterRequest: ((filter: Filter) => boolean) = () => true
  private unfilterRequest: ((filter: Filter) => boolean) = () => true


  constructor() { }

  trigger(event: LifecycleEvent.EntitySelection, entity: GrapholEntity): void
  trigger(event: LifecycleEvent.NodeSelection, node: GrapholNode): void
  trigger(event: LifecycleEvent.EdgeSelection, edge: GrapholEdge): void
  trigger(event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void
  trigger(event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  trigger(event: LifecycleEvent.RendererChange, renderState: RenderStatesEnum): void
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

  on: IonEvent = (event: string, callback: any): void => {

    if (event === LifecycleEvent.FilterRequest || event === LifecycleEvent.UnfilterRequest) {
      this[event] = callback
      return
    }

    this[event].push(callback)
  }
}