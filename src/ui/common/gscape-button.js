import { html, css } from 'lit'
import GscapeWidget from './gscape-widget'

export default class GscapeButton extends GscapeWidget {

  static get properties() {
    return {
      icon: { attribute: false },
      highlighted: { attribute: false },
      label: { type: String },
      title: { type: String, reflect: true },
      enabled: { attribute: false },
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          box-shadow: 0 0 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
          padding: calc(var(--gscape-icon-size) * 0.2 );
        }

        :host(:hover){
          box-shadow: 0 0 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
        }

        .btn {
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

        .btn[disabled] {
          opacity: 20%;
          cursor: initial;
          pointer-events: none;
        }

        svg {
          height: inherit;
          width: inherit;
        }
      `
    ]
  }

  constructor(icon, title = '', alt_icon = null, draggable = false) {
    super()
    this.draggable = draggable

    this.title = title
    this.icon = icon
    this.alternate_icon = alt_icon
    this.onClick = () => { }
    this.asSwitch = false
    this.highlighted = false
    this.enabled = true
    this.label = ''
  }

  render() {
    return html`
      <div
        class="btn"
        ?disabled = "${!this.enabled}"
        ?active = "${this.highlighted}"
        @click="${this.clickHandler}"
      >

        <div class="icon">${this.icon}</div>
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
    if (!this.enabled) return

    if (this.asSwitch)
      this.highlighted = !this.highlighted

    this.toggleIcon()
    this._onClick()
  }

  toggleIcon() {
    if (!this._alternate_icon) return

    let aux = this._icon
    this.icon = this._alternate_icon
    this.alternate_icon = aux
  }

  firstUpdated() {
    super.firstUpdated()

    this.shadowRoot.querySelector('.icon').onselectstart = () => false
  }
}

customElements.define('gscape-button', GscapeButton)