import { Grapholscape } from "../../core";
import { RendererStatesEnum } from "../../model";
import { rendererStateSelectionCallback } from "../renderer-selector/controller";
import { rendererStates } from "../renderer-selector/view-model";
import GscapeFullPageSelector from "./full-page-selector";

export default function (welcomeRendererSelector: GscapeFullPageSelector, grapholscape: Grapholscape) {
  welcomeRendererSelector.options = grapholscape.renderers.map(rendererStateId => rendererStates[rendererStateId])

  welcomeRendererSelector.onOptionSelection = (optionId) => rendererStateSelectionCallback(optionId as RendererStatesEnum, grapholscape)
}