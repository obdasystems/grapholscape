import { html, css } from 'lit-element'
import GscapeWidget from './gscape-widget'
import GscapeHeader from './gscape-header'

export default class GscapeEntityDetails extends GscapeWidget {

  static get properties() {
    return [
      super.properties,
      {
        _entity: {
          type: Object
        }
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
          top:10px;
          right:62px;
          width:400px;
        }

        .details_table {
          padding:2px;
          border-spacing: 0;
        }
        .details_table th {
          color:rgb(81,149,199);
          border-right: solid 2px #ddd;
          font-size:110%;
          text-align:left;
        }
        
        .details_table th, td {
          padding:5px 8px;
          white-space: nowrap;
        }

        .checkmark {
          color: var(--theme-gscape-secondary, ${colors.secondary});
          font-size:20px;
          margin:10px;
          position:relative;
          top:2px;
        }

        .descr-header {
          text-align: center;
          margin: 10px 2px 0 2px;
          padding: 10px 5px;
          font-weight: bold;
          border-bottom: solid 2px var(--theme-gscape-shadows, ${colors.shadows});
          color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .descr-text{
          padding:10px;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }
      `
    ]
  }

  constructor() {
    super(true,true)

    this._entity = null
  }

  render() {
    return html`
      <gscape-head title="Entity Details"></gscape-head>

      ${this.entity?
        html`
          <div class="widget-body">
            <table class="details_table">
              <tr>
                <th>Name</th>
                <td>${this.entity.data.label.replace(/\r?\n|\r/g, '')}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>${this.entity.data.type}</td>
              </tr>
              <tr>
                <th>IRI</th>
                <td>${this.entity.data.iri}</td>
              </tr>
            </table>

            ${Object.keys(this.entity.data.properties).map(property => {
              this.entity.data.properties[property]?
                html`
                  <div>
                    <span class="checkmark">&#9745;</span>
                    <span>${property}</span>
                  </div>
                `
              : html``
            })}

            ${this.entity.data.description? 
              html`
                <div>
                  <div class="descr-header"> Description </div>
                  <div class="descr-text">
                  </div>
                </div>
              `
            : html``
            }
          </div>
        `
      : html``
      }
    `
  }

  set entity(entity) {
    let oldval = this._entity
    this._entity = entity
    switch (this._entity.data.type) {
      case 'concept' :
        this._entity.data.type = 'Class'
        break;
      
      case 'role' :
        this._entity.data.type = 'Object Property'
        break;

      case 'attribute':
        this._entity.data.type = 'Data Property'
        break;
    }

    this.requestUpdate('entity', oldval)
  }

  get entity() {
    return this._entity
  }

  updated() {
    if (this.entity && this.entity.data.description)
      this.renderDescription(this.entity.data.description)
  }

  renderDescription (description) {
    let descr_container = this.shadowRoot.querySelector('.descr-text')
    descr_container.innerHTML = description.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
  }

  firstUpdated() {
    super.firstUpdated()
    this.classList.add('hide')
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)