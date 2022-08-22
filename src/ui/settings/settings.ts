import { css, html, LitElement } from 'lit'
import { EntityNameType } from '../../config/config'
import { GrapholscapeTheme } from '../../model'
import capitalizeFirstChar from '../../util/capitalize-first-char'
import { grapholscapeLogo } from '../assets'
import { save, settings_icon } from '../assets/icons'
import { BaseMixin } from '../common/base-widget-mixin'
import { GscapeButtonStyle } from '../common/button'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'
import { WidgetEnum } from '../util/widget-enum'

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

  widgetStates: { [key in WidgetEnum]?: boolean } = { }

  onEntityNameTypeChange: (newEntityNameType: EntityNameType) => void = () => { }
  onLanguageChange: (newLanguage: string) => void = () => { }
  onThemeChange: (newThemeKey: string) => void = () => { }
  onWidgetEnabled: (widgetKey: WidgetEnum) => void = () => { }
  onWidgetDisabled: (widgetKey: WidgetEnum) => void = () => { }
  onPngExport: () => void = () => { }
  onSvgExport: () => void = () => { }

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

      .settings-wrapper {
        overflow-y: auto;
        scrollbar-width: inherit;
        max-height: 320px;
        overflow-x: hidden;
        padding: 0 8px;
      }

      .area {
        margin-bottom: 18px;
        background: var(--gscape-color-bg-inset);
        border-radius: calc(var(--gscape-border-radius) - 2px);
        padding: 4px 4px 4px 6px;
        border: solid 1px var(--gscape-color-border-subtle);
      }

      .area:last-of-type {
        margin-bottom: 0;
      }

      .setting {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .setting-label {
        font-size: 10px;
      }

      .title-wrap {
        white-space: normal;
        width: 220px;
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
    // this.settings = settings
    // this.btn = new GscapeButton(settings_icon, 'Settings')
    // this.btn.onClick = this.toggleBody.bind(this)
    // this.callbacks = {}

    // this.savePNGButton = new GscapeButton(save, 'Save')
    // this.savePNGButton.label = 'PNG'
    // this.saveSVGButton = new GscapeButton(save, 'Save')
    // this.saveSVGButton.label = 'SVG'
  }

  render() {
    return html`
      <gscape-button @click=${this.togglePanel}>
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
            <div class="bold-text" style="padding-bottom: 2px">Widgets</div>
            ${Object.entries(this.widgetStates).map(([widgetName, widgetState]) => {
              if (widgetState !== undefined && widgetState !== null) {
                return this.getToggleSettingEntryTemplate(widgetState, widgetName)
              }
            })}
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

  private getToggleSettingEntryTemplate(actualState: boolean, title: string) {
    let labelPieces = title.split('-')
    const label = labelPieces.map(text => capitalizeFirstChar(text)).join(' ')
    return html`
      <div class="toggle-setting-obj">
        <gscape-toggle
          @click=${this.widgetToggleChangeHandler}
          label=${label}
          label-position="left"
          class="actionable"
          key = ${title}
          ?checked = ${actualState}
        ></gscape-toggle>
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

  private widgetToggleChangeHandler(e) {
    e.preventDefault()
    let toggle = e.target
    toggle.checked ?
      this.onWidgetDisabled(toggle.key) :
      this.onWidgetEnabled(toggle.key)
  }
}

customElements.define('gscape-settings', GscapeSettings)