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

    // language selection only makes sense for label as displayed names
    settingsComponent.shadowRoot.querySelector('select#language').disabled = entityNameType !== 'label'
  }
  settingsComponent.onLanguageSelection = (language) => { grapholscape.changeLanguage(language) }
  settingsComponent.onThemeSelection = (themeKey) => grapholscape.applyTheme(themeKey)
  settingsComponent.onPNGSaveButtonClick = () => grapholscape.exportToPNG()
  settingsComponent.onSVGSaveButtonClick = () => grapholscape.exportToSVG()
}