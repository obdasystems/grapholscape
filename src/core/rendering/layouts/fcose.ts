import { Collection, SingularElementReturnValue } from "cytoscape"
import { GscapeLayout, HighLevelSettings } from "../../../model/renderers/layout"

export default class FcoseLayout extends GscapeLayout {
  id = 'fcose'
  canBeInfinite: boolean = false
  displayedName: string = 'Compound Spring Embedder'
  fit: false

  static defaultSettings: HighLevelSettings = {
    ...GscapeLayout.defaultSettings,
    avoidOverlap: {
      value: false,
      disabled: true,
    },
    handleDisconnected: {
      value: false,
      disabled: true
    },
  }
  protected _highLevelSettings: HighLevelSettings = JSON.parse(JSON.stringify(FcoseLayout.defaultSettings))

  getEdgeLength(edge: SingularElementReturnValue, crowdness: boolean, edgeLengthFactor: number): number {
    const baseLength = crowdness
      ? (edge.source().degree(true) + edge.target().degree(true)) * 2 + edgeLengthFactor
      : edgeLengthFactor
    return baseLength * 3
  }

  getCyOptions(graph: Collection) {
    return {
      name: this.id,
      quality: "default",
      fit: this.fit,
      // avoidOverlap: this.avoidOverlap,
      idealEdgeLength: (edge) => this.getEdgeLength(edge, this.considerCrowdness, this.edgeLengthFactor),
      edgeElasticity: edge => {
        return this.considerCrowdness ? (edge.source().degree(true) + edge.target().degree(true) / graph.edges().size()) * 0.4 : 0.45
      },
      gravity: this.considerCrowdness ? 0.35 / graph.edges().size() : 0.25,
      randomize: this.randomize,
    }
  }
}