import GrapholNode from "../node"

export default class FakeGrapholNode extends GrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode.idXml, diagramId)
    Object.assign(this, originalNode)
  }
}