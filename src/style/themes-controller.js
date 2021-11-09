import * as themes from './themes'

export default class ThemesController {
  constructor() {
    this.themes = {}
    Object.assign(this.themes, themes)

    this.actualThemeKey = 'gscape'
  }

  addTheme(new_theme, key_value) {
    this.themes[key_value] = JSON.parse(JSON.stringify(themes.gscape))

    // each new custom colour will overwrite the default one
    Object.keys(new_theme).forEach( color => {
      if (this.themes[key_value][color]) {
        this.themes[key_value][color] = new_theme[color]
      }
    })
  }

  getTheme(themeKey) {
    return this.getNormalizedTheme(this.themes[themeKey])
  }

  getNormalizedTheme(theme) {
    // update theme with custom variables "--theme-gscape-[var]" values
    let theme_aux = {}
  
    
    Object.keys(theme).map(key => {
      // normalize theme using plain strings
      let color = typeof theme[key] == 'string' ? theme[key] : theme[key].cssText
      //guiContainer.style.setProperty(css_key, color)
      theme_aux[key] = color
    })
  
    return theme_aux
  }
  
  set actualTheme(themeKey) { this.actualThemeKey = themeKey }
  get actualTheme() { return this.getTheme(this.actualThemeKey)}
}