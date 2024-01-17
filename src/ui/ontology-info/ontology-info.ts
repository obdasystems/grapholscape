import { html, css, LitElement } from 'lit'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { info_outline } from '../assets/icons'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { Annotation, Namespace } from '../../model'

export type OntologyViewModel = ViewItemWithIri & {
  namespaces: Namespace[],
  annotations: Annotation[],
}

export default class GscapeOntologyInfo extends DropPanelMixin(BaseMixin(LitElement)) {
  title = "Ontology Info"
  ontology: OntologyViewModel

  static styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    css`
      :host {
        order: 4;
        display:inline-block;
        position: initial;
        margin-top: 10px;
      }

      .gscape-panel {
        padding:0;
        min-height: 200px;
      }

      .gscape-panel > * {
        padding: 8px 16px;
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding: 4px 0;
      }

      .prefix-column {
        flex-shrink: 0;
        width: 50px;
        text-align: right;
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        ${itemWithIriTemplate(this.ontology)}
        
        <div class="content-wrapper">
          ${annotationsTemplate(this.ontology.annotations)}
          ${this.iriPrefixesTemplate()}
        </div>
      </div>
    `
  }

  private iriPrefixesTemplate() {
    let numRows: number
    return html`
      <div>
        <div class="header" style="text-align: center">Namespace prefixes</div>
        ${this.ontology.namespaces.map(namespace => {
          numRows = namespace.prefixes.length
          return html`
            <div class="row">
              ${namespace.prefixes.map((prefix, i) => {
                return html`
                  <div class="prefix-column bold-text">${prefix}</div>
                  <span class="vr"></span>
                  <div class="namespace-value-column">${namespace.toString()}</div>
                `
              })}
            </div>
          `
        })}
      </div>
    `
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)