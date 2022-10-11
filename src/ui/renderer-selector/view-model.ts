import { SVGTemplateResult } from "lit"
import { RendererStatesEnum } from "../../model"
import { bubbles, graphol_icon, incremental, lite } from "../assets"

export type RendererStateViewModel = {
  name: string,
  id: RendererStatesEnum,
  icon: SVGTemplateResult,
  description?: string,
}

export type RendererStates = { [key in RendererStatesEnum]?: RendererStateViewModel }

export const rendererStates: RendererStates = {
  [RendererStatesEnum.GRAPHOL]: {
    name: 'Graphol',
    id: RendererStatesEnum.GRAPHOL,
    icon: graphol_icon,
    description: 'Full ontology representation'
  },
  [RendererStatesEnum.GRAPHOL_LITE]: {
    name: 'Graphol-lite',
    id: RendererStatesEnum.GRAPHOL_LITE,
    icon: lite,
    description: 'E/R like simplified representation'
  },
  [RendererStatesEnum.FLOATY]: {
    name: 'Floaty',
    id: RendererStatesEnum.FLOATY,
    icon: bubbles,
    description: 'Further simplified representation. Only classes and properties'
  },
  [RendererStatesEnum.INCREMENTAL]: {
    name: 'Incremental',
    id: RendererStatesEnum.INCREMENTAL,
    icon: incremental,
    description: 'Choose a class and explore adding other classe\' information on demand'
  }
}