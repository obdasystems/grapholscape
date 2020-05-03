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
          left:136px;
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
    super(false,true)
    this.settings = settings
    this.btn = new GscapeButton('settings')
    this.btn.onClick = this.toggleBody.bind(this)
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
                  <select id="${setting_entry}" @change="${this.onListChange}">
                    ${setting.list.map(option => {
                      return html`<option value="${option.value}">${option.label}</option>`
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

  onListChange(e) {}

  onToggleChange(e) {}
}

customElements.define('gscape-settings', GscapeSettings)