import Lifecycle, { LifecycleEvent } from "../lifecycle";
import GrapholscapeTheme from "../model/theme";

export const addTheme = function (newTheme: GrapholscapeTheme) {
  const themes: GrapholscapeTheme[] = this.themes
  themes.push(newTheme)
}

export const setTheme = function (theme: GrapholscapeTheme) {
  const actualState = this.actualState
  actualState.diagram.setTheme(theme)
  
  const lifecycle: Lifecycle = this.lifecycle
  lifecycle.trigger(LifecycleEvent.ThemeChange, theme)
}

