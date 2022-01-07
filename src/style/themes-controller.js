import * as themes from './themes'

class ThemesController {
  constructor() {
    /** @type {Object<string, import('./themes').Theme>} */
    this.themes = {}
    for (let themeKey in themes) {
      this.themes[themeKey] = ThemesController.getNormalizedTheme(themes[themeKey])
    }

    this.actualThemeKey = ThemesController.DEFAULT
  }

  /**
   * 
   * @param {Theme} new_theme 
   * @param {string} key_value 
   */
  addTheme(new_theme, key_value) {
    this.themes[key_value] = JSON.parse(JSON.stringify(themes.gscape))

    // each new custom colour will overwrite the default one
    Object.keys(new_theme).forEach(color => {
      if (this.themes[key_value][color]) {
        this.themes[key_value][color] = new_theme[color]
      }
    })
  }

  /**
   * 
   * @param {string} themeKey 
   * @returns {Theme}
   */
  getTheme(themeKey) {
    return this.themes[themeKey] ? ThemesController.getNormalizedTheme(this.themes[themeKey]) : undefined
  }

  /** @returns {Theme} */
  static getNormalizedTheme(theme) {
    let theme_aux = {}

    Object.keys(theme).map(key => {
      // normalize theme using plain strings
      let color = typeof theme[key] == 'string' ? theme[key] : theme[key].cssText

      theme_aux[key] = color
    })

    return theme_aux
  }

  set actualTheme(themeKey) { this.actualThemeKey = themeKey }
  get actualTheme() { return this.getTheme(this.actualThemeKey) }
}

ThemesController.DEFAULT = 'gscape'

export default ThemesController