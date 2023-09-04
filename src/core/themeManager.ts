import { storeConfigEntry } from "../config"
import { autoDarkColourMap, autoLightColourMap, ColoursNames, CSS_PROPERTY_NAMESPACE, DefaultThemes, DefaultThemesEnum, GrapholscapeTheme, gscapeColourMap, LifecycleEvent, RendererStatesEnum } from "../model"
import Grapholscape from "./grapholscape"

/**
 * @internal
 */
export default class ThemeManager {
  private _grapholscape: Grapholscape
  theme: GrapholscapeTheme
  themes: Set<GrapholscapeTheme> = new Set(Object.values(DefaultThemes))

  private colorfulThemeLight = new GrapholscapeTheme(DefaultThemesEnum.COLORFUL_LIGHT, autoLightColourMap, 'Colorful - Light')
  private colorfulThemeDark = new GrapholscapeTheme(DefaultThemesEnum.COLORFUL_DARK, autoDarkColourMap, 'Colorful - Dark')
  
  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape

    if (grapholscape.renderState === RendererStatesEnum.FLOATY) {
      this.addTheme(this.colorfulThemeLight)
      this.addTheme(this.colorfulThemeDark)
    }

    grapholscape.on(LifecycleEvent.RendererChange, (renderer) => {
      if (renderer === RendererStatesEnum.FLOATY) {
        this.addTheme(this.colorfulThemeLight)
        this.addTheme(this.colorfulThemeDark)
      } else {
        this.removeTheme(this.colorfulThemeLight)
        this.removeTheme(this.colorfulThemeDark)
      }
    })
  }

  setTheme(newThemeId: string) {
    const newTheme = Array.from(this.themes).find(t => t.id === newThemeId)

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
    this.themes.add(newTheme)
  }

  removeTheme(theme: GrapholscapeTheme) {
    this.themes.delete(theme)
  }

  removeThemes() {
    this.themes.clear()
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