import { Grapholscape } from "../../core";
import { WidgetEnum } from "../util/widget-enum";
import init from "./controller";
import { GscapeEntitySelector } from "./entity-selector";

export * from './entity-selector'

export default function initEntitySelector(grapholscape: Grapholscape) {
  const entitySelectorComponent = new GscapeEntitySelector()
  init(entitySelectorComponent, grapholscape)
  grapholscape.widgets.set(WidgetEnum.ENTITY_SELECTOR, entitySelectorComponent)
}