import { GrapholscapeConfig } from "../config";
import { Grapholscape } from "../core";
import { Ontology } from "../model";
import { DesignerLifeCycle } from "./lifecycle";

export default class GrapholscapeDesigner extends Grapholscape {
  readonly lifecycle: DesignerLifeCycle = new DesignerLifeCycle()

  constructor(ontology: Ontology, container: HTMLElement, config: GrapholscapeConfig | undefined){
    super(ontology, container, config)
    this.on = this.lifecycle.on
    this.renderer.lifecycle = this.lifecycle
  }
}