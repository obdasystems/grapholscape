import { LitElement, PropertyDeclarations, css, html } from "lit";

export function getContentSpinner() {
  return html`<div class="lds-ring" title="Loading"><div></div><div></div><div></div><div></div></div>`
}

export const contentSpinnerStyle = css`
  .lds-ring {
    width: 20px;
    height: 20px;
  }

  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid var(--gscape-color-accent);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--gscape-color-accent) transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export class ContentSpinner extends LitElement {

  color: string

  static styles = [
    contentSpinnerStyle,
    css`
      :host {
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
      }
    `
  ]

  static properties: PropertyDeclarations = {
    color: { type: String}
  }

  render = getContentSpinner

  setColor(newColor: string) {
    this.style.setProperty('--gscape-color-accent', newColor)
  }
}

customElements.define('gscape-content-spinner', ContentSpinner)