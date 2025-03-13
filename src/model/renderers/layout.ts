import { Collection, LayoutOptions, SingularElementReturnValue } from "cytoscape"

export type LayoutHighLevelSetting<T> = {
  value: T,
  disabled: boolean,
}

export interface HighLevelSettings {
  edgeLengthFactor: LayoutHighLevelSetting<number>
  considerCrowdness: LayoutHighLevelSetting<boolean>
  avoidOverlap: LayoutHighLevelSetting<boolean>
  handleDisconnected: LayoutHighLevelSetting<boolean>
  randomize: LayoutHighLevelSetting<boolean>
  customEdgeLength?: (edge: any, considerCrowdness: boolean, edgeLengthFactor: number) => number
}

export abstract class GscapeLayout {
  abstract getCyOptions(graph: Collection): LayoutOptions
  abstract canBeInfinite: boolean
  abstract displayedName: string
  abstract id: string
  static defaultSettings: HighLevelSettings = {
    edgeLengthFactor: { value: 40, disabled: false },
    considerCrowdness: { value: true, disabled: false },
    avoidOverlap: { value: false, disabled: false },
    handleDisconnected: { value: true, disabled: false },
    randomize: { value: false, disabled: false },
  }

  customEdgeLength?: ((edge: any, considerCrowdness: boolean, edgeLengthFactor: number) => number) | undefined

  protected getEdgeLength(edge: SingularElementReturnValue, crowdness: boolean, edgeLengthFactor: number) {
    if (this.customEdgeLength) {
      return this.customEdgeLength(edge, crowdness, edgeLengthFactor)
    } else {
      return crowdness
        ? (4 * edgeLengthFactor) + edge.source().degree(true) + edge.target().degree(true)
        : this.edgeLengthFactor * 2.5
    }
  }

  public fit: boolean = false
  public infinite: boolean = false

  protected _highLevelSettings: HighLevelSettings

  constructor(highLevelSettings: Partial<HighLevelSettings> = {}) {
    this._highLevelSettings = JSON.parse(JSON.stringify({ ...GscapeLayout.defaultSettings, ...highLevelSettings }))
  }

  set highLevelSettings(newSettings: HighLevelSettings) {
    Object.entries(newSettings).forEach(([key, value]) => {
      this._highLevelSettings[key] = value
    })
  }
  get highLevelSettings() { return { ...this._highLevelSettings } }

  set edgeLengthFactor(edgeLengthFactor: number) {
    this._highLevelSettings.edgeLengthFactor.value = edgeLengthFactor < 1 ? 1 : edgeLengthFactor
  }
  get edgeLengthFactor() { return this._highLevelSettings.edgeLengthFactor.value }

  set considerCrowdness(considerCrowdness: boolean) { this._highLevelSettings.considerCrowdness.value = considerCrowdness }
  get considerCrowdness() { return this._highLevelSettings.considerCrowdness.value }

  set avoidOverlap(avoidOverlap: boolean) { this._highLevelSettings.avoidOverlap.value = avoidOverlap }
  get avoidOverlap() { return this._highLevelSettings.avoidOverlap.value }

  set handleDisconnected(handleDisconnected: boolean) { this._highLevelSettings.handleDisconnected.value = handleDisconnected }
  get handleDisconnected() { return this._highLevelSettings.handleDisconnected.value }

  set randomize(randomize: boolean) { this._highLevelSettings.randomize.value = randomize }
  get randomize() { return this._highLevelSettings.randomize.value }
}