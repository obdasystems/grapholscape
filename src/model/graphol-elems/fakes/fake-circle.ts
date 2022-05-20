import { Shape } from "../../node-enums";
import GrapholNode from "../node";
import FakeGrapholNode from "./fake-base";

export default class FakeCircle extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    
    this.shape = Shape.ELLIPSE
    this.fillColor = '#fff'
    // this.x = this.position.x + ((this.width - this.height) / 2)
  }
}