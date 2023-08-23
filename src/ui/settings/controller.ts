import GscapeSettings from "./settings";
import { storeConfigEntry } from "../../config/config-manager";
import Grapholscape from '../../core';
import { autoDarkColourMap, autoLightColourMap, DefaultThemesEnum, GrapholscapeTheme, LifecycleEvent, RendererStatesEnum } from "../../model";
import { IBaseMixin } from "../common/mixins/";

export default function (settingsComponent: GscapeSettings, grapholscape: Grapholscape) {
  settingsComponent.languages = grapholscape.ontology.languages
  settingsComponent.selectedLanguage = grapholscape.language
  settingsComponent.selectedEntityNameType = grapholscape.entityNameType
  settingsComponent.themes = grapholscape.themeList
  settingsComponent.selectedTheme = grapholscape.theme.id

  for (let [widgetName, widget] of grapholscape.widgets) {
    settingsComponent.widgetStates[widgetName] = (widget as unknown as IBaseMixin).enabled
  }
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

  // let gui_container = grapholscape.container.querySelector('#gscape-ui')
  settingsComponent.onWidgetEnabled = (widgetKey) => {
    const widget = grapholscape.widgets.get(widgetKey) as unknown as IBaseMixin
    widget.enable()
    storeConfigEntry(widgetKey, true)
    settingsComponent.widgetStates[widgetKey] = true
    settingsComponent.requestUpdate()
  }
  settingsComponent.onWidgetDisabled = (widgetKey) => {
    const widget = grapholscape.widgets.get(widgetKey) as unknown as IBaseMixin
    widget.disable()
    storeConfigEntry(widgetKey, false)
    settingsComponent.widgetStates[widgetKey] = false
    settingsComponent.requestUpdate()
  }

  grapholscape.on(LifecycleEvent.LanguageChange, language => settingsComponent.selectedLanguage = language)
  grapholscape.on(LifecycleEvent.EntityNameTypeChange, entityNameType => settingsComponent.selectedEntityNameType = entityNameType)
  grapholscape.on(LifecycleEvent.ThemeChange, newTheme => settingsComponent.selectedTheme = newTheme.id)

  const colorfulThemeLight = new GrapholscapeTheme(DefaultThemesEnum.COLORFUL_LIGHT, autoLightColourMap, 'Colorful - Light')
  const colorfulThemeDark = new GrapholscapeTheme(DefaultThemesEnum.COLORFUL_DARK, autoDarkColourMap, 'Colorful - Dark')

  grapholscape.on(LifecycleEvent.RendererChange, newRenderer => {
    if (newRenderer === RendererStatesEnum.FLOATY) {
      console.log('??')
      grapholscape.addTheme(colorfulThemeLight)
      grapholscape.addTheme(colorfulThemeDark)
    } else {
      grapholscape.removeTheme(colorfulThemeLight)
      grapholscape.removeTheme(colorfulThemeDark)
    }

    settingsComponent.themes = grapholscape.themeList
  })
  // function updateOnChange(settingID, newValue) {
  //   let select = settingsComponent.shadowRoot.querySelector(`#${settingID}`)
  //   let option = Array.from(select.options)?.find( o => o.value === newValue)

  //   if (option) {
  //     option.selected = true

  //     let languageSelect = settingsComponent.shadowRoot.querySelector('#language')
  //     if (select.id == 'entity_name') 
  //       languageSelect.disabled = (select.value !== 'label')
  //   }
  // }
}