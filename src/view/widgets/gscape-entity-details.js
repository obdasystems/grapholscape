import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeHeader from './common/gscape-header'

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

        .widget-body div:last-of-type {
          margin-bottom: 12px;
        }

        .chips-wrapper {
          padding: 12px 6px 0 6px;
          border-spacing: 0;
        }

        .descr-header {
          text-align: center;
          padding: 12px;
          font-weight: bold;
          border-bottom: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
          color: var(--theme-gscape-secondary, ${colors.secondary});
          width: 85%;
          margin: auto;
        }

        .descr-text{
          padding:10px;
        }

        gscape-head {
          --title-text-align: center;
          --title-width: 100%;
        }

        .chip {
          display: inline-block;
          margin: 4px;
          padding: 3px 8px;
          border-radius: 32px;
          border: 1px solid var(--theme-gscape-secondary, ${colors.secondary});
          color: var(--theme-gscape-secondary, ${colors.secondary});
          font-size: 13px;
        }
      `
    ]
  }

  constructor() {
    super(true,true)

    this._entity = null
    this.properties = {
      functional : 'Functional',
      inverseFunctional : 'Inverse Functional',
      symmetric : 'Symmetric',
      asymmetric: 'Asymmetric',
      reflexive : 'Reflexive',
      irreflexive : 'Irreflexive',
      transitive : 'Transitive',
    }
  }

  render() {
    return html`
      <gscape-head title="Entity Details" class="drag-handler"></gscape-head>
      <div class="widget-body">
        ${this.entity?
          html`
            <table class="details_table">
              <tr>
                <th>Name</th>
                <td>${this.entity.label.replace(/\r?\n|\r/g, '')}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>${this.entity.type}</td>
              </tr>
              ${this.entity.type != 'individual' ? html`
              <tr>
                <th>IRI</th>
                <td>${this.entity.iri}</td>
              </tr>
              ` : html``
              } 
            </table>

            <div class="chips-wrapper">
              ${Object.keys(this.properties).map(property => {
                return this.entity[property]?
                  html`<span class="chip">&#10003; ${this.properties[property]}</span>`
                : html``
              })}
            </div>

            ${this.entity.description? 
              html`
                <div>
                  <div class="descr-header"> Description </div>
                  <div class="descr-text">
                  </div>
                </div>
              `
            : html``
            }
          `
        : html``
        }
      </div>
    `
  }

  set entity(entity) {
    let oldval = this.entity
    this._entity = entity
    switch (this._entity.type) {
      case 'concept' :
        this._entity.type = 'Class'
        break;
      
      case 'role' :
        this._entity.type = 'Object Property'
        break;

      case 'attribute':
        this._entity.type = 'Data Property'
        break;
    }
    this.requestUpdate('entity', oldval)
  }

  get entity() {
    return this._entity
  }

  updated() {
    if (this.entity && this.entity.description)
      this.renderDescription(this.entity.description)
  }

  renderDescription (description) {
    let descr_container = this.shadowRoot.querySelector('.descr-text')
    descr_container.innerHTML = description.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
  }

  firstUpdated() {
    super.firstUpdated()
    this.hide()
  }

  blur() {
    this.hide()
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)