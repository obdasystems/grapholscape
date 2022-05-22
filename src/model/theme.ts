import { classicColourMap, ColourMap, ColoursNames, darkColourMap, gscapeColourMap } from "../style/themes"


export default class GrapholscapeTheme {
  private _id: string
  private _name: string
  colours: ColourMap
  static defaultTheme = new GrapholscapeTheme('default', gscapeColourMap, 'Grapholscape')
  static classicTheme = new GrapholscapeTheme('classic', classicColourMap, 'Classic')
  static darkTheme = new GrapholscapeTheme('dark', darkColourMap, 'Dark')

  constructor(id: string, colours?: ColourMap, name?: string) {
    this._id = id
    this.colours = colours || gscapeColourMap
    this.name = name
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

