import { Type } from "../node-enums"

export default class GrapholElement {
  // unique id build as [idXml_diagramId]
  private _id: string
  // The id coming from xml
  private _idXml: string
  private _type: Type

  constructor(idXml: string, diagramId: number) {
    this.id = `${idXml}_${diagramId}`
    this.idXml = idXml
  }

  get id() { return this._id }
  set id(value: string) {
    this._id = value
  }

  get idXml() { return this._idXml }
  set idXml(value: string) {
    this._idXml = value
  }

  get type() { return this._type }
  set type(type: Type) {
    this._type = type
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
}