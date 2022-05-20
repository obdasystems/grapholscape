import { Shape } from "../../node-enums";
import GrapholNode from "../node";
import FakeGrapholNode from "./fake-base";

export class FakeTopRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.shapePoints = '-0.9 -1 1 -1 0.95 0 -0.95 0'
  }
}

export class FakeBottomRhomboid extends FakeGrapholNode {
  constructor(originalNode: GrapholNode, diagramId: number) {
    super(originalNode, diagramId)
    this.shapePoints = '-0.95 0 0.95 0 0.9 1 -1 1'
  }
}

