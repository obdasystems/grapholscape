import { classicColourMap, ColourMap, ColoursNames, darkColourMap, gscapeColourMap } from "../style/themes"

export default class GrapholscapeTheme {
  private _id: string
  private _name: string
  colours: ColourMap = JSON.parse(JSON.stringify(gscapeColourMap))

  constructor(id: string, colours?: ColourMap, name?: string) {
    this._id = id
    this.name = name || ''

    if (colours) {
      Object.entries(colours).forEach(([colourName, colour]) => {
        this.colours[colourName] = colour
      })
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

export enum DefaultThemesEnum {
  GRAPHOLSCAPE = 'grapholscape',
  GRAPHOL = 'graphol',
  DARK = 'dark',
}

export const DefaultThemes: { [key in DefaultThemesEnum]: GrapholscapeTheme } = {
  grapholscape: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOLSCAPE, gscapeColourMap, 'Grapholscape'),
  graphol: new GrapholscapeTheme(DefaultThemesEnum.GRAPHOL, classicColourMap, 'Graphol'),
  dark: new GrapholscapeTheme(DefaultThemesEnum.DARK, darkColourMap, 'Dark'),
}