import { html, css } from 'lit-element'
import GscapeHeader from './common/gscape-header'
import GscapeWidget from './common/gscape-widget'

export default class GscapeDiagramSelector extends GscapeWidget {
  static get properties() {
    return [
      super.properties,
      {
        actual_diagram_id : String,
      }
    ]
  }

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

  constructor(diagrams) {
    super()
    this.draggable = true
    this.collapsible = true
    this.diagrams = diagrams
    this.actual_diagram_id = null
    this.default_title = 'Select a Diagram'
    this._onDiagramChange = null
  }

  render () {
    return html`
      <gscape-head title="${this.default_title}" left_icon="dns"
        class="drag-handler"></gscape-head>

      <div class="widget-body hide">
        ${this.diagrams
          .sort(function (a, b) {
            var x = a.name.toLowerCase()
            var y = b.name.toLowerCase()
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0
          })
          .map( diagram => html`
            <div
              @click="${this.changeDiagram}"
              name="${diagram.name}"
              diagram-id="${diagram.id}"
              class="diagram-item highlight ${diagram.id == this.actual_diagram_id ? `selected` : ``}"
            >
              ${diagram.name}
            </div>
            `)}
      </div>
    `
  }

  changeDiagram(e) {
    if (this.shadowRoot.querySelector('.selected'))
      this.shadowRoot.querySelector('.selected').classList.remove('selected')

    e.target.classList.add('selected')

    let diagram_id = e.target.getAttribute('diagram-id')

    this.toggleBody()
    this.actual_diagram_id = diagram_id
    this._onDiagramChange(diagram_id)
  }

  set onDiagramChange(f) {
    this._onDiagramChange = f
  }

  set actual_diagram_id(diagram_id) {
    this._actual_diagram_id = diagram_id

    if (diagram_id != null) {
      for (let diagram of this.diagrams) {
        if (diagram.id == diagram_id) {
          this.header.title = diagram.name
          break
        }
      }
    }

    this.requestUpdate()
  }

  get actual_diagram_id() {
    return this._actual_diagram_id
  }

  get actual_diagram() {
    return this._actual_diagram
  }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector)
