import { GscapeLayout } from "../../../model/renderers/layout"

export default class ColaLayout extends GscapeLayout {
  id = 'cola'
  canBeInfinite = true
  displayedName: string = 'Cola (Constraint based)'

  getCyOptions() {
    return {
      name: this.id,
      avoidOverlap: false,
      edgeLength: (edge) => this.getEdgeLength(edge, this.considerCrowdness, this.edgeLengthFactor),
      fit: this.fit,
      maxSimulationTime: 4000,
      infinite: this.infinite,
      handleDisconnected: this.handleDisconnected, // if true, avoids disconnected components from overlapping
      centerGraph: this.randomize,
      randomize: this.randomize,
    }
  }
}