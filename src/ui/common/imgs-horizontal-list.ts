import { LitElement, SVGTemplateResult, css, html } from "lit";
import baseStyle from "../style";

export default class GscapeIconList extends LitElement {

  icons: SVGTemplateResult[] = []

  static properties = {
    icons: { type: Array }
  }

  static styles = [
    baseStyle,
    css`
    :host {
      display: inline-block;
    }

    .icons {
      display: flex;
    }

    .icon-item:first-of-type {
      margin-left: 0;
      padding-left: 0;
    }
    
    .icon-item {
      /* Nagative margin make icons overlap to previous one */
      margin-left: -0.5rem;
      border-radius: 9999px;
      background: inherit;
      padding-left: 2px;
    }
    
    .icon-img {
      justify-content: center;
      align-items: center;
      display: flex;
      background: inherit;
    }
    `
  ]

  render() {
    return html`
      <div class="icons background-propagation">
        ${this.icons.map(i => {
          return html`
            <div class="icon-item">
              <div class="icon-img slotted-icon">${i}
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.define('gscape-icon-list', GscapeIconList)