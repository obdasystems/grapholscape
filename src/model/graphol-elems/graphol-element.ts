import { ElementDefinition } from "cytoscape"
import { GrapholTypesEnum } from "./node-enums"
import GrapholEntity, { Functionalities } from "./entity"

export default class GrapholElement {
  // The id coming from xml
  private _id: string
  private _type: GrapholTypesEnum
  private _displayedName: string

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
      case GrapholTypesEnum.CONCEPT:
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
        displayedName: this.displayedName || undefined
      }
    }

    // Set functionality for data/object properties
    if (grapholEntity?.is(GrapholTypesEnum.DATA_PROPERTY) || grapholEntity?.is(GrapholTypesEnum.OBJECT_PROPERTY)) {
      result.data[Functionalities.functional] = grapholEntity.hasFunctionality(Functionalities.functional)
      result.data[Functionalities.inverseFunctional] = grapholEntity.hasFunctionality(Functionalities.inverseFunctional)
    }
    return [result]
  }
}