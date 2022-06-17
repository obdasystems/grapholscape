import { html, css, LitElement } from 'lit'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { info_outline } from '../assets/icons'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'
import { Annotation, Namespace } from '../../model'

export type OntologyViewModel = ViewItemWithIri & {
  namespaces: Namespace[],
  annotations: Annotation[],
}

export default class GscapeOntologyInfo extends DropPanelMixin(LitElement) {
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
        font-size: 12px;
        min-height: 200px;
      }

      .gscape-panel > * {
        padding: 8px 16px;
      }

      table {
        border-spacing: 0;
      }

      th, td {
        padding: 2px;
      }

      td {
        padding-left: 8px;
      }

      th {
        text-align: left;
        border-right: solid 1px var(--gscape-color-border-subtle);
        padding-right: 8px;
      }
      
      table > caption {
        margin-top: 8px;
        font-weight: 600;
      }
    `,
  ]

  render() {
    return html`
      <gscape-button @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header" style="display: none">Ontology Info</div>

        ${itemWithIriTemplate(this.ontology)}
        
        ${annotationsTemplate(this.ontology.annotations)}

        ${this.iriPrefixesTemplate()}
      </div>
    `
  }

  private iriPrefixesTemplate() {
    let numRows: number
    return html`
      <table>
        <caption>Namespace prefixes</caption>
        ${this.ontology.namespaces.map(namespace => {
          numRows = namespace.prefixes.length
          return html`
              ${namespace.prefixes.map((prefix, i) => {
                return html`
                  <tr>
                    <th>${prefix}</th>
                    ${i === 0
                      ? html`<td rowspan="${numRows}">${namespace.toString()}</td>`
                      : null
                    }
                  </tr>
                `
              })}
          `
        })}
      </table>
    `
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)