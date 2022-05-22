import { ElementDefinition } from "cytoscape"
import GrapholNode from "../node"
import FakeGrapholNode from "./fake-base"

export class FakeTopRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.shapePoints = '-0.9 -1 1 -1 0.95 0 -0.95 0'
  }

  toCyRepr(): ElementDefinition {
    const result = super.toCyRepr()
    result.classes += ' fake-top-rhomboid'
    return result
  }
}

export class FakeBottomRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.shapePoints = '-0.95 0 0.95 0 0.9 1 -1 1'
  }

  toCyRepr(): ElementDefinition {
    const result = super.toCyRepr()
    result.classes += ' fake-bottom-rhomboid'
    return result
  }
}

