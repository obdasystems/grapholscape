import { ElementDefinition } from "cytoscape"
import GrapholEntity from "../entity"
import GrapholNode from "../node"
import FakeGrapholNode from "./fake-base"

export class FakeTopRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    this.shapePoints = '-0.9 -1 1 -1 0.95 0 -0.95 0'
    this.fillColor = '#dedede'
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].classes += ' fake-top-rhomboid'
    return result
  }
}

export class FakeBottomRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode)
    this.shapePoints = '-0.95 0 0.95 0 0.9 1 -1 1'
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].classes += ' fake-bottom-rhomboid'
    return result
  }
}

