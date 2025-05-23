import { LitElement, css, html } from 'lit'
import mainStyle from '../../style'
import { BaseMixin } from '../mixins'
import buttonStyle from './style'
import { contentSpinnerStyle, getContentSpinner } from '../spinners'

export enum SizeEnum {
  S = 's',
  M = 'm',
  L = 'l'
}

export default class GscapeButton extends BaseMixin(LitElement) {
  disabled: boolean
  asSwitch: boolean
  active: boolean
  label: string
  size: SizeEnum = SizeEnum.M
  type: string
  fullWidth: string
  loading : boolean
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
    toggled: {type: Boolean, state: true },
    loading: { type: Boolean },
  }

  static styles = [
    mainStyle, 
    buttonStyle, 
    contentSpinnerStyle,
    css`
      .lds-ring, .lds-ring div {
        border-top-color: currentColor;
      }
    `,
  ]
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
      ${this.loading
        ? getContentSpinner()
        : null
      }

      ${this.toggled && this.altIcon
        ? html`<slot name="alt-icon" class="slotted-icon"></slot>`
        : html`<slot name="icon" class="slotted-icon"></slot>`
      }

      ${this.label ? html`<span class="btn-label ellipsed">${this.label}<span>` : ``}

      <slot name="trailing-icon" class="slotted-icon"></slot>
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