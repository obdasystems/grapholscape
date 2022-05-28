import { Diagram } from "../../../model";
import DiagramRepresentation from "../../../model/diagrams/diagram-representation";

interface Transformer {
  transform(diagram: Diagram): DiagramRepresentation
}

export default class LiteTransformer implements Transformer{
  transform(diagram: Diagram): DiagramRepresentation {
    const liteRepresentation = new DiagramRepresentation()

    return liteRepresentation
  }

}