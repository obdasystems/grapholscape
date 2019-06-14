import { html, css } from 'lit-element'
import GscapeHeader from './gscape-header'
import GscapeWidget from './gscape-widget'
import { theme } from './themes'

export default class GscapeDiagramSelector extends GscapeWidget {
  static get properties() {
    return [
      super.properties,
      {
        diagrams: Array,
      }
    ]
  }
  
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          top: 10px;
          left: 10px;
        }

        .diagram-item {
          cursor:pointer;
          padding:5px 10px;
        }

        .diagram-item:hover {
          color:white;
          background-color:var(--theme-gscape-accent, ${theme.accent});
        }

        .diagram-item:last-of-type {
          border-radius: inherit;
        }
      `
    ]
  }

  constructor(diagrams) {
    super(true, true)
    this.diagrams = diagrams
    this.actual_diagram = 0
    this.onDiagramChange = () => {}
  }

  render () {
    return html`
      <gscape-head></gscape-head> 
      <div class="widget-body hide">
        ${this.diagrams.map( (diagram, id) => html`
        <div @click="${this.changeDiagram}" name="${diagram.name}" diagram-id="${id}" class="diagram-item">${diagram.name}</div>
        `)}
      </div>
    `
  }

  changeDiagram(e) {
    this.actual_diagram = e.target.getAttribute('diagram-id')
    this.shadowRoot.querySelector('gscape-head').title = e.target.getAttribute('name')
    this.toggleBody()
    this.onDiagramChange(this.diagrams[this.actual_diagram])
  }

  firstUpdated() {
    super.firstUpdated()
    this.shadowRoot.querySelector('gscape-head').title = this.diagrams[this.actual_diagram].name
  }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector)