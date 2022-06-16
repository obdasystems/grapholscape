import { html, css, LitElement } from 'lit'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { info_outline } from '../assets/icons'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'
import { Namespace } from '../../model'

export type OntologyViewModel = ViewItemWithIri & {
  namespaces: Namespace[],
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
        font-weight: 600;
      }
    `,
  ]


  // constructor(ontology) {
  //   super()
  //   this.collapsible = true
  //   this.ontology = ontology

  //   this.btn = new GscapeButton(info_outline, 'Ontology Info')
  //   this.btn.onClick = this.toggleBody.bind(this)
  // }

  render() {
    return html`
      <gscape-button @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide">
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

  // updated() {
  //   if (this.ontology.description) {
  //     let descr_container
  //     let text
  //     Object.keys(this.ontology.description).forEach( language => {
  //       text = ''
  //       descr_container = this.shadowRoot.querySelector(`[lang = "${language}"] > .descr-text`)
  //       this.ontology.description[language].forEach((comment, i) => {
  //         i > 0 ?
  //           text += '<p>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</p>' :
  //           text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
  //       })
  //       descr_container.innerHTML = text
  //     })
  //   }
  // }

  // show() {
  //   if (this.isEnabled) this.style.display = 'inline-block'
  // }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)