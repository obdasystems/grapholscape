import { html , css } from 'lit-element'
import GscapeWidget from './gscape-widget'

export default class GscapeButton extends GscapeWidget {

  static get properties() {
    return {
        icon: { type : String },
        active: { type : Boolean },
        label: { type : String }
      }
    }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`

        mwc-icon {
          font-size: var(--gscape-button-font-size, 24px)
        }

        .btn {
          padding:5px;
          line-height:0;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .btn-label {
          font-weight: var(--gscape-button-font-weight, 600);
          padding: 0 5px 0 8px;
        }

        .btn:hover {
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .btn[active] {
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }
      `
    ]
  }

  constructor(icon, alt_icon, draggable=false) {
    super()
    this.draggable = draggable

    this.icon = icon
    this.alternate_icon = alt_icon || icon
    this.onClick = () => {}
    this.highlight = false
    this.active = false
    this.label = ''
  }

  render() {
    return html`
      <div
        class="btn"
        ?active = "${this.active}"
        @click="${this.clickHandler}"
        title="${this.icon}">

        <mwc-icon>${this.icon}</mwc-icon>
        ${this.label ? html`<span class="btn-label">${this.label}<span>` : ``}
      </div>
    `
  }


  set icon(icon) {
    let oldval = this._icon
    this._icon = icon

    this.requestUpdate('icon', oldval)
  }

  get icon() {
    return this._icon
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
    if (this.highlight)
      this.active = !this.active

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