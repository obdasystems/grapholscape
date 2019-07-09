import { html , css } from 'lit-element'
import GscapeWidget from './gscape-widget'
import { Icon } from '@material/mwc-icon'

export default class GscapeButton extends GscapeWidget {

  static get properties() {
    return [
      super.properties,
      {
        _icon: String,
      }
    ]
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        .btn {
          padding:4px;
          line-height:0;
          cursor: pointer;
        }

        .btn:hover {
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }
      `
    ]
  }

  constructor(icon, alt_icon, draggable=false) {
    super(draggable, false)

    this._icon = icon
    this._alternate_icon = alt_icon || icon
    this._onClick = null
  }

  render() {
    return html`
      <div class="btn" @click="${this.clickHandler}" title="${this._icon}"><mwc-icon>${this._icon}</mwc-icon></div>
    `
  }

  set icon(icon) {
    let oldval = this._icon
    this._icon = icon

    this.requestUpdate('icon', oldval)
  }

  set alternate_icon(icon) {
    let oldval = this._alternate_icon
    this._alternate_icon = icon

    this.requestUpdate('alternative_icon', oldval)
  }

  set onClick(f) {
    this._onClick = f
  }

  clickHandler() {
    this.toggleIcon()
    this._onClick()
  }

  toggleIcon() {
    let aux = this._icon
    this.icon = this._alternate_icon
    this.alternate_icon = aux
  }

  firstUpdated() {
    super.firstUpdated()

    this.shadowRoot.querySelector('mwc-icon').onselectstart =  () => false
  }
}

customElements.define('gscape-button', GscapeButton)