import { Grapholscape } from "../../../core";
import { rendererStateSelectionCallback } from "../controller";
import { rendererStates } from "../view-model";
import GscapeWelcomeRendererSelector from "./welcome-renderer-selector";

export default function (welcomeRendererSelector: GscapeWelcomeRendererSelector, grapholscape: Grapholscape) {
  welcomeRendererSelector.rendererStates = grapholscape.renderers.map(rendererStateId => rendererStates[rendererStateId])

  welcomeRendererSelector.onRendererStateSelection = (rendererState) => rendererStateSelectionCallback(rendererState, grapholscape)
}