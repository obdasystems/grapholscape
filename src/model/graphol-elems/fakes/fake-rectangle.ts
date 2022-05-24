import { Shape } from "../node-enums"
import GrapholNode from "../node"
import FakeGrapholNode from "./fake-base"

export default class FakeRectangle extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    
    this.shape = Shape.RECTANGLE
    this.width = this.width - this.height
    this.fillColor = '#fff'
  }
}