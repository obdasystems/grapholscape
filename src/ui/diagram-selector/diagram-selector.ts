import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { Diagram } from '../../model'
import { arrowDown, blankSlateDiagrams, diagrams as diagramsIcon } from '../assets/icons'
import { BaseMixin, DropPanelMixin, TippyDropPanelMixin } from '../common/mixins'
import '../common/list-item/action-list-item'
import baseStyle from '../style'
import getIconSlot from '../util/get-icon-slot'

export default class GscapeDiagramSelector extends TippyDropPanelMixin(BaseMixin(LitElement), 'bottom-start') {
  title = 'Diagram Selector'
  diagrams: Map<string, Diagram>
  currentDiagramId: number
  currentDiagramName: string
  ignoreAnnotationsDiagram: boolean
  onDiagramSelection: (diagramId: number) => void = () => {}

  static properties: PropertyDeclarations = {
    currentDiagramId: { type: Number },
    currentDiagramName: {type : String},
    diagrams: { type: Object },
    ignoreAnnotationsDiagram: { type: Boolean }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css `
    :host {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    `
  ]
  
  render() {
    return html`
      <gscape-button @click="${this.togglePanel}" label="${this.currentDiagram?.name || 'Select a diagram'}">
        ${getIconSlot('icon', diagramsIcon)}
        ${getIconSlot('trailing-icon', arrowDown)}
      </gscape-button>

      <div class="gscape-panel drop-down hide" id="drop-panel">
        ${(this.diagrams.size === 1 && !this.diagrams.get("-1")) || this.diagrams.size === 0
          ? html`
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="header">No more diagrams</div>
              <div class="description">The ontology contains only one diagram, the one displayed.</div>
            </div>
          `
          : html`
            ${Array.from(this.diagrams.values())
              .sort(function (a, b) {
                var x = a.name.toLowerCase()
                var y = b.name.toLowerCase()
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0
              })
              .map(diagram => {
                return diagram.id === -1 && (this.ignoreAnnotationsDiagram || diagram.isEmpty())
                  ? undefined
                  : html`
                    <gscape-action-list-item
                      @click="${this.diagramSelectionHandler}"
                      label="${diagram.name}"
                      diagram-id="${diagram.id}"
                      ?selected = "${this.currentDiagramId === diagram.id}"
                    ></gscape-action-list-item>
                  `})
            }
          `
        }
      </div>
    `
  }

  private diagramSelectionHandler(e: Event) {
    const selectedDiagramId = parseInt((e.target as HTMLElement).getAttribute('diagram-id') || '')
    this.onDiagramSelection(selectedDiagramId)
  }

  private get currentDiagram() {
    if (this.currentDiagramId !== undefined)
      return this.diagrams.get(this.currentDiagramId.toString())
  }
}

customElements.define('gscape-diagram-selector', GscapeDiagramSelector)
