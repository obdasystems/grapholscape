import { html, css } from 'lit-element'
import { Icon } from '@material/mwc-icon'
import GscapeWidget from './gscape-widget';

export default class GscapeHeader extends GscapeWidget {
  static get properties() {
    return {
      collapsed: Boolean,
      title: String,
    }
  }

  constructor() {
    super(false, false)
    this.title = 'header'
    this.collapsed = false
  }

  static get styles() {
    // we don't need super.styles, just the colors from default imported theme
    let colors = super.styles[1]

    return css`
      .head-btn {
        position:absolute;
        color:var(--theme-gscape-on-primary, ${colors.on_primary});
        right:0;
        padding:9px 2px;
        cursor:pointer;
      }

      .head-btn:hover{
        color:var(--theme-gscape-secondary, ${colors.secondary});
      }

      .head-title {
        padding: 10px 40px 10px 10px ;
        box-sizing: border-box;
        float:left;
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
