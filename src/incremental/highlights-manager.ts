import { TypesEnum } from "../model";
import { IVirtualKnowledgeGraphApi } from "./api/kg-api";
import { EmptyUnfoldingEntities } from "./api/model";
import { Branch } from "./api/swagger/models/Branch";
import { Highlights } from "./api/swagger/models/Highlights";

export default class HighlightsManager {

  private _dataProperties: Set<string>
  private _objectProperties: Map<string, Branch>

  private highlightsCallsPromises: Promise<Highlights>[] = []
  private computationPromise: Promise<void>

  public lastClassIris: string[] = []
  private currentClassIris: string[] = []

  private emptyUnfoldingsDataProperties: string[] = []
  private emptyUnfoldingsObjectProperties: string[] = []
  private emptyUnfoldingsClasses: string[] = []

  constructor(public vkgApi: IVirtualKnowledgeGraphApi, private emptyUnfoldingEntities: EmptyUnfoldingEntities) {
    this._dataProperties = new Set()
    this._objectProperties = new Map()
    this.computationPromise = new Promise(() => { })
    this.emptyUnfoldingsDataProperties = this.emptyUnfoldingEntities.emptyUnfoldingDataProperties.map(e => e.entityIRI)
    this.emptyUnfoldingsObjectProperties = this.emptyUnfoldingEntities.emptyUnfoldingObjectProperties.map(e => e.entityIRI)
    this.emptyUnfoldingsClasses = this.emptyUnfoldingEntities.emptyUnfoldingClasses.map(e => e.entityIRI)
  }

  async computeHighlights(classesIri: string[]): Promise<void>
  async computeHighlights(classIri: string): Promise<void>
  async computeHighlights(classIriStringOrArray: string | string[]): Promise<void> {
    this.lastClassIris = this.currentClassIris
    this.currentClassIris = typeof classIriStringOrArray === 'string' ? [classIriStringOrArray] : classIriStringOrArray
    this.clear()

    this.computationPromise = new Promise((resolve, reject) => {
      for (let classIri of this.currentClassIris) {
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

  public hasUnfoldings(entityIri: string, entityType: TypesEnum) {
    switch (entityType) {
      case TypesEnum.DATA_PROPERTY:
        return !this.emptyUnfoldingsDataProperties.includes(entityIri)

        case TypesEnum.OBJECT_PROPERTY:
          return !this.emptyUnfoldingsObjectProperties.includes(entityIri)

        case TypesEnum.CLASS:
          return !this.emptyUnfoldingsClasses.includes(entityIri)

      default:
        return false
    }
  }
}