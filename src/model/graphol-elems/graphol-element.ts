import { ElementDefinition } from "cytoscape"
import { GrapholTypesEnum } from "./node-enums"
import GrapholEntity, { FunctionalityEnum } from "./entity"

export default class GrapholElement {
  // The id coming from xml
  private _id: string
  private _type: GrapholTypesEnum
  private _displayedName: string
  private _originalId: string // In case of replicated elements, this is the id of the original node
  private _iri?: string

  constructor(id: string) {
    this.id = id
  }

  get id() { return this._id }
  set id(value: string) {
    this._id = value
  }

  get type() { return this._type }
  set type(type: GrapholTypesEnum) {
    this._type = type
  }

  get displayedName() { return this._displayedName }
  set displayedName(displayedName: string) {
    this._displayedName = displayedName
  }

  get originalId() { return this._originalId }
  set originalId(id: string) { this._originalId = id }

  get iri() { return this._iri }
  set iri(iri: string | undefined) { this._iri = iri }

  /**
   * Check if node is of a certain type
   * @param type 
   */
  is(type: GrapholTypesEnum): boolean {
    return this.type === type
  }

  /**
   * 
   * @returns whether node is an entity
   */
  isEntity(): boolean {
    switch (this.type) {
      case GrapholTypesEnum.CLASS:
      case GrapholTypesEnum.DATA_PROPERTY:
      case GrapholTypesEnum.OBJECT_PROPERTY:
      case GrapholTypesEnum.INDIVIDUAL:
        return true
    }

    return false
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result: ElementDefinition = {
      data: {
        id: this.id,
        type: this.type || undefined,
        displayedName: this.displayedName || undefined,
        originalId: this.originalId || undefined,
        iri: this.iri || grapholEntity?.iri.fullIri,
        datatype: grapholEntity?.datatype,
      }
    }

    // Set functionality for data/object properties
    if (grapholEntity?.is(GrapholTypesEnum.DATA_PROPERTY) || grapholEntity?.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
      result.data[FunctionalityEnum.functional] = grapholEntity.hasFunctionality(FunctionalityEnum.functional)
      result.data[FunctionalityEnum.inverseFunctional] = grapholEntity.hasFunctionality(FunctionalityEnum.inverseFunctional)
    }
    return [result]
  }
}