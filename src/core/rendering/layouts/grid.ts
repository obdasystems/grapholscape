import { GscapeLayout, HighLevelSettings } from "../../../model/renderers/layout"

export default class GridLayout extends GscapeLayout {
  id = 'grid'
  canBeInfinite: boolean = false
  displayedName: string = 'Grid'

  protected _highLevelSettings: HighLevelSettings = {
    edgeLengthFactor: {
      value: 40,
      disabled: false
    },
    considerCrowdness: {
      value: false,
      disabled: true
    },
    avoidOverlap: {
      value: true,
      disabled: false
    },
    handleDisconnected: {
      value: false,
      disabled: true
    },
    randomize: {
      value: false,
      disabled: true
    }
  }

  getCyOptions(): cytoscape.GridLayoutOptions {
    return {
      animate: true,
      name: "grid",
      spacingFactor: this.edgeLengthFactor < 10 ? 0.2 : this.edgeLengthFactor / 20,
      avoidOverlap: this.avoidOverlap,
      fit: this.fit
    }
  }
}