import { ElementDefinition } from "cytoscape"
import { Type } from "../node-enums"
import GrapholEntity, { Functionalities } from "./entity"

export default class GrapholElement {
  // The id coming from xml
  private _id: string
  private _type: Type
  private _displayedName: string

  constructor(id: string) {
    this.id = id
  }

  get id() { return this._id }
  set id(value: string) {
    this._id = value
  }

  get type() { return this._type }
  set type(type: Type) {
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
  is(type: Type): boolean {
    return this.type === type
  }

  /**
   * 
   * @returns whether node is an entity
   */
  isEntity(): boolean {
    switch (this.type) {
      case Type.CONCEPT:
      case Type.DATA_PROPERTY:
      case Type.OBJECT_PROPERTY:
      case Type.INDIVIDUAL:
        return true
    }

    return false
  }

  getCytoscapeRepr(grapholEntity: GrapholEntity): ElementDefinition[] {
    const result: ElementDefinition = {
      data: {
        id: this.id,
        type: this.type || undefined,
        displayedName: this.displayedName || undefined
      }
    }

    // Set functionality for data/object properties
    if (grapholEntity?.is(Type.DATA_PROPERTY) || grapholEntity?.is(Type.OBJECT_PROPERTY)) {
      result.data[Functionalities.functional] = grapholEntity.hasFunctionality(Functionalities.functional)
      result.data[Functionalities.inverseFunctional] = grapholEntity.hasFunctionality(Functionalities.inverseFunctional)
    }
    return [result]
  }
}