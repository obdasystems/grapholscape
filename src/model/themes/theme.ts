import { ColourMap, ColoursNames } from "./colours"

export default class GrapholscapeTheme {
  private _id: string
  private _name: string
  colours: ColourMap = { }

  constructor(id: string, colours?: ColourMap, name?: string) {
    this._id = id
    this.name = name || ''

    if (colours) {
      this.colours = colours
    }
  }

  get id() { return this._id }
  get name() { return this._name || this.id }
  set name(newName) { this._name = newName }

  getColour(name: ColoursNames) {
    return this.colours[name]
  }

  setColour(name: ColoursNames, colourValue: string) {
    this.colours[name] = colourValue
  }
}