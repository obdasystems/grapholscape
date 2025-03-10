import { Collection } from "cytoscape";
import { GscapeLayout, HighLevelSettings } from "../../../model/renderers/layout";

export default class ClustersLayout extends GscapeLayout {
  id = 'cise'
  displayedName: string = 'Clusters'
  canBeInfinite: boolean = false

  static defaultSettings: HighLevelSettings = {
    ...GscapeLayout.defaultSettings,
    considerCrowdness: { disabled: true, value: false },
    avoidOverlap: { disabled: true, value: false },
    handleDisconnected: { disabled: true, value: false },
    randomize: { disabled: true, value: false }
  }
  protected _highLevelSettings: HighLevelSettings = JSON.parse(JSON.stringify(ClustersLayout.defaultSettings))

  private lastClusteredGraph?: Collection
  private nodesIdInclusters: string[][] = []
  
  private getClustersInGraph(graph: Collection): string[][] {
    if (!this.lastClusteredGraph?.same(graph)) {
      this.nodesIdInclusters = this.computeClusters(graph)
    }
    this.lastClusteredGraph = graph
    return this.nodesIdInclusters
  }

  /**
   * The clustering algorithm to be used to run the layout.
   * You can set your own or use the default, 
   * which is the markov clustering algorithm (https://micans.org/mcl/).
   * @param graph the graph to be clustered
   * @returns an array of arrays of nodes id, one array of IDs per cluster
   */
  computeClusters = (graph: Collection) => {
    return graph.markovClustering({ expandFactor: 3 }).map((nodes) => nodes.map(n => n.id()))
  }

  getCyOptions(graph: Collection) {
    return {
      name: this.id,
      clusters: this.getClustersInGraph(graph),
      animate: 'end',
      nodeSeparation: this.edgeLengthFactor * 0.2,
      idealInterClusterEdgeLengthCoefficient: this.edgeLengthFactor / 20,
      allowNodesInsideCircle: true,
      maxRatioOfNodesInsideCircle: 0.2,
      // animationDuration: 1000,
      // refresh: 1,
      // randomize: this.randomize,
      // nodeRepulsion: this.edgeLengthFactor * 2000,
      fit: this.fit
    }
  }

}