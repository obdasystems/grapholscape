import { css, html, LitElement } from 'lit'
import { minus, plus } from '../assets/icons'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'

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
      }
    `
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button title="Zoom In" type="subtle" @click=${this.onZoomIn}><span slot="icon">${plus}</span></gscape-button>
      <div class="hr"></div>
      <gscape-button title="Zoom Out" type="subtle" @click=${this.onZoomOut}><span slot="icon">${minus}</span></gscape-button>
    `
  }

  set onZoomIn(f: () => void) {
    this._onZoomIn = f
  }

  get onZoomIn() { return this._onZoomIn }

  set onZoomOut(f: () => void) {
    this._onZoomOut = f
  }

  get onZoomOut() { return this._onZoomOut }
}

customElements.define('gscape-zoom-tools', GscapeZoomTools)