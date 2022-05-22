import { ElementDefinition } from "cytoscape"
import { Shape } from "../../node-enums"
import GrapholNode from "../node"

export default class FakeGrapholNode extends GrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode.idXml, diagramId)
    Object.assign(this, originalNode)
    this.shape = Shape.POLYGON
  }


  toCyRepr(): ElementDefinition {
    const result = super.toCyRepr()
    result.selectable = false
    result.classes += ' no_overlay'
    delete result.data.id
    return result
  }
}