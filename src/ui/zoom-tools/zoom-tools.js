import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget';
import GscapeButton from '../common/gscape-button';
import { minus, plus } from '../assets/icons';

export default class GscapeZoomTools extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          margin-top:10px;
          position: initial;
        }

        gscape-button{
          position: static;
          box-shadow: initial;
        }

        #hr {
          height:1px;
          width:90%;
          margin: 2px auto 0 auto;
          background-color: var(--theme-gscape-shadows, ${colors.shadows})
        }

      `
    ]
  }
  constructor() {
    super()

    this.btn_plus = new GscapeButton(plus, 'Zoom In')
    this.btn_minus = new GscapeButton(minus, 'Zoom Out')

    this._onZoomIn = null
    this._onZoomOut = null
  }

  render() {
    return html`
      ${this.btn_plus}
      <div id="hr"></div>
      ${this.btn_minus}
    `
  }

  set onZoomIn(f) {
    this._onZoomIn = f
    this.btn_plus.onClick = this._onZoomIn
  }

  set onZoomOut(f) {
    this._onZoomOut= f
    this.btn_minus.onClick = this._onZoomOut
  }
}

customElements.define('gscape-zoom-tools', GscapeZoomTools)