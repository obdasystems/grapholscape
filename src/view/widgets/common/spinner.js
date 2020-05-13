import { html , css, LitElement } from 'lit-element'
import {gscape} from '../../style/themes'

export default class GscapeSpinner extends LitElement {

  static get styles() {
    return css`
      .loader {
        border: 3px solid ${gscape.shadows};
        border-radius: 50%;
        border-top: 3px solid ${gscape.secondary};
        width: 30px;
        height: 30px;
        -webkit-animation: spin 1s linear infinite; /* Safari */
        animation: spin 1s linear infinite;
        box-sizing: border-box;
        position:absolute;
        top:50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
      }

      /* Safari */
      @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }

  constructor() {
    super()
  }

  render() {
    return html`<div class="loader"></div>`
  }

  hide() {
    this.style.display = 'none'
  }

  show() {
    this.style.display = 'initial'
  }
}

customElements.define('gscape-spinner', GscapeSpinner)