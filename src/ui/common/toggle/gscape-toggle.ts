import {html, css, LitElement} from 'lit'
import baseStyle from '../../style'

export enum ToggleLabelPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export default class GscapeToggle extends LitElement {
  key: string
  checked: boolean
  disabled: boolean
  label: string
  labelPosition = ToggleLabelPosition.RIGHT

  static ToggleLabelPosition = ToggleLabelPosition

  static get properties() {
    return {
      disabled: {type: Boolean, reflect: true },
      label: {type: String, reflect: true },
      labelPosition: { type: String, reflect: true, attribute: 'label-position' },
      key : {type: String, reflect: true },
      checked : {type: Boolean, reflect: true },
    }
  }

  static styles = [
    baseStyle,
    css`
      :host {
        display: block;
        cursor: pointer;
      }

      :host([disabled]) {
        cursor: not-allowed;
      }

      .toggle-container {
        white-space: nowrap;
        display: flex;
        align-items: center;
        cursor: inherit;
        gap: 15px;
        justify-content: space-between;
      }

      :host([label-position = "right"]) > .toggle-container {
        flex-direction: row-reverse;
      }

      .toggle-wrap {
        width: 36px;
        height: 18px;
        display: inline-block;
        position: relative;
      }

      .toggle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 18px;
        background-color: var(--gscape-color-neutral-muted);
        border: 1px solid var(--gscape-color-border-subtle);
        transition: all 0.2s ease 0s;
      }

      .toggle::before {
        content: "";
        transition: all 0.1s ease 0s;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: var(--gscape-color-bg-default);
        border: solid 1px var(--gscape-color-border-subtle);
        border-radius: 9px;
        bottom: 2px;
        left: 2px;
      }

      .toggle-wrap input {
        display:none;
      }

      .toggle-wrap input:checked + .toggle {
        background-color: var(--gscape-color-accent-muted);
        border-color: var(--gscape-color-accent);
        filter: brightness(100%);
      }

      .toggle-wrap input:checked + .toggle::before {
        -webkit-transform: translateX(18px);
        -ms-transform: translateX(18px);
        transform: translateX(18px);
        background-color: var(--gscape-color-accent);
      }

      .toggle-wrap input:disabled + .toggle {
        opacity:0.5;
      }

      .toggle-label {
        flex-grow: 2;
      }
    `
  ]

  // constructor(key, state, disabled, label, onToggle, inverse_mode = false) {
  //   super()
  //   this.key = key || ''
  //   // always set inverse before state
  //   this.inverse = inverse_mode
  //   this.state = state || false

  //   this.disabled = disabled || false
  //   this.onToggle = onToggle || {}
  //   this.label = label || ''
  //   this.label_pos = 'left'
  // }

  render() {
    return html`
    <label class="toggle-container">
      <span class="toggle-label">${this.label}</span>
      <span class="toggle-wrap">
        <input id="${this.key}" type="checkbox"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
        />
        <span class="toggle"></span>
      </span>
    </label>
    `
  }

  // set state(state) {
  //   this._state = state
  //   this.checked = this.inverse ? !state : state

  //   // trying to force an update, doesn't work
  //   //this.requestUpdate('checked', old_checked_val)
  // }

  // get state() {
  //   return this._state
  // }

  // get label_span() {
  //   return html`<span class="toggle-label">${this.label}</span>`
  // }

  // clickHandler(e) {
  //   this.state = !this.state
  //   this.onToggle(e)
  // }

  // updated(a) {
  //   // force toggle to change its visual state
  //   // this should be unnecessary: see issue
  //   this.shadowRoot.querySelector(`#${this.key}`).checked = this.checked
  // }
  

}

customElements.define('gscape-toggle', GscapeToggle)