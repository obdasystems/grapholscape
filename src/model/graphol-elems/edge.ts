import { ElementDefinition, Position } from "cytoscape";
import { GrapholTypesEnum } from "./node-enums";
import Breakpoint from "./breakpoint";
import GrapholEntity from "./entity";
import GrapholElement from "./graphol-element";


export default class GrapholEdge extends GrapholElement {
  private _sourceId: string
  private _targetId: string
  private _breakpoints: Breakpoint[] = []
  private _targetLabel: string
  private _sourceLabel: string
  private _sourceEndpoint: Position
  private _targetEndpoint: Position
  
  constructor(id: string) {
    super(id)
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
    if (endpoint.x !== 0 || endpoint.y !== 0)
      this._sourceEndpoint = endpoint
  }

  get targetEndpoint() {
    return this._targetEndpoint
  }

  set targetEndpoint(endpoint: Position) {
    if (endpoint.x !== 0 || endpoint.y !== 0)
      this._targetEndpoint = endpoint
  }

  /**
   * Returns an array of mid-edge breakpoints (without source/target endpoints)
   */
  public get breakpoints() {
    return this._breakpoints.slice(1, -1)
  }

  /**
   * Returns an array of all the breakpoints (including source/target endpoints)
   */
  public get controlpoints() {
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

  public get type() { return super.type }
  public set type(newType: GrapholTypesEnum) {
    super.type = newType

    if (this.is(GrapholTypesEnum.SAME) || this.is(GrapholTypesEnum.DIFFERENT))
      this.displayedName = this.type
  }

  public getCytoscapeRepr(grapholEntity?: GrapholEntity) {
    let result = super.getCytoscapeRepr(grapholEntity)
    Object.assign(result[0].data, {
      type: this.type || undefined,
      source: this.sourceId,
      target: this.targetId,
      sourceLabel: this.sourceLabel || undefined,
      targetLabel: this.targetLabel || undefined,
      sourceEndpoint: this.sourceEndpoint ? [this.sourceEndpoint.x, this.sourceEndpoint.y] : undefined,
      targetEndpoint: this.targetEndpoint ? [this.targetEndpoint.x, this.targetEndpoint.y] : undefined,
      segmentDistances: this.breakpoints.length > 0 ? this.breakpoints.map(b => b.distance) : undefined,
      segmentWeights: this.breakpoints.length > 0 ? this.breakpoints.map(b => b.weight) : undefined,
    })

    result[0].classes = this.type.toString()
    return result
  }
}

export function isGrapholEdge(elem: GrapholElement): elem is GrapholEdge {
  return (elem as GrapholEdge).sourceId !== undefined
}