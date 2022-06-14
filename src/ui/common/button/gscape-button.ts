import { html, css, LitElement } from 'lit'
import mainStyle from '../../style'
import buttonStyle from './style'

export enum SizeEnum {
  S = 's',
  M = 'm',
  L = 'l'
}

export default class GscapeButton extends LitElement {
  disabled: boolean
  asSwitch: boolean
  active: boolean
  label: string
  size: SizeEnum = SizeEnum.M
  type: string
  fullWidth: string
  private toggled = false

  static properties = {
    active: { type: Boolean, reflect: true },
    label: { type: String, reflect: true },
    title: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    asSwitch: { type: Boolean, attribute: 'as-switch', reflect: true },
    size: { type: String, reflect: true },
    type: { type: String, reflect: true },
    fullWidth: { type: String, attribute: 'full-width', reflect: true },
    toggled: {type: Boolean, state: true }
  }

  static styles = [mainStyle, buttonStyle]
  // static get styles() {
  //   let super_styles = super.styles
  //   let colors = super_styles[1]

  //   return [
  //     super_styles[0],
  //     css`
  //       :host {
  //         box-shadow: 0 0 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
  //         padding: calc(var(--gscape-icon-size) * 0.2 );
  //         cursor: pointer;
  //       }

  //       :host(:hover){
  //         box-shadow: 0 0 8px 0 var(--theme-gscape-shadows, ${colors.shadows});
  //         color: var(--theme-gscape-secondary, ${colors.secondary});
  //       }

  //       .btn {
  //         display: flex;
  //         align-items: center;
  //       }

  //       .btn-label {
  //         font-weight: var(--gscape-button-font-weight, 600);
  //         padding: 0 5px 0 8px;
  //       }

  //       .btn[active] {
  //         color: var(--theme-gscape-secondary, ${colors.secondary});
  //       }

  //       .btn[disabled] {
  //         opacity: 20%;
  //         cursor: initial;
  //         pointer-events: none;
  //       }

  //       svg {
  //         height: inherit;
  //         width: inherit;
  //       }
  //     `
  //   ]
  // }

  constructor() {
    super()

    this.asSwitch = false
    this.active = false
    this.disabled = false
    this.label = ''
  }

  render() {
    return html`
      <button
        class="btn btn-${this.size} ${this.type}"
        ?label="${this.label}"
        ?disabled = "${this.disabled}"
        ?active = "${this.active}"
        @click = "${this.clickHandler}"
      >

      ${this.toggled && this.altIcon
        ? html`<slot name="alt-icon" class="btn-icon"></slot>`
        : html`<slot name="icon" class="btn-icon"></slot>`
      }
        ${this.label ? html`<span class="btn-label">${this.label}<span>` : ``}
      </button>
    `
  }

  private clickHandler() {
    this.toggled = !this.toggled

    if (!this.disabled && this.asSwitch)
      this.active = !this.active
  }

  private get altIcon() {
    return this.querySelector('[slot = "alt-icon"]')
  }
}

customElements.define('gscape-button', GscapeButton)