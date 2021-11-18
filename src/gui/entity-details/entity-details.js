import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import annotationsTemplate from '../common/annotations-template'
//import entityOccurrencesTemplate from './common/entityOccurrencesTemplate'

export default class GscapeEntityDetails extends GscapeWidget {

  static get properties() {
    return [
      super.properties,
      {
        entity: { type: Object }
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

        .chips-wrapper {
          padding: 0 10px;
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

        .language {
          text-align: center;
          font-size: 14px;
        }

        tbody:nth-child(n+2)::before {
          content: '';
          display: table-row;
          height: 20px;
        }
      `
    ]
  }

  constructor() {
    super()
    this.draggable = true
    this.collapsible = true

    this.hiddenDefault = true
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

    this.onNodeNavigation = {}
  }

  render() {
    return html`
      <gscape-head title="Entity Details" left_icon="info" class="drag-handler"></gscape-head>
      <div class="widget-body">
        ${this.entity?
          html`
            <div class="section">
              <table class="details_table">
                <tr>
                  <th>Name</th>
                  <td class="wiki" @click="${this.wikiClickHandler}">${this.entity.iri.remainingChars}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>${this.entity.type}</td>
                </tr>
                ${this.entity.type != 'individual' ? html`
                <tr>
                  <th>IRI</th>
                  <td>${this.entity.iri.fullIri}</td>
                </tr>
                ` : html``
                }
              </table>
            </div>

            <div class="chips-wrapper">
              ${Object.keys(this.properties).map(property => {
                return this.entity[property]?
                  html`<span class="chip">&#10003; ${this.properties[property]}</span>`
                : html``
              })}
            </div>

            ${annotationsTemplate(this.entity)}
          `
        : html``
        }
      </div>
    `
  }

  wikiClickHandler(e) {
    if (this._onWikiClick)
      this._onWikiClick(this.entity.iri.fullIri)
  }

  set onWikiClick(foo) {
    this._onWikiClick = foo
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

    if (this._onWikiClick) {
      this.shadowRoot.querySelectorAll('.wiki').forEach(el => {
        el.classList.add('clickable')
      })
    }
  }

  renderDescription (description) {
    let descr_container
    let text
    Object.keys(description).forEach( language => {
      text = ''
      descr_container = this.shadowRoot.querySelector(`[lang = "${language}"] > .descr-text`)
      description[language].forEach((comment, i) => {
        i > 0 ?
          text += '<p>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</p>' :
          text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')
      })
      descr_container.innerHTML = text
    })
  }

  handleNodeSelection(e) {
    let node_id = e.target.getAttribute('node_id')
    this.onNodeNavigation(node_id)
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.invertIcons()
  }

  // override
  blur() {
    this.hide()
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)