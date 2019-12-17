import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeButton from './common/gscape-button'

export default class GscapeOntologyInfo extends GscapeWidget {

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          bottom:10px;
          left:52px;
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
          border-right: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
          text-align: left;
          font-weight: normal;
        }
      `,
    ]
  }

  constructor(ontology) {
    super(false,true)
    this.ontology = ontology

    this.btn = new GscapeButton('info_outline')
    this.btn.onClick = this.toggleBody.bind(this)
  }

  render() {
    return html`
      ${this.btn}

      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Ontology Info</div>

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

        
        <table class="iri-dict details_table">
          <tr><th colspan="2" class="table-header">IRI Prefixes Dictionary</th></tr>

          ${[...this.ontology.iriSet].map(iri => {
            if (!iri.isStandard()) {
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
    `
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)