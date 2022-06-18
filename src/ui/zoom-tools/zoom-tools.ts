import { html, css, LitElement } from 'lit'
import { minus, plus } from '../assets/icons'
import getIconSlot from '../util/get-icon-slot'
import baseStyle from '../style'

export default class GscapeZoomTools extends LitElement {
  private _onZoomIn: () => void
  private _onZoomOut: () => void

  static styles = [
    baseStyle,
    css`
      :host {
        order: 1;
        margin-top:10px;
        position: initial;
        z-index: 10;
        border-radius: var(--gscape-border-radius-btn);
        border: 1px solid var(--gscape-color-border-subtle);
        background-color: var(--gscape-color-bg-subtle);
      }
    `
  ]

  constructor() {
    super()
    this.classList.add('btn')
  }

  render() {
    return html`
      <gscape-button type="subtle" @click=${this._onZoomIn}><span slot="icon">${plus}</span></gscape-button>
      <div class="hr"></div>
      <gscape-button type="subtle" @click=${this._onZoomOut}><span slot="icon">${minus}</span></gscape-button>
    `
  }

  set onZoomIn(f: () => void) {
    this._onZoomIn = f
  }

  set onZoomOut(f: () => void) {
    this._onZoomOut = f
  }
}

customElements.define('gscape-zoom-tools', GscapeZoomTools)