import { LitElement, html, css } from 'lit-element'

export default class GrapholscapeWidget extends LitElement {

  static get styles() {
    return css`
    :host {
      position: absolute;
    }`;
  } 

  render () {
    return html`
      <div>
        <p>A paragraph</p>
      </div>
    `
  }
}

customElements.define('grapholscape-widget', GrapholscapeWidget)
