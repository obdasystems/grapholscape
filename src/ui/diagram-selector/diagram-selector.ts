import { html, css, LitElement, PropertyDeclarations, CSSResultGroup, svg } from 'lit'
import GscapeHeader from '../common/gscape-header'
import GscapeWidget from '../common/gscape-widget'
import { arrowDown, blankSlateDiagrams, diagrams as diagramsIcon } from '../assets/icons'
import getIconSlot from '../util/get-icon-slot'
import { Diagram } from '../../model'
import baseStyle from '../style'
import '../common/list-item/action-list-item'

export default class GscapeDiagramSelector extends LitElement {
  diagrams: Diagram[]
  actualDiagramId: number
  onDiagramSelection: (diagramId: number) => void = () => {}

  static properties: PropertyDeclarations = {
    actualDiagramId: { type: Number }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css `
    :host {
      position: absolute;
      top: 10px;
      left: 10px;
    }

    .gscape-panel {
      margin-top: 4px;
    }

    gscape-button {
      font-wright: 600;
    }
    `
  ]
  

  // static get styles() {
  //   let super_styles = super.styles
  //   let colors = super_styles[1]

  //   return [
  //     super_styles[0],
  //     css`
  //       :host {
  //         top: 10px;
  //         left: 10px;
  //       }

  //       .diagram-item {
  //         cursor:pointer;
  //         padding:5px 10px;
  //       }

  //       .diagram-item:last-of-type {
  //         border-radius: inherit;
  //       }

  //       .selected {
  //         background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
  //         color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
  //         font-weight: bold;
  //       }
  //     `
  //   ]
  // }

  constructor() {
    super()
    // this.draggable = true
    // this.collapsible = true
    // this.diagrams = diagrams
    // this.actual_diagram_id = null
    // this._onDiagramChange = null
    // this.header = new GscapeHeader('Select a Diagram', diagramsIcon)
  }

  render() {
    return html`
      <gscape-button @click="${this.togglePanel}" label="${this.diagrams[this.actualDiagramId]?.name || 'Select a diagram'}">
        ${getIconSlot('icon', diagramsIcon)}
        ${getIconSlot('trailing-icon', arrowDown)}
      </gscape-button>

      <div class="gscape-panel hide">
        ${this.diagrams.length === 1 && this.actualDiagramId === 0
          ? html`
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="header">No more diagrams</div>
              <div class="description">The ontology contains only one diagram, the one displayed.</div>
            </div>
          `
          : this.diagrams
            .sort(function (a, b) {
              var x = a.name.toLowerCase()
              var y = b.name.toLowerCase()
              if (x < y) { return -1; }
              if (x > y) { return 1; }
              return 0
            })
            .map(diagram => html`
              <gscape-action-list-item
                @click="${this.diagramSelectionHandler}"
                label="${diagram.name}"
                diagram-id="${diagram.id}"
                ?selected = "${this.actualDiagramId === diagram.id}"
              ></gscape-action-list-item>
            `)
        }
        
        </div>
      `
  }

  private togglePanel() {
    this.shadowRoot.querySelector('.gscape-panel').classList.toggle('hide')
  }

  private diagramSelectionHandler(e: Event) {
    const selectedDiagramId = parseInt((e.target as HTMLElement).getAttribute('diagram-id'))
    this.onDiagramSelection(selectedDiagramId)
  }

  // changeDiagram(e) {
  //   if (this.shadowRoot.querySelector('.selected'))
  //     this.shadowRoot.querySelector('.selected').classList.remove('selected')

  //   e.target.classList.add('selected')

  //   let diagram_id = e.target.getAttribute('diagram-id')

  //   this.toggleBody()
  //   this.actual_diagram_id = diagram_id
  //   this._onDiagramChange(diagram_id)
  // }

  // firstUpdated() {
  //   super.firstUpdated()

  //   this.makeDraggableHeadTitle()
  // }

  // set onDiagramChange(f) {
  //   this._onDiagramChange = f
  // }

  // set actual_diagram_id(diagram_id) {
  //   this._actual_diagram_id = diagram_id

  //   if (diagram_id != null) {
  //     this.header.title = this.diagrams.find(d => d.id == diagram_id).name
  //   }

  //   this.requestUpdate()
  // }

  // get actual_diagram_id() {
  //   return this._actual_diagram_id
  // }

  // get actual_diagram() {
  //   return this._actual_diagram
  // }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector)
