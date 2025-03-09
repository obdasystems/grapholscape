import { EventObject } from "cytoscape"
import { Language } from "../../config"
import Diagram from "../diagrams/diagram"
import { GrapholEdge } from "../graphol-elems/edge"
import GrapholEntity from "../graphol-elems/entity"
import GrapholElement from "../graphol-elems/graphol-element"
import { GrapholNode } from "../graphol-elems/node"
import { RDFGraphConfigEntityNameTypeEnum as EntityNameType } from "../rdf-graph/swagger"
import Filter from "../renderers/filter"
import { RendererStatesEnum } from "../renderers/i-render-state"
import GrapholscapeTheme from "../themes/theme"

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
  BackgroundClick = 'backgroundClick',
  ContextClick = 'contextClick',
  DoubleTap = 'doubleTap',
  EntityWikiLinkClick = 'entityWikiLinkClick',
  MouseOver = 'mouseOver',
  MouseOut = 'mouseOut'
}

export interface IonEvent {
  (event: LifecycleEvent.EntitySelection, callback: (entity: GrapholEntity, instance: GrapholElement) => void): void
  (event: LifecycleEvent.NodeSelection, callback: (node: GrapholNode) => void): void
  (event: LifecycleEvent.EdgeSelection, callback: (edge: GrapholEdge) => void): void
  (event: LifecycleEvent.ThemeChange, callback: (theme: GrapholscapeTheme) => void): void
  (event: LifecycleEvent.DiagramChange, callback: (diagram: Diagram) => void): void
  (event: LifecycleEvent.RendererChange, callback: (renderer: RendererStatesEnum) => void): void
  (event: LifecycleEvent.LanguageChange, callback: (language: string) => void): void
  (event: LifecycleEvent.EntityNameTypeChange, callback: (nameType: EntityNameType) => void): void
  (event: LifecycleEvent.Filter, callback: (filter: Filter) => void): void
  (event: LifecycleEvent.Unfilter, callback: (filter: Filter) => void): void
  (event: LifecycleEvent.FilterRequest, callback: (filter: Filter) => boolean): void
  (event: LifecycleEvent.UnfilterRequest, callback: (filter: Filter) => boolean): void
  (event: LifecycleEvent.BackgroundClick, callback: () => void): void
  (event: LifecycleEvent.ContextClick, callback: (eventObject: EventObject) => void): void
  (event: LifecycleEvent.DoubleTap, callback: (eventObject: EventObject) => void): void
  (event: LifecycleEvent.MouseOver, callback: (eventObject: EventObject) => void): void
  (event: LifecycleEvent.MouseOut, callback: (eventObject: EventObject) => void): void
  (event: LifecycleEvent.EntityWikiLinkClick, callback: (iri: string) => void): void
}

export interface IEventTriggers {
  (event: LifecycleEvent.EntitySelection, entity: GrapholEntity, instance: GrapholElement): void
  (event: LifecycleEvent.NodeSelection, node: GrapholNode): void
  (event: LifecycleEvent.EdgeSelection, edge: GrapholEdge): void
  (event: LifecycleEvent.ThemeChange, theme: GrapholscapeTheme): void
  (event: LifecycleEvent.DiagramChange, diagram: Diagram): void
  (event: LifecycleEvent.RendererChange, renderer: RendererStatesEnum): void
  (event: LifecycleEvent.LanguageChange, language: string): void
  (event: LifecycleEvent.EntityNameTypeChange, nameType: EntityNameType): void
  (event: LifecycleEvent.Filter, filter: Filter): void
  (event: LifecycleEvent.Unfilter, filter: Filter): void
  (event: LifecycleEvent.FilterRequest, filter: Filter): boolean
  (event: LifecycleEvent.UnfilterRequest, filter: Filter): boolean
  (event: LifecycleEvent.BackgroundClick): void
  (event: LifecycleEvent.ContextClick, eventObject: EventObject): void
  (event: LifecycleEvent.DoubleTap, eventObject: EventObject): void
  (event: LifecycleEvent.MouseOver, eventObject: EventObject): void
  (event: LifecycleEvent.MouseOut, eventObject: EventObject): void
  (event: LifecycleEvent.EntityWikiLinkClick, iri: string): void
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
  private backgroundClick: (() => void)[] = []
  private contextClick: ((eventObject: EventObject) => void)[] = []
  private doubleTap: ((eventObject: EventObject) => void)[] = []
  private mouseOver: ((eventObject: EventObject) => void)[] = []
  private mouseOut: ((eventObject: EventObject) => void)[] = []
  public entityWikiLinkClick: ((iri: string) => void)[] = []

  trigger: IEventTriggers = (event: string, ...params: any): any => {
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