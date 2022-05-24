import { ElementDefinition } from "cytoscape"
import { Shape } from "../node-enums"
import GrapholEntity from "../entity"
import GrapholNode from "../node"

export default class FakeGrapholNode extends GrapholNode {
  constructor(originalNode: GrapholNode) {
    super(originalNode.id)
    Object.assign(this, originalNode)
    this.shape = Shape.POLYGON
    this._fakeNodes = null
  }


  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result = super.getCytoscapeRepr(grapholEntity)
    result[0].selectable = false
    result[0].classes += ' no_overlay'
    delete result[0].data.id
    delete result[0].data.displayedName
    return result
  }
}