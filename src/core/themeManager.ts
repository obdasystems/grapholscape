import { storeConfigEntry } from "../config/config-manager"
import { ColoursNames, CSS_PROPERTY_NAMESPACE, DefaultThemes, GrapholscapeTheme, gscapeColourMap, LifecycleEvent } from "../model"
import Grapholscape from "./grapholscape"

/**
 * @internal
 */
export default class ThemeManager {
  private _grapholscape: Grapholscape
  theme: GrapholscapeTheme
  themes: GrapholscapeTheme[] = Object.values(DefaultThemes)
  
  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }

  setTheme(newThemeId: string) {
    const newTheme = this.themes.find(t => t.id === newThemeId)

    if (newTheme) {
      this.setMissingColours(newTheme)
      this.theme = newTheme

      Object.entries(newTheme.colours).forEach(([colourName, colour]) => {
        this._grapholscape.container.style.setProperty(`${CSS_PROPERTY_NAMESPACE}-${colourName}`, colour)
      })

      this._grapholscape.renderer.setTheme(newTheme)

      this._grapholscape.lifecycle.trigger(LifecycleEvent.ThemeChange, newTheme)
      storeConfigEntry('selectedTheme', newThemeId)
    }
  }

  addTheme(newTheme: GrapholscapeTheme) {
    this.themes.push(newTheme)
  }

  removeThemes() {
    this.themes = []
  }

  private setMissingColours(theme: GrapholscapeTheme) {
    // Set default theme colours for missing colours
    Object.entries(gscapeColourMap).forEach(([colourName, colourValue]) => {
      const _colourName = colourName as ColoursNames
      if (!theme.getColour(_colourName))
        theme.setColour(_colourName, colourValue)
    })
  }
}