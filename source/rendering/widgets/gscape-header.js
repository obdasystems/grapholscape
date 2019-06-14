import { LitElement, html, css } from 'lit-element'
import { Icon } from '@material/mwc-icon'
import { theme } from './themes'

export default class GscapeHeader extends LitElement {
  static get properties() {
    return {
      actual_diagram: String,
      collapsed: Boolean
    }
  }

  constructor() {
    super()
    this.title = ''
    this.collapsed = true
  }

  static get styles() {
    return css`
      .head-btn {
        position:absolute;
        color:var(--theme-gscape-secondary, ${theme.secondary});
        right:0;
        padding:6px 2px;
        cursor:pointer;
      }

      .head-btn:hover{
        color:var(--theme-gscape-accent, ${theme.accent});
      }

      .widget-head {
        width:100%;
        padding:10px 40px 10px 10px;
        box-sizing: border-box;
        float:left;
        font-weight:bold;
        cursor:grab;
      }
    `
  } 

  render () {
    return html`
      <div class="widget-head"> ${this.title} </div>
      <mwc-icon class="head-btn" @click="${this.toggleBody}">
        ${this.collapsed?
          html`arrow_drop_down`:
          html`arrow_drop_up`
        }
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
}

customElements.define('gscape-head', GscapeHeader)
