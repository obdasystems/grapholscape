import { html, css } from 'lit-element'
import { Icon } from '@material/mwc-icon'
import GscapeWidget from './gscape-widget';

export default class GscapeHeader extends GscapeWidget {
  static get properties() {
    return {
      title: { type : String },
      initial_icon: { type : String },
      secondary_icon: { type : String },
      icon : { type : String }
    }
  }

  constructor() {
    super()
    this.title = 'header'
    this.initial_icon = 'arrow_drop_down'
    this.secondary_icon = 'arrow_drop_up'
    this.icon = this.initial_icon
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
        padding: var(--btn-padding, 0 0 0 5px);
        cursor:pointer;
      }

      .head-btn:hover{
        color:var(--theme-gscape-secondary, ${colors.secondary});
      }

      .head-title {
        padding: var(--title-padding, 0 5px 0 0);
        box-sizing: border-box;
        font-weight:bold;
        cursor:grab;
        width: var(--title-width, '');
        text-align: var(--title-text-align, '')
      }
    `
  }

  render () {
    return html`
      <div class="head-title"> ${this.title} </div>
      <slot></slot>
      <mwc-icon class="head-btn" @click="${this.toggleBody}">
        ${this.icon}
      </mwc-icon>
    `
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
