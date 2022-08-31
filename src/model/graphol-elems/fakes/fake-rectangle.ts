import { Shape } from "../node-enums"
import GrapholNode from "../node"
import FakeGrapholNode from "./fake-base"
import GrapholEntity from "../entity"
import { ElementDefinition } from "cytoscape"

export default class FakeRectangle extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    
    this.shape = Shape.RECTANGLE
    this.width = this.width - this.height
  }
}

export class FakeRectangleFront extends FakeRectangle {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    
    this.height -= 1
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].classes += ' no_border'
    return result
  }
}