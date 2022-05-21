import { Position } from "cytoscape";
import { Type } from "../node-enums";
import Breakpoint from "./breakpoint";
import GrapholElement from "./graphol-element";


export default class GrapholEdge extends GrapholElement {
  private _sourceId: string
  private _targetId: string
  private _breakpoints: Breakpoint[] = []
  private _targetLabel: string
  private _sourceLabel: string
  private _sourceEndpoint: Position
  private _targetEndpoint: Position
  
  constructor(idXml: string, diagramId: number) {
    super(idXml, diagramId)
  }

  addBreakPoint(breakpoint: Breakpoint) {
    if (!this._breakpoints)
      this._breakpoints = []

    this._breakpoints.push(breakpoint)
  }

  get sourceEndpoint() {
    return this._sourceEndpoint
  }

  set sourceEndpoint(endpoint: Position) {
    if (endpoint.x !== 0 && endpoint.y !== 0)
      this._sourceEndpoint = endpoint
  }

  get targetEndpoint() {
    return this._targetEndpoint
  }

  set targetEndpoint(endpoint: Position) {
    if (endpoint.x !== 0 && endpoint.y !== 0)
      this._targetEndpoint = endpoint
  }

  public get breakpoints() {
    return this._breakpoints
  }

  public get sourceId() {
    return this._sourceId
  }
  public set sourceId(sourceId: string) {
    this._sourceId = sourceId
  }

  public get targetId() {
    return this._targetId
  }
  public set targetId(targetId: string) {
    this._targetId = targetId
  }

  public get targetLabel() {
    return this._targetLabel
  }
  public set targetLabel(targetLabel: string) {
    this._targetLabel = targetLabel
  }

  public get sourceLabel() {
    return this._sourceLabel
  }
  public set sourceLabel(sourceLabel: string) {
    this._sourceLabel = sourceLabel
  }


  public set type(newType: Type) {
    super.type = newType

    if (this.is(Type.SAME) || this.is(Type.DIFFERENT))
      this.displayedName = this.type
  }
}