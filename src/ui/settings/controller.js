import Grapholscape from "../../grapholscape";
import GscapeSettings from "./settings";
import { storeConfigEntry } from "../../config/config-manager";
import widgetNames from "../util/widget-names";

/**
 * @param {GscapeSettings} settingsComponent
 * @param {Grapholscape} grapholscape 
 */
export default function(settingsComponent, grapholscape) {
  settingsComponent.settings = grapholscape.config
  settingsComponent.onEntityNameSelection = (entityNameType) => { 
    grapholscape.changeEntityNameType(entityNameType)
  }
  settingsComponent.onLanguageSelection = (language) => { grapholscape.changeLanguage(language) }
  settingsComponent.onThemeSelection = (themeKey) => grapholscape.applyTheme(themeKey)
  settingsComponent.onPNGSaveButtonClick = () => grapholscape.exportToPNG()
  settingsComponent.onSVGSaveButtonClick = () => grapholscape.exportToSVG()

  let gui_container = grapholscape.container.querySelector('#gscape-ui')
  settingsComponent.onWidgetEnabled = (widgetName) => {
    gui_container.querySelector(widgetNames[widgetName]).enable()
    storeConfigEntry(widgetName, true)
  }
  settingsComponent.onWidgetDisabled = (widgetName) => {
    gui_container.querySelector(widgetNames[widgetName]).disable()
    storeConfigEntry(widgetName, false)
  }

  grapholscape.onLanguageChange( language => updateOnChange('language', language))
  grapholscape.onEntityNameTypeChange( entityNameType => updateOnChange('entity_name', entityNameType) )
  grapholscape.onThemeChange( (_ , themeKey) => updateOnChange('theme', themeKey))

  function updateOnChange(settingID, newValue) {
    let select = settingsComponent.shadowRoot.querySelector(`#${settingID}`)
    let option = Array.from(select.options)?.find( o => o.value === newValue)

    if (option) {
      option.selected = true
      
      let languageSelect = settingsComponent.shadowRoot.querySelector('#language')
      if (select.id == 'entity_name') 
        languageSelect.disabled = (select.value !== 'label')
    }
  }
}