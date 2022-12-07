import { storeConfigEntry } from "../../config"
import Grapholscape from '../../core'
import FloatyRendererState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import IncrementalRendererState from "../../core/rendering/incremental/incremental-render-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import { IncrementalController, startIncremental } from "../../incremental"
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { IBaseMixin } from "../common/base-widget-mixin"
import { GscapeEntityDetails } from "../entity-details"
import { GscapeFilters } from "../filters"
import { WidgetEnum } from "../util/widget-enum"
import GscapeRenderSelector from "./render-selector"
import { rendererStates } from "./view-model"

export default function (rendererSelector: GscapeRenderSelector, grapholscape: Grapholscape) {
  let existingIncrementalController: IncrementalController | undefined
  rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey])
  if (grapholscape.renderState) {
    rendererSelector.actualRendererStateKey = grapholscape.renderState

    if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      existingIncrementalController = new IncrementalController(grapholscape, grapholscape.renderer.renderState as IncrementalRendererState)
      startIncremental(grapholscape, existingIncrementalController)
    }
  }

  rendererSelector.onRendererStateSelection = (rendererState) => {
    rendererStateSelectionCallback(rendererState, grapholscape, existingIncrementalController)
  }

  rendererSelector.onIncrementalReset = () => {
    existingIncrementalController?.reset()
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.actualRendererStateKey = newRendererState

    if (newRendererState === RendererStatesEnum.FLOATY)
      rendererSelector.layoutSettingsComponent.openPanel()

    const filtersWidget = grapholscape.widgets.get(WidgetEnum.FILTERS) as GscapeFilters
    if (grapholscape.renderState === RendererStatesEnum.INCREMENTAL) {
      if (!existingIncrementalController) {
        existingIncrementalController = new IncrementalController(grapholscape, grapholscape.renderer.renderState as IncrementalRendererState)
      }
      startIncremental(grapholscape, existingIncrementalController)
      filtersWidget.hide()
    } else {
      existingIncrementalController?.clearState()
      existingIncrementalController?.hideUI()
      filtersWidget.show()
    }
  })
}

export function rendererStateSelectionCallback(
  rendererState: RendererStatesEnum,
  grapholscape: Grapholscape,
  existingIncrementalController?: IncrementalController) {

  if (rendererState !== grapholscape.renderState) {
    let isRenderValid = false
    switch (rendererState) {
      case RendererStatesEnum.GRAPHOL:
        grapholscape.setRenderer(new GrapholRendererState())
        isRenderValid = true
        break

      case RendererStatesEnum.GRAPHOL_LITE:
        grapholscape.setRenderer(new LiteRendererState())
        isRenderValid = true
        break

      case RendererStatesEnum.FLOATY:
        grapholscape.setRenderer(new FloatyRendererState())
        isRenderValid = true
        break
    }

    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      const incrementalRendererState = new IncrementalRendererState()
      grapholscape.setRenderer(incrementalRendererState)
      isRenderValid = true
    } else {
      (grapholscape.widgets.get(WidgetEnum.DIAGRAM_SELECTOR) as unknown as IBaseMixin).show();
      (grapholscape.widgets.get(WidgetEnum.ENTITY_SELECTOR) as unknown as IBaseMixin).hide()
      const entityDetailsWidget = grapholscape.widgets.get(WidgetEnum.ENTITY_DETAILS) as GscapeEntityDetails
      entityDetailsWidget.incrementalSection = undefined
    }

    if (isRenderValid)
      storeConfigEntry('selectedRenderer', rendererState)
  }
}