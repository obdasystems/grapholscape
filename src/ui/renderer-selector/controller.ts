import { SVGTemplateResult } from "lit"
import { GscapeRenderSelector } from "."
import Grapholscape from '../../core'
import FloatyRendererState from "../../core/rendering/floaty/floaty-renderer-state"
import GrapholRendererState from "../../core/rendering/graphol/graphol-renderer-state"
import IncrementalRendererState from "../../core/rendering/incremental/incremental-render-state"
import LiteRendererState from "../../core/rendering/lite/lite-renderer-state"
import { addClassNeighbourhood } from "../../incremental"
import { LifecycleEvent, RendererStatesEnum } from "../../model"
import { bubbles, graphol_icon, incremental, lite } from "../assets/icons"

export type RendererStateViewModel = {
  name: string,
  id: RendererStatesEnum,
  icon: SVGTemplateResult,
}

export type RendererStates = { [key in RendererStatesEnum]?: RendererStateViewModel }

const rendererStates: RendererStates = {}

rendererStates[RendererStatesEnum.GRAPHOL] = {
  name: 'Graphol',
  id: RendererStatesEnum.GRAPHOL,
  icon: graphol_icon,
}

rendererStates[RendererStatesEnum.GRAPHOL_LITE] = {
  name: 'Graphol-lite',
  id: RendererStatesEnum.GRAPHOL_LITE,
  icon: lite,
}

rendererStates[RendererStatesEnum.FLOATY] = {
  name: 'Floaty',
  id: RendererStatesEnum.FLOATY,
  icon: bubbles,
}

rendererStates[RendererStatesEnum.INCREMENTAL] = {
  name: 'Incremental',
  id: RendererStatesEnum.INCREMENTAL,
  icon: incremental,
}

export default function (rendererSelector: GscapeRenderSelector, grapholscape: Grapholscape) {
  
  rendererSelector.rendererStates = grapholscape.renderers.map(rendererStateKey => rendererStates[rendererStateKey])
  rendererSelector.actualRendererStateKey = grapholscape.renderState

  rendererSelector.onRendererStateSelection = (rendererState) => {
    if (rendererState !== grapholscape.renderState) {
      switch(rendererState) {
        case RendererStatesEnum.GRAPHOL:
          grapholscape.setRenderer(new GrapholRendererState())
          break

        case RendererStatesEnum.GRAPHOL_LITE:
          grapholscape.setRenderer(new LiteRendererState())
          break

        case RendererStatesEnum.FLOATY:
          grapholscape.setRenderer(new FloatyRendererState())
          break

        case RendererStatesEnum.INCREMENTAL:
          const incrementalRendererState = new IncrementalRendererState()
          grapholscape.setRenderer(incrementalRendererState)
          //incrementalRendererState.runLayoutInfinitely()
          const pizzaEntity = grapholscape.ontology.getEntity('http://www.datiopen.istat.it/Ontologie/RSBL#Cittadinanza')
          const pizzaOccurrence = grapholscape.ontology.getEntityOccurrences('http://www.datiopen.istat.it/Ontologie/RSBL#Cittadinanza').get(RendererStatesEnum.GRAPHOL)[0]
          const pizzaGrapholElement = grapholscape.ontology.getGrapholElement(pizzaOccurrence.elementId)

          incrementalRendererState.onEntityExpansion((selectedElement) => {
            addClassNeighbourhood(selectedElement, grapholscape.ontology, incrementalRendererState)
          })
          
          grapholscape.renderer.diagram.addElement(pizzaGrapholElement, pizzaEntity)
          break
      }
    }
  }

  grapholscape.on(LifecycleEvent.RendererChange, (newRendererState) => {
    rendererSelector.actualRendererStateKey = newRendererState

    if (newRendererState === RendererStatesEnum.FLOATY)
      rendererSelector.layoutSettingsComponent.openPanel()
  })
}