import Grapholscape from '../../core';
import { LifecycleEvent } from "../../model";
import GscapeSettings from "./settings";

export default function (settingsComponent: GscapeSettings, grapholscape: Grapholscape) {
  settingsComponent.languages = grapholscape.ontology.languages
  settingsComponent.selectedLanguage = grapholscape.language
  settingsComponent.selectedEntityNameType = grapholscape.entityNameType

  settingsComponent.themes = grapholscape.themeList
  settingsComponent.selectedTheme = grapholscape.theme.id

  settingsComponent.requestUpdate()

  settingsComponent.onEntityNameTypeChange = (entityNameType) => {
    grapholscape.setEntityNameType(entityNameType)
  }
  settingsComponent.onLanguageChange = (language) => grapholscape.setLanguage(language)
  settingsComponent.onThemeChange = (themeKey) => {
    grapholscape.setTheme(themeKey)
  }
  settingsComponent.onPngExport = () => grapholscape.exportToPng()
  settingsComponent.onSvgExport = () => grapholscape.exportToSvg()
  settingsComponent.onJSONExport = () => grapholscape.exportToRdfGraph()

  grapholscape.on(LifecycleEvent.LanguageChange, language => settingsComponent.selectedLanguage = language)
  grapholscape.on(LifecycleEvent.EntityNameTypeChange, entityNameType => settingsComponent.selectedEntityNameType = entityNameType)
  grapholscape.on(LifecycleEvent.ThemeChange, newTheme => settingsComponent.selectedTheme = newTheme.id)

  grapholscape.on(LifecycleEvent.RendererChange, newRenderer => {
    settingsComponent.themes = grapholscape.themeList
  })

}