import { ElementDefinition, Position } from "cytoscape"
import { Shape, GrapholTypesEnum } from "./node-enums"
import GrapholEntity from "./entity"
import GrapholElement from "./graphol-element"

export const LABEL_HEIGHT = 23

export default class GrapholNode extends GrapholElement {

  private _position: Position = { x: 0, y: 0 }
  private _shape: Shape
  private _identity: GrapholTypesEnum
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

  get position() { return this._position }
  set position(pos: Position) {
    this._position = pos
  }

  get x() { return this._position.x }
  set x(valX: number) { this._position.x = valX }
  get y() { return this._position.y }
  set y(valY: number) { this._position.y = valY }

  get shape() { return this._shape }
  set shape(shape: Shape) {
    this._shape = shape
  }

  get identity() { return this._identity }
  set identity(identity: GrapholTypesEnum) {
    this._identity = identity
  }

  get width() { return this._width }
  set width(width: number) {
    this._width = width >= 0 ? width : -width
  }

  get height() { return this._height }
  set height(height: number) {
    this._height = height >= 0 ? height : -height

    if (this.type === GrapholTypesEnum.FACET) {
      this._height = 40
    }
  }

  get fillColor() { return this._fillColor }
  set fillColor(fillColor: string) {
    this._fillColor = fillColor
  }

  get labelXpos() { return this._labelXpos }
  set labelXpos(labelXpos: number) {
    if (labelXpos === this.position.x) {
      this._labelXcentered = true
      this._labelXpos = 0
    } else {
      this._labelXpos = labelXpos - this.position.x + 1
    }
  }

  get labelHeight() { return this._labelHeight }
  set labelHeight(value: number) {
    this._labelHeight = value
  }

  get labelYpos() { return this._labelYpos }
  set labelYpos(labelYpos: number) {
    if (labelYpos === this.position.y) {
      this._labelYcentered = true
      this._labelYpos = 0
    } else {
      this._labelYpos = (labelYpos - this.y) + (this.height + 2) / 2 + this.labelHeight / 4
    }
  }

  get isLabelXcentered() { return this._labelXcentered }
  get isLabelYcentered() { return this._labelYcentered }

  get fontSize() { return this._fontSize }
  set fontSize(value: number) {
    this._fontSize = value
  }

  get inputs() { return this._inputs }
  set inputs(inputs: string[]) {
    this._inputs = inputs
  }

  get shapePoints() { return this._shapePoints }
  set shapePoints(shapePoints: string) {
    this._shapePoints = shapePoints
  }

  get fakeNodes() { return this._fakeNodes }

  addFakeNode(newFakeNode: GrapholNode) {
    if (!this._fakeNodes)
      this._fakeNodes = []

    this._fakeNodes.push(newFakeNode)
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const fakeNodesCytoscapeRepr = []
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
    })

    thisCytoscapeRepr[0].classes = this.type.toString()
    if (this.is(GrapholTypesEnum.PROPERTY_ASSERTION)) {
      thisCytoscapeRepr[0].classes += ' no_border'
    }

    if (this.fakeNodes) {
      this.fakeNodes.forEach(fakeNode => {
        const fakeCyNode = fakeNode.getCytoscapeRepr(grapholEntity)
        fakeNodesCytoscapeRepr.push(...fakeCyNode)
      })
    }

    return [...fakeNodesCytoscapeRepr, ...thisCytoscapeRepr]
  }
}

export function isGrapholNode(elem: GrapholElement): elem is GrapholNode {
  return (elem as GrapholNode).shape !== undefined
}