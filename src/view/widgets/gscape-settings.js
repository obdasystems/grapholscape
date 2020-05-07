import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeButton from './common/gscape-button'
import GscapeToggle from './common/gscape-toggle'

export default class GscapeSettings extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          bottom:10px;
          left: 94px;
          padding-right:0;
        }

        gscape-button {
          position: static;
        }

        .gscape-panel {
          padding-right: 0;
        }

        .settings-wrapper {
          overflow-y: auto;
          scrollbar-width: inherit;
          max-height: 420px;
          overflow-x: hidden;
          white-space: nowrap;
          padding-right: 20px;
        }

        .area {
          margin-bottom: 30px;
        }

        .area:last-of-type {
          margin-bottom: 0;
        }

        .area-title {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 105%;
        }

        .setting {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-wrap {
          margin-right: 50px;
        }

        .setting-label {
          font-size : 12px;
          opacity: 0.7;
        }
      `,
    ]
  }

  constructor(settings) {
    super()
    this.collapsible = true
    this.settings = settings
    this.btn = new GscapeButton('settings')
    this.btn.onClick = this.toggleBody.bind(this)
    this.callbacks = {}
  }

  render() {
    return html`
      ${this.btn}

      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Settings</div>

        <div class="settings-wrapper">

      ${Object.keys(this.settings).map( area_entry => {
        if (area_entry == 'default')
          return html``

        let area = this.settings[area_entry]
        return html`
          <div class="area">
            <div class="area-title">${capitalizeFirstLetter(area_entry)}</div>

        ${Object.keys(area).map( setting_entry => {
          let setting = area[setting_entry]
          return html`
            <div class="setting">
              <div class="title-wrap">
                <div class="setting-title">${setting.title}</div>
                <div class="setting-label">${setting.label}</div>
              </div>
            ${setting.type == 'list' ?
              html`
                <div class="setting_obj">
                  <select area="${area_entry}" id="${setting_entry}" @change="${this.onListChange}">
                    ${setting.list.map(option => {
                      if (option.value == '') return
                      let selected = option.value == setting.selected
                      return html`<option value="${option.value}" ?selected=${selected}>${option.label}</option>`
                    })}
                  </select>
                </div>
              ` : html``
            }

            ${setting.type == 'boolean' ?
              html`
                ${new GscapeToggle(setting_entry, setting.enabled, false, '', this.onToggleChange.bind(this))}
              ` : html``
            }
            </div>
          `
        })}
        </div>
        `
      })}
        </div>
      </div>
    `

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }

  onListChange(e) {
    let selection = e.target
    let area = selection.getAttribute('area')
    this.settings[area][selection.id].selected = selection.value
    this.callbacks[selection.id](selection.value)
  }

  onToggleChange(e) {
    let toggle = e.target
    this.settings.widgets[toggle.id].enabled = toggle.checked

    toggle.checked ?
      this.callbacks.widgetEnable(toggle.id) :
      this.callbacks.widgetDisable(toggle.id)
  }


  set onEntityNameSelection(foo) {
    this.callbacks.entity_name = foo
  }

  set onLanguageSelection(foo) {
    this.callbacks.language = foo
  }

  set onThemeSelection(foo) {
    this.callbacks.theme = foo
  }

  set onWidgetEnabled(foo) {
    this.callbacks.widgetEnable = foo
  }

  set onWidgetDisabled(foo) {
    this.callbacks.widgetDisable = foo
  }
}

customElements.define('gscape-settings', GscapeSettings)