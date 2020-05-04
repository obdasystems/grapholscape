import {html, css} from 'lit-element'
import GscapeWidget from './gscape-widget'

export default class GscapeToggle extends GscapeWidget {
  static get properties() {
    return {
      state: Boolean,
      disabled: Boolean,
      label: String,
      key : String,
      checked : Boolean,
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return css`
        :host {
          display: flex;
        }
        
        .toggle-container {
          white-space: nowrap;
          padding: 6px;
          display: flex;
          align-items: center;
        }

        .toggle-wrap {
          width: 33px;
          height: 19px;
          display: inline-block;
          position: relative;
        }

        .toggle {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: checked 0.2s;
          border-radius: 19px;
        }

        .toggle::before {
          position: absolute;
          content: "";
          height: 11px;
          width: 11px;
          left: 4px;
          bottom: 4px;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          transition: .1s;
          border-radius: 20px;
        }

        .toggle-wrap input {
          display:none;
        }

        .toggle-wrap input:checked + .toggle {
          background-color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .toggle-wrap input:checked + .toggle::before {
          -webkit-transform: translateX(14px);
          -ms-transform: translateX(14px);
          transform: translateX(14px);      
        }

        .toggle-wrap input:disabled + .toggle {
          opacity:0.25;
        }

        .toggle-label {
          margin-left: 15px;
        }
      `
  }

  constructor(key, state, disabled, label, onToggle, inverse_mode = false) {
    super()
    this.key = key || ''
    // always set inverse before state
    this.inverse = inverse_mode
    this.state = state || false

    this.disabled = disabled || false
    this.onToggle = onToggle || { }
    this.label = label || ''
  }

  render() {
    return html`
    <div class="toggle-container">
      <label class="toggle-wrap">
        <input id="${this.key}" type="checkbox" 
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          @click="${this.clickHandler}"
        />
        <span class="toggle"></span>
      </label>
      <span class="toggle-label">${this.label}</span>
    </div>
    `
  }

  set state(state) {
    this._state = state
    let old_checked_val = this.checked
    this.checked = this.inverse ? !state : state

    // trying to force an update, doesn't work
    //this.requestUpdate('checked', old_checked_val)
  }

  get state() {
    return this._state
  }

  clickHandler(e) {
    this.onToggle(e)
  }

  updated(a) {
    // force toggle to change its visual state
    // this should be unnecessary: see issue 
    this.shadowRoot.querySelector(`#${this.key}`).checked = this.checked
  }

}

customElements.define('gscape-toggle', GscapeToggle)