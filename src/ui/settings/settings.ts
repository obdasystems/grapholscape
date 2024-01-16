import { css, html, LitElement } from 'lit'
import { EntityNameType, GrapholscapeTheme } from '../../model'
import capitalizeFirstChar from '../../util/capitalize-first-char'
import { grapholscapeLogo } from '../assets'
import { save, settings_icon } from '../assets/icons'
import { GscapeButtonStyle } from '../common/button'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import settingsStyle from './settings-style'

type OptionEntry = {
  value: string,
  label: string,
}

export default class GscapeSettings extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Settings'
  languages: string[]
  selectedLanguage: string

  selectedEntityNameType: EntityNameType

  themes: GrapholscapeTheme[]
  selectedTheme: string


  onEntityNameTypeChange: (newEntityNameType: EntityNameType) => void = () => { }
  onLanguageChange: (newLanguage: string) => void = () => { }
  onThemeChange: (newThemeKey: string) => void = () => { }
  onPngExport: () => void = () => { }
  onSvgExport: () => void = () => { }
  onJSONExport: () => void = () => { }

  static properties = {
    languages: { type: Object, attribute: false, },
    themes: { type: Object, attribute: false, },
    widgetStates: { type: Object, attribute: false, },
    selectedLanguage: { type: String, attribute: false, },
    selectedTheme: { type: String, attribute: false, },
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    settingsStyle,
    css`
      :host {
        order: 5;
        display:inline-block;
        position: initial;
        margin-top:10px;
      }

      .gscape-panel {
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 0;
        padding-left: 0;
      }

      #logo {
        text-align:center;
      }

      #logo svg {
        width: 40%;
        height: auto;
        margin: 20px 0;
      }

      #version {
        text-align: center;
      }

      .toggle-setting-obj {
        width: 100%;
      }

      gscape-toggle {
        margin: 2px 0;
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button type="subtle" @click=${this.togglePanel}>
        <span slot="icon">${settings_icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>

        <div class="settings-wrapper">

        <div class="area">
            <div class="bold-text">Preferences</div>
            ${this.getListSettingEntryTemplate(
              Object.values(EntityNameType).map(ent => {
                return { value: ent, label: capitalizeFirstChar(ent) }
              }),
              this.selectedEntityNameType,
              'Entities Name',
              'Select the type of name to display on entities')
            }

            ${this.getListSettingEntryTemplate(
              this.languages.map(l => {
                return { value: l, label: l }
              }),
              this.selectedLanguage,
              'Language',
              'Select the preferred language'
            )}
        </div>

        <div class="area">
            <div class="bold-text">Appearance</div>
            ${this.getListSettingEntryTemplate(
              this.themes.map(theme => {
                return { value: theme.id, label: theme.name }
              }),
              this.selectedTheme,
              'Theme',
              'Select a theme')
            }
        </div>

        <div class="area">
          <div class="bold-text">Export Ontology Image</div>
          <div class="setting">
            ${this.getSettingTitleTemplate('Image', 'Save a PNG image of the current diagram on your disk')}
            
            <div class="setting-obj">
              <gscape-button label="PNG" size="s" @click=${this.onPngExport}>
                <span slot="icon">${save}</span>
              </gscape-button>
            </div>
          </div>

          <div class="setting">
            ${this.getSettingTitleTemplate('Vectorial', 'Save an SVG of the current diagram on your disk')}
            <div class="setting-obj">
              <gscape-button label="SVG" size="s" @click=${this.onSvgExport}>
                <span slot="icon">${save}</span>
              </gscape-button>
            </div>
          </div>
        </div>

        <!-- <div class="area">
          <div class="setting">
            <gscape-button label="Export JSON" size="s" @click=${this.onJSONExport}>
            </gscape-button>
          </div>
        </div> -->

        <div class="area">
          <div class="bold-text">About</div>
          <div id="logo">
            ${grapholscapeLogo}
          </div>

          <div id="version" class="muted-text">
            <span>Version: </span>
            <span>${process.env.VERSION}</span>
          </div>
        </div>
      </div>
    `
  }

  private getSettingTitleTemplate(title: string, label: string) {
    return html`
    <div class="title-wrap">
      <div class="setting-title">${title}</div>
      <div class="muted-text setting-label">${label}</div>
    </div>
    `
  }

  private getListSettingEntryTemplate(options: OptionEntry[], selectedOption: string, title: string, label: string) {
    if (options.length <= 0) return null
    
    return html`
      <div class="setting">
        ${this.getSettingTitleTemplate(title, label)}
        <div class="setting-obj">
          <select id="${title}" @change=${this.listChangeHandler}>
            ${options.map(option => {
              let selected = option.value == selectedOption
              return html`<option value="${option.value}" ?selected=${selected}>${option.label}</option>`
            })}
          </select>
        </div>
      </div>
    `
  }

  private listChangeHandler(e) {
    const selectId = e.target.id
    const newValue = e.target.value

    switch(selectId) {
      case 'Entities Name':
        if (newValue !== this.selectedEntityNameType) {
          this.onEntityNameTypeChange(newValue)
        }
        break;

      case 'Language':
        if (newValue !== this.selectedLanguage) {
          this.onLanguageChange(newValue)
        }
        break;

      case 'Theme':
        if (newValue !== this.selectedTheme) {
          this.onThemeChange(newValue)
        }
        break;
    }
  }
}

customElements.define('gscape-settings', GscapeSettings)