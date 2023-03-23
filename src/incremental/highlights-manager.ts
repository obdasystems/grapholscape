import { IVirtualKnowledgeGraphApi } from "./api/kg-api";
import { Branch } from "./api/swagger/models/Branch";
import { Highlights } from "./api/swagger/models/Highlights";

export default class HighlightsManager {

  private _dataProperties: Set<string>
  private _objectProperties: Map<string, Branch>

  private highlightsCallsPromises: Promise<Highlights>[] = []
  private computationPromise: Promise<void>

  public lastClassIris: string[] = []
  private actualClassIris: string[] = []

  constructor(public vkgApi: IVirtualKnowledgeGraphApi) {
    this._dataProperties = new Set()
    this._objectProperties = new Map()
    this.computationPromise = new Promise(() => { })
  }

  async computeHighlights(classesIri: string[]): Promise<void>
  async computeHighlights(classIri: string): Promise<void>
  async computeHighlights(classIriStringOrArray: string | string[]): Promise<void> {
    this.lastClassIris = this.actualClassIris
    this.actualClassIris = typeof classIriStringOrArray === 'string' ? [classIriStringOrArray] : classIriStringOrArray
    this.clear()

    this.computationPromise = new Promise((resolve, reject) => {
      for (let classIri of this.actualClassIris) {
        this.highlightsCallsPromises.push(this.vkgApi.getHighlights(classIri))
      }

      Promise.all(this.highlightsCallsPromises)
        .then(results => {
          for (let highlights of results) {
            highlights.dataProperties?.forEach(dp => this._dataProperties.add(dp))
            highlights.objectProperties?.forEach(op => {
              if (op.objectPropertyIRI && !this._objectProperties.has(op.objectPropertyIRI)) {
                this._objectProperties.set(op.objectPropertyIRI, op)
              }
            })
          }
          resolve()
        })
    })
  }

  async clear() {
    this.highlightsCallsPromises = []
    this._dataProperties.clear();
    this._objectProperties.clear();
  }

  async dataProperties() {
    await this.computationPromise

    return Array.from(this._dataProperties)
  }

  async objectProperties() {
    await this.computationPromise

    return Array.from(this._objectProperties).map(([_, opBranch]) => opBranch)
  }
}