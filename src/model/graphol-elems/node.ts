import { ElementDefinition } from "cytoscape"
import { Shape } from "./enums"
import GrapholEntity from "./entity"
import GrapholElement from "./graphol-element"
import { Node, Position, TypesEnum } from "../rdf-graph/swagger"

export const LABEL_HEIGHT = 23

export default class GrapholNode extends GrapholElement implements Node {

  static newFromSwagger(n: Node) {
    const instance = new GrapholNode(n.id, n.type)

    Object.entries(n).forEach(([key, value]) => {
      if (n[key] && key !== 'id' && key !== 'type') {
        instance[key] = value
      }
    })

    if (n.displayedName === 'or')
      console.log(instance)
    return instance
  }

  private _x = 0
  private _y = 0
  private _shape: Shape
  private _identity: TypesEnum
  private _height: number
  private _width: number
  private _fillColor: string
  private _labelHeight: number = LABEL_HEIGHT

  private _labelXpos?: number
  private _labelXcentered?: boolean
  private _labelYpos?: number
  private _labelYcentered?: boolean
  private _fontSize?: number
  protected _fakeNodes: GrapholNode[]

  // Inputs for role-chains, a list nodes IDs
  private _inputs?: string[]

  // shape points for nodes with non-standard shapes
  private _shapePoints?: string

  get position() { return { x: this.x, y: this.y } }
  set position(pos: Position) {
    this._x = pos.x
    this._y = pos.y
  }

  get x() { return this._x }
  set x(valX: number) { this._x = valX }
  get y() { return this._y }
  set y(valY: number) { this._y = valY }

  get shape() { return this._shape }
  set shape(shape: Shape) {
    this._shape = shape
  }

  get identity() { return this._identity }
  set identity(identity: TypesEnum) {
    this._identity = identity
  }

  get width() { return this._width }
  set width(width: number) {
    this._width = width >= 0 ? width : -width
  }

  get height() { return this._height }
  set height(height: number) {
    this._height = height >= 0 ? height : -height

    if (this.type === TypesEnum.FACET) {
      this._height = 40
    }
  }

  get fillColor() { return this._fillColor }
  set fillColor(fillColor: string) {
    this._fillColor = fillColor
  }

  get labelXpos(): number | undefined { return this._labelXpos }
  set labelXpos(labelXpos) {
    this._labelXpos = labelXpos
  }

  setLabelXposFromXML(labelXpos: number) {
    if (labelXpos === this.position.x) {
      this._labelXcentered = true
      this.labelXpos = 0
    } else {
      this.labelXpos = labelXpos - this.position.x + 1
    }
  }

  get labelHeight() { return this._labelHeight }
  set labelHeight(value: number) {
    this._labelHeight = value
  }

  get labelYpos(): number | undefined { return this._labelYpos }
  set labelYpos(labelYpos) {
    this._labelYpos = labelYpos
  }

  setLabelYposFromXML(labelYpos: number) {
    if (labelYpos === this.position.y) {
      this._labelYcentered = true
      this.labelYpos = 0
    } else {
      this.labelYpos = (labelYpos - this.y) + (this.height + 2) / 2 + this.labelHeight / 4
    }
  }

  get isLabelXcentered() { return this._labelXcentered }
  get isLabelYcentered() { return this._labelYcentered }

  get fontSize(): number | undefined { return this._fontSize }
  set fontSize(value) {
    this._fontSize = value
  }

  get inputs(): string[] | undefined { return this._inputs }
  set inputs(inputs) {
    this._inputs = inputs
  }

  get shapePoints(): string | undefined { return this._shapePoints }
  set shapePoints(shapePoints) {
    this._shapePoints = shapePoints
  }

  get fakeNodes() { return this._fakeNodes }

  addFakeNode(newFakeNode: GrapholNode) {
    if (!this._fakeNodes)
      this._fakeNodes = []

    this._fakeNodes.push(newFakeNode)
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const fakeNodesCytoscapeRepr: ElementDefinition[] = []
    const thisCytoscapeRepr = super.getCytoscapeRepr(grapholEntity)

    thisCytoscapeRepr[0].position = this.position
    Object.assign(thisCytoscapeRepr[0].data, {
      shape: this.shape || undefined,
      height: this.height || undefined,
      width: this.width || undefined,
      fillColor: this.fillColor || undefined,
      shapePoints: this.shapePoints || undefined,
      labelXpos: this.labelXpos || this.labelXpos == 0 ? this.labelXpos : undefined,
      labelYpos: this.labelYpos || this.labelYpos == 0 ? this.labelYpos : undefined,
      labelXcentered: this.isLabelXcentered,
      labelYcentered: this.isLabelYcentered,
      identity: this.identity,
    })

    if (!this.type)
      console.log(this)
    thisCytoscapeRepr[0].classes = this.type.toString()

    if (this.fakeNodes) {
      this.fakeNodes.forEach(fakeNode => {
        const fakeCyNode = fakeNode.getCytoscapeRepr(grapholEntity)
        fakeNodesCytoscapeRepr.push(...fakeCyNode)
      })
    }

    return [...fakeNodesCytoscapeRepr, ...thisCytoscapeRepr]
  }

  clone() {
    const cloneObj = new GrapholNode(this.id, this.type)
    Object.assign(cloneObj, this)

    return cloneObj
  }

  json(): Node {
    const result: Node = super.json()

    result.identity = this.identity
    result.position = this.position
    if (this.labelXpos !== undefined && this.labelYpos !== undefined) {
      result.labelPosition = {
        x: this.labelXpos,
        y: this.labelYpos,
      }
    }

    console.log(result)
    return result
  }
}

export function isGrapholNode(elem: GrapholElement): elem is GrapholNode {
  return (elem as GrapholNode).shape !== undefined
}