import { Position } from "../ontology";

export default class GrapholNode {
  private _id: string
  private _position: Position

  constructor(id: string, position: Position) {
    this.id = id
    this.position = position
  }


  get id () { return this._id }
  set id(value: string) {
    this._id = value
  }

  get position() { return this._position }
  set position(pos: Position) {
    this._position = pos
  }
}