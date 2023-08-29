import { EdgeSingular, NodeSingular } from 'cytoscape'
import { css, html, LitElement, PropertyDeclarations } from 'lit'
import { TypesEnum } from '../../model'
import rdfgraphSerializer from '../../rdfgraph-serializer'
import * as UI from '../../ui'
import Grapholscape from '../core'
import { DesignerEvent } from '../lifecycle'
import { addObjectProperty } from './commands'
import { initNewDataPropertyUI, initNewDiagramUI, initNewEntityUI, initNewIndividualUI } from './init-modals'
import { initOntologyManagerModal } from './ontology-manager'
import { addObjectPropertyIcon2 } from '../../ui/assets'

const {
  BaseMixin,
  baseStyle,
  icons,
} = UI

export default class GscapeDesignerToolbar extends BaseMixin(LitElement) {
  title = "Designer Tools"

  protected isDefaultClosed: boolean = false

  public undoEnabled = false
  public redoEnabled = false
  public objectPropEnabled = false
  public individualEnabled = false
  public newVersionEnabled = false

  private _lastSelectedElement?: NodeSingular | EdgeSingular

  static properties: PropertyDeclarations = {
    undoEnabled: { type: Boolean },
    redoEnabled: { type: Boolean },
    objectPropEnabled: { type: Boolean },
    individualEnabled: { type: Boolean },
    newVersionEnabled: { type: Boolean },
  }

  static styles = [
    baseStyle,
    css`
      :host {
        left: 50%;
        transform: translate(-50%);
        position: absolute;
        bottom: 10px;
      }

      .gscape-panel {
        padding: 0px;
        max-width: unset;
        width: unset;
      }

      .widget-body {
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        overflow: auto;
        width: fit-content;
      }

      .hr {
        background-color: var(--gscape-color-border-subtle);
        width: 1px;
        height: 1.7em;
        margin: 0 8px
      }
    `,
  ]

  constructor(private grapholscape: Grapholscape) {
    super()
  }

  private handleNewDataProperty() {
    initNewDataPropertyUI(this.grapholscape, undefined)
  }

  private handleNewObjectProperty() {
    if (this.lastSelectedElement?.is(TypesEnum.CLASS) && this.lastSelectedElement.isNode()) {
      addObjectProperty(this.grapholscape, this.lastSelectedElement).select()
    }
  }

  private handleNewIndividual() {
      initNewIndividualUI(this.grapholscape, undefined)
  }

  private handleOntologyManager() {
    initOntologyManagerModal(this.grapholscape)
  }

  private handleSaveDraft() {
    this.grapholscape.lifecycle.trigger(DesignerEvent.SaveDraft, rdfgraphSerializer(this.grapholscape))
  }

  private handleSaveVersion() {
    this.grapholscape.lifecycle.trigger(DesignerEvent.SaveVersion, rdfgraphSerializer(this.grapholscape))
  }

  public get lastSelectedElement() { return this._lastSelectedElement}
  public set lastSelectedElement(newElem) {
    const oldElem = this._lastSelectedElement
    this._lastSelectedElement = newElem

    const isClass = newElem?.data().type === TypesEnum.CLASS || false
    this.objectPropEnabled = isClass
    this.individualEnabled = isClass

    this.requestUpdate('_lastSelectedElement', oldElem)
  }

  render() {
    return html`
      <div class="gscape-panel">
        <div class="widget-body">
          <gscape-button @click=${() => initNewDiagramUI(this.grapholscape)} size="s" label="Diagram" title="Add Diagram">
            <span slot="icon">${icons.plus}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button @click=${() => initNewEntityUI(this.grapholscape, TypesEnum.CLASS)} size="s" type="subtle" title="Add Class">
            <span slot="icon">${icons.classIcon}</span>
          </gscape-button>
          <gscape-button @click=${this.handleNewDataProperty} size="s" type="subtle" title="Add Data Property">
            <span slot="icon">${icons.dataPropertyIcon}</span>
          </gscape-button>
          <gscape-button @click=${this.handleNewObjectProperty} size="s" type="subtle" title="Add Object Property" ?disabled=${!this.objectPropEnabled}>
            <span slot="icon">${addObjectPropertyIcon2}</span>
          </gscape-button>
          <gscape-button @click=${this.handleNewIndividual} size="s" type="subtle" title="Add Individual">
            <span slot="icon">${icons.individualIcon}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button size="s" type="subtle" title="Undo" ?disabled=${!this.undoEnabled}>
            <span slot="icon">${icons.undo}</span>
          </gscape-button>

          <gscape-button size="s" type="subtle" title="Redo" ?disabled=${!this.redoEnabled}>
            <span slot="icon">${icons.redo}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button size="s" title="Ontology Manager" type="subtle" @click=${this.handleOntologyManager}>
            <span slot="icon">${icons.tools}</span>
          </gscape-button>

          <gscape-button size="s" type="subtle" title="Save Draft">
            <span slot="icon">${icons.save}</span>
          </gscape-button>

          <gscape-button
            size="s"
            type="primary"
            label="New Version"
            title="Save A New Version"
            ?disabled=${!this.newVersionEnabled}
          >
            <span slot="icon">${icons.addPack}</span>
          </gscape-button>
        </div>
      </div>
    `
  }
}

customElements.define('gscape-designer-toolbox', GscapeDesignerToolbar)