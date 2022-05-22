import { ElementDefinition } from "cytoscape"
import GrapholNode from "../node"
import FakeGrapholNode from "./fake-base"

export class FakeTriangleLeft extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.width = this.width + 2
    this.fillColor = '#fcfcfc'
    this.shapePoints = '0 -1 -1 0 0 1'
  }

  toCyRepr(): ElementDefinition {
    const result = super.toCyRepr()
    result.classes = result.classes + ' fake-triangle'
    return result
  }
}

export class FakeTriangleRight extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.width = this.width + 2
    this.fillColor = '#000'
    this.shapePoints = '0 -1 1 0 0 1'
  }

  toCyRepr(): ElementDefinition {
    const result = super.toCyRepr()
    result.classes = result.classes + ' fake-triangle fake-triangle-right'
    return result
  }
}