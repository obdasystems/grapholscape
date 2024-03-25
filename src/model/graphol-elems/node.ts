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
      if (n[key] !== undefined && n[key] !== null && key !== 'id' && key !== 'type') {

        if (key === 'labelPosition') {
          instance.labelXpos = n.labelPosition?.x
          instance.labelYpos = n.labelPosition?.y
        } else {
          instance[key] = value
        }

      }
    })

    if (instance.labelXpos === undefined || instance.labelXpos === null) {
      instance.labelXpos = 0
    }

    if (instance.labelYpos === undefined || instance.labelYpos === null) {
      instance.labelYpos = -18
    }

    return instance
  }

  private _x = 0
  private _y = 0
  private _renderedX?: number
  private _renderedY?: number
  private _shape: Shape
  private _identity: TypesEnum
  private _height: number
  private _width: number
  private _fillColor: string
  private _labelHeight: number = LABEL_HEIGHT

  private _hierarchyID?: string
  private _hierarchyForcedComplete?: boolean
  private _labelXpos?: number
  private _labelXcentered?: boolean = true
  private _labelYpos?: number
  private _labelYcentered?: boolean = true
  private _fontSize?: number
  protected _fakeNodes: GrapholNode[]

  // Inputs for role-chains, a list nodes IDs
  private _inputs?: string[]

  // shape points for nodes with non-standard shapes
  private _shapePoints?: string

  icon: string | undefined
  

  get position() { return { x: this.x, y: this.y } }
  set position(pos: Position) {
    this._x = pos.x
    this._y = pos.y
  }

  get renderedPosition() {
    if (this._renderedX !== undefined && this._renderedY !== undefined) 
      return { x: this._renderedX, y: this._renderedY }
  }
  set renderedPosition(pos: Position | undefined) {
    this._renderedX = pos?.x
    this._renderedY = pos?.y
  }

  get x() { return this._x }
  set x(valX: number) { this._x = valX }
  get y() { return this._y }
  set y(valY: number) { this._y = valY }

  get shape() { return this._shape }
  set shape(shape: Shape) {
    this._shape = shape
  }

  get hierarchyID() { return this._hierarchyID }
  set hierarchyID(hierarchyID: string | undefined) {
    this._hierarchyID = hierarchyID
  }

  get hierarchyForcedComplete() { return this._hierarchyForcedComplete }
  set hierarchyForcedComplete(complete: boolean | undefined) {
    this._hierarchyForcedComplete = complete
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
    if (labelXpos === 0) {
      this._labelXcentered = true
    }
  }

  setLabelXposFromXML(labelXpos: number) {
    if (labelXpos === this.position.x) {
      this.labelXpos = 0
    } else {
      this.labelXpos = labelXpos - this.position.x
    }
  }

  get labelHeight() { return this._labelHeight }
  set labelHeight(value: number) {
    this._labelHeight = value
  }

  get labelYpos(): number | undefined { return this._labelYpos }
  set labelYpos(labelYpos) {
    this._labelYpos = labelYpos
    if (labelYpos === 0) {
      this._labelYcentered = true
    }
  }

  setLabelYposFromXML(labelYpos: number) {
    if (labelYpos === this.position.y) {
      this.labelYpos = 0
    } else {
      this.labelYpos = labelYpos - this.y
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

  isHierarchy = () => {
    return this.is(TypesEnum.UNION) || this.is(TypesEnum.DISJOINT_UNION)
  }

  addFakeNode(newFakeNode: GrapholNode) {
    if (!this._fakeNodes)
      this._fakeNodes = []

    this._fakeNodes.push(newFakeNode)
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const fakeNodesCytoscapeRepr: ElementDefinition[] = []
    const thisCytoscapeRepr = super.getCytoscapeRepr(grapholEntity)

    if (this.renderedPosition) {
      thisCytoscapeRepr[0].renderedPosition = this.renderedPosition
    } else {
      thisCytoscapeRepr[0].position = this.position
    }
      
    Object.assign(thisCytoscapeRepr[0].data, {
      shape: this.shape || undefined,
      height: this.height || undefined,
      width: this.width || undefined,
      fillColor: this.fillColor || undefined,
      computedFillColor: grapholEntity?.color,
      shapePoints: this.shapePoints || undefined,
      labelXpos: this.labelXpos || this.labelXpos == 0 ? this.labelXpos : undefined,
      labelYpos: this.labelYpos || this.labelYpos == 0 ? this.labelYpos : undefined,
      labelXcentered: this.isLabelXcentered,
      labelYcentered: this.isLabelYcentered,
      identity: this.identity,
      hierarchyID: this.hierarchyID,
      hierarchyForcedComplete: this.hierarchyForcedComplete,
      icon: this.icon,
    })

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

    result.position = this.position
    if (this.labelXpos !== undefined && this.labelYpos !== undefined) {
      result.labelPosition = {
        x: this.labelXpos,
        y: this.labelYpos,
      }
    }

    return result
  }

  // static wrapDisplayedName(newDisplayedName: string, maxWidth = 40): string {
  //   const textWidth = document.createElement('canvas').getContext('2d')?.measureText(newDisplayedName).width

  //   if (textWidth && textWidth > maxWidth && maxWidth > 0) {
  //     const unitaryWidth = newDisplayedName.length / textWidth
  //     const numberOfChunks = Math.ceil(textWidth / maxWidth)
  //     const chunkWidth = Math.floor(textWidth / numberOfChunks)
  //     const charNumberPerChunk  = Math.floor(chunkWidth / unitaryWidth)

  //     let result = newDisplayedName
  //     let chunk
  //     for(let i = 0; i < numberOfChunks; i++) {
  //       chunk = result.substring((i * charNumberPerChunk) + i, ((i + 1) * charNumberPerChunk) + i)
  //       console.log(chunk)
  //       result.replace(chunk, chunk.concat('\n'))
  //     }

  //     return result
  //   } else {
  //     return newDisplayedName
  //   }
  // }
}

export function isGrapholNode(elem: GrapholElement): elem is GrapholNode {
  return (elem as GrapholNode).isLabelXcentered !== undefined
}