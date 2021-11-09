import { html, css } from 'lit-element'
import GscapeWidget from './gscape-widget';

export default class GscapeHeader extends GscapeWidget {
  static get properties() {
    return {
      title: { type : String },
      initial_icon: { type : String },
      secondary_icon: { type : String },
      icon : { type : String },
      left_icon: { type: String }
    }
  }

  constructor() {
    super()
    this.title = 'header'
    this.initial_icon = 'arrow_drop_down'
    this.secondary_icon = 'arrow_drop_up'
    this.icon = this.initial_icon
    this.left_icon = ''
    this.onClick = () => {}
  }

  static get styles() {
    // we don't need super.styles, just the colors from default imported theme
    let colors = super.styles[1]

    return css`
      :host {
        display:flex;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--header-padding, 8px);
      }

      .head-btn {
        color:var(--theme-gscape-on-primary, ${colors.on_primary});
        right:0;
        cursor:pointer;
      }

      .head-btn:hover{
        color:var(--theme-gscape-secondary, ${colors.secondary});
      }

      .head-title {
        padding: var(--title-padding, 0 10px);
        box-sizing: border-box;
        font-weight:bold;
        cursor:grab;
        width: var(--title-width, '');
        text-align: var(--title-text-align, 'left');
        justify-self: flex-start;
      }

    `
  }

  render () {
    return html`
    ${this.isCustomIcon(this.left_icon) ?
      html`
        <mwc-icon-button class="left-icon">
          ${this.isCustomIcon(this.left_icon) ? html`${this.left_icon}` :''}
        </mwc-icon-button>
      ` : html`
        <mwc-icon-button class="left-icon" icon="${this.left_icon}"></mwc-icon-button>
      `}

      <div class="head-title">
        ${this.title}
      </div>
      <slot></slot>
      <mwc-icon class="head-btn" @click="${this.iconClickHandler}">
        ${this.icon}
      </mwc-icon>
    `
  }

  iconClickHandler() {
    this.onClick()
    this.toggleBody()
  }

  toggleBody() {
    const e = new CustomEvent('toggle-widget-body', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(e)
  }

  invertIcons() {
    [this.initial_icon, this.secondary_icon] = [this.secondary_icon, this.initial_icon]
    this.toggleIcon()
  }

  toggleIcon() {
    this.icon = this.icon == this.initial_icon ? this.secondary_icon : this.initial_icon
  }
}

customElements.define('gscape-head', GscapeHeader)
