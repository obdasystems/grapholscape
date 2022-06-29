import { GrapholscapeTheme } from "../model"
import { DefaultThemes } from "../model/theme"
import Grapholscape from "./grapholscape"

export default class ThemeManager {
  private _grapholscape: Grapholscape
  theme: GrapholscapeTheme
  themes: GrapholscapeTheme[] = Object.values(DefaultThemes)
  private readonly CSS_PROPERTY_NAMESPACE = '--gscape-color'
  
  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }

  setTheme = (newThemeId: string) => {
    const newTheme = this.themes.find(t => t.id === newThemeId)

    if (newTheme) {
      this.theme = newTheme

      Object.entries(newTheme.colours).forEach(([colourName, colour]) => {
        this._grapholscape.container.style.setProperty(`${this.CSS_PROPERTY_NAMESPACE}-${colourName}`, colour)
      })

      this._grapholscape.renderer.setTheme(newTheme)
    }
  }

  addTheme = (newTheme: GrapholscapeTheme) => {
    this.themes.push(newTheme)
  }
}