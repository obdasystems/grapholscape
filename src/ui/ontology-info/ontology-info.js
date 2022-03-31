import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeButton from '../common/gscape-button'
import annotationsTemplate from '../common/annotations-template'
import { info_outline } from '../assets/icons'

export default class GscapeOntologyInfo extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          order: 4;
          display:inline-block;
          position: initial;
          margin-top: 10px;
        }

        .gscape-panel {
          padding-right: 0;
        }

        gscape-button {
          position: static;
        }

        .iri-dict th.table-header{
          text-align: center;
          padding: 12px;
          font-weight: bold;
          border-right: 0;
          color: var(--theme-gscape-on-primary, ${colors.on_primary});
        }

        .iri-dict th {
          color: var(--theme-gscape-on-primary, ${colors.on_primary});
          border-right: solid 1px var(--theme-gscape-borders, ${colors.borders});
          text-align: left;
          font-weight: normal;
        }

        .wrapper {
          overflow-y: auto;
          scrollbar-width: inherit;
          max-height: 420px;
          overflow-x: hidden;
          padding-right: 10px;
        }

        .section {
          padding-left: 0;
          padding-right: 0;
        }
      `,
    ]
  }

  constructor(ontology) {
    super()
    this.collapsible = true
    this.ontology = ontology

    this.btn = new GscapeButton(info_outline, 'Ontology Info')
    this.btn.onClick = this.toggleBody.bind(this)
  }

  render() {
    return html`
      ${this.btn}
      <span class="gscape-panel-arrow hide"></span>
      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Ontology Info</div>

        <div class="wrapper">

          <div class="section">
            <table class="details_table">
              <tr>
                <th>Name</th>
                <td>${this.ontology.name}</td>
              </tr>
              <tr>
                <th>Version</th>
                <td>${this.ontology.version}</td>
              </tr>
            </table>
          </div>

          ${annotationsTemplate(this.ontology)}

          <div class="section">
            <div class="section-header">IRI Prefixes Dictionary</div>
            <table class="iri-dict details_table">
              ${[...this.ontology.namespaces].map(iri => {
                if (!iri.standard) {
                  return html`
                    <tr>
                      <th>${iri.prefixes[0]}</th>
                      <td>${iri.value}</td>
                    </tr>
                  `
                }
              })}
            </table>
          </div>
        </div>
      </div>
    `
  }

  updated() {
    if (this.ontology.description) {
      let descr_container
      let text
      Object.keys(this.ontology.description).forEach( language => {
        text = ''
        descr_container = this.shadowRoot.querySelector(`[lang = "${language}"] > .descr-text`)
        this.ontology.description[language].forEach((comment, i) => {
          i > 0 ?
            text += '<p>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</p>' :
            text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
        })
        descr_container.innerHTML = text
      })
    }
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block'
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)