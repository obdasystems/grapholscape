import { GrapholscapeConfig } from "../config";
import { Grapholscape } from "../core";
import { DefaultFilterKeyEnum, getDefaultFilters, Ontology } from "../model";
import { DesignerLifeCycle } from "./lifecycle";

export default class GrapholscapeDesigner extends Grapholscape {
  readonly lifecycle: DesignerLifeCycle = new DesignerLifeCycle()

  constructor(ontology: Ontology, container: HTMLElement, config: GrapholscapeConfig | undefined){
    super(ontology, container, config)
    this.renderer.lifecycle = this.lifecycle

    this.renderer.filters = new Map()
    this.renderer.filters.set(DefaultFilterKeyEnum.DATA_PROPERTY, getDefaultFilters().DATA_PROPERTY)
    this.renderer.filters.set(DefaultFilterKeyEnum.INDIVIDUAL, getDefaultFilters().INDIVIDUAL)
  }

  on = this.lifecycle.on
}