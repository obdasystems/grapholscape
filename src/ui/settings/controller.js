import Grapholscape from "../../grapholscape";
import GscapeSettings from "./settings";
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