import { Shape } from "../enums"
import { GrapholNode } from "../node"
import FakeGrapholNode from "./fake-base"

export default class FakeCircle extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    
    this.shape = Shape.ELLIPSE
    this.width = this.height
  }
}

export class FakeCircleRight extends FakeCircle {
  constructor(originalNode: GrapholNode) {
    super(originalNode)

    this.x = originalNode.x + (originalNode.width / 2) - (this.width / 2)
  }
}

export class FakeCircleLeft extends FakeCircle {
  constructor(originalNode: GrapholNode) {
    super(originalNode)

    this.x = originalNode.x - (originalNode.width / 2) + (this.width / 2)
  }
}