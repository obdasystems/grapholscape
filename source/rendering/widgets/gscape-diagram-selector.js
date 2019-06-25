import { html, css } from 'lit-element'
import GscapeHeader from './gscape-header'
import GscapeWidget from './gscape-widget'

export default class GscapeDiagramSelector extends GscapeWidget {
   
  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
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
          color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
          background-color:var(--theme-gscape-secondary, ${colors.secondary});
        }

        .diagram-item:last-of-type {
          border-radius: inherit;
        }

        .selected {
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
          font-weight: bold;
        }
      `
    ]
  }

  constructor(diagrams, actual_diagram) {
    super(true, true)
    this.diagrams = diagrams
    this.actual_diagram = actual_diagram
    this._onDiagramChange = null
  }

  render () {
    return html`
      <gscape-head title="Select a Diagram" collapsed="true" ></gscape-head> 
      <div class="widget-body hide">
        ${this.diagrams.map( (diagram, id) => html`
        <div 
          @click="${this.changeDiagram}" 
          name="${diagram.name}" 
          diagram-id="${id}" 
          class="diagram-item ${id == 0 ? `selected`:``}"
        >
          ${diagram.name}
        </div>
        `)}
      </div>
    `
  }

  changeDiagram(e) {
    this.shadowRoot.querySelector('.selected').classList.remove('selected')
    e.target.classList.add('selected')

    let diagram_id = e.target.getAttribute('diagram-id')
    this.shadowRoot.querySelector('gscape-head').title = e.target.getAttribute('name')
    this.toggleBody()
    this.actual_diagram = this.diagrams[diagram_id]
    this._onDiagramChange(this.actual_diagram)
  }

  firstUpdated() {
    super.firstUpdated()
    //this.shadowRoot.querySelector('gscape-head').title = this.actual_diagram.name
  }

  set onDiagramChange(f) {
    this._onDiagramChange = f
  }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector)