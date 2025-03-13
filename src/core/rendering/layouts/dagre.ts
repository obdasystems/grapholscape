import { Collection } from "cytoscape"
import { GscapeLayout, HighLevelSettings } from "../../../model/renderers/layout"

export default class DagreLayout extends GscapeLayout {
  id = 'dagre'
  canBeInfinite: boolean = false
  displayedName: string = 'Directed Acyclic Graph'
  fit: false

  protected defaultSettings: HighLevelSettings = {
    avoidOverlap: {
      value: false,
      disabled: true
    },
    considerCrowdness: {
      value: false,
      disabled: false
    },
    edgeLengthFactor: {
      value: 40,
      disabled: false
    },
    handleDisconnected: {
      value: false,
      disabled: true
    },
    randomize: {
      value: false,
      disabled: false
    }
  }

  getCyOptions(graph: Collection) {
    return {
      name: this.id,
      rankDir: 'BT',
      nodeSep: this.edgeLengthFactor,
      rankSep: this.considerCrowdness ? this.edgeLengthFactor * 2.5 * (graph.edges().size() / 10 || 1) : this.edgeLengthFactor * 2.5,
      fit: this.fit,
    }
  }
}