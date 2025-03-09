import { ElementDefinition } from "cytoscape"
import { Shape } from "../enums"
import GrapholEntity from "../entity"
import { GrapholNode } from "../node"

export default class FakeGrapholNode extends GrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode.id, originalNode.type)
    Object.assign(this, originalNode)
    this.shape = Shape.POLYGON
    this._fakeNodes = []
  }


  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].selectable = false
    result[0].classes += ' no_overlay'
    result[0].data.fake = true
    delete result[0].data.id
    delete result[0].data.displayedName
    return result
  }
}