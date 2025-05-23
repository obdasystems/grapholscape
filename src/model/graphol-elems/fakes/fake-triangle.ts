import { ElementDefinition } from "cytoscape"
import GrapholEntity from "../entity"
import { GrapholNode } from "../node"
import FakeGrapholNode from "./fake-base"

export class FakeTriangleLeft extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    this.width = this.width + 2
    this.fillColor = '#fcfcfc'
    this.shapePoints = '0 -1 -1 0 0 1'
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].classes = ' fake-triangle'
    return result
  }
}

export class FakeTriangleRight extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    this.width = this.width + 2
    this.fillColor = '#000'
    this.shapePoints = '0 -1 1 0 0 1'
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].classes += ' fake-triangle fake-triangle-right'
    return result
  }
}