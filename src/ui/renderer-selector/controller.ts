import { GscapeRenderSelector } from "."
import Grapholscape from '../../core'
import FloatyRendererState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import IncrementalRendererState from "../../core/rendering/incremental/incremental-render-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import setGraphEventHandlers from "../../core/set-graph-event-handlers"
import { initIncremental } from "../../incremental"
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { IBaseMixin } from "../common/base-widget-mixin"
import { WidgetEnum } from "../util/widget-enum"
import { rendererStates } from "./view-model"

export default function (rendererSelector: GscapeRenderSelector, grapholscape: Grapholscape) {

  rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey])
  rendererSelector.actualRendererStateKey = grapholscape.renderState

  rendererSelector.onRendererStateSelection = (rendererState) => rendererStateSelectionCallback(rendererState, grapholscape)

  rendererSelector.onIncrementalRefresh = () => {
    if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      (grapholscape.renderer.renderState as IncrementalRendererState).createNewDiagram();
      (grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as IBaseMixin).show()
      setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.actualRendererStateKey = newRendererState

    if (newRendererState === RendererStatesEnum.FLOATY)
      rendererSelector.layoutSettingsComponent.openPanel()
  })
}


export function rendererStateSelectionCallback(rendererState: RendererStatesEnum, grapholscape: Grapholscape) {
  if (rendererState !== grapholscape.renderState) {
    switch (rendererState) {
      case RendererStatesEnum.GRAPHOL:
        grapholscape.setRenderer(new GrapholRendererState())
        break

      case RendererStatesEnum.GRAPHOL_LITE:
        grapholscape.setRenderer(new LiteRendererState())
        break

      case RendererStatesEnum.FLOATY:
        grapholscape.setRenderer(new FloatyRendererState())
        break
    }

    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      const incrementalRendererState = new IncrementalRendererState()
      grapholscape.setRenderer(incrementalRendererState)
      initIncremental(incrementalRendererState, grapholscape);
      (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as unknown as IBaseMixin).hide();

      if (grapholscape.renderer.grapholElements?.size === 0) {
        (grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as IBaseMixin).show()
      }
    } else {
      (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as unknown as IBaseMixin).show();
      (grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as IBaseMixin).hide()

    }
  }
}