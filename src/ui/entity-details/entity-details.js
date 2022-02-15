import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import annotationsTemplate from '../common/annotations-template'
import entityOccurrencesTemplate from './entityOccurrencesTemplate'
import { info_filled } from '../assets/icons'
//import entityOccurrencesTemplate from './common/entityOccurrencesTemplate'

export default class GscapeEntityDetails extends GscapeWidget {
  static get properties() {
    return {
      entity: { type: Object },
      languageSelected: { type: String }
    }
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
          border-bottom: solid 1px var(--theme-gscape-borders, ${colors.borders});
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

        .descr-text > span {
          margin-bottom:10px;
          display: inline-block;
        }

        #language-select {
          margin: 10px auto;
          display: block;
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
    this._languageSelected = ''

    this.onNodeNavigation = {}
    this.header = new GscapeHeader('Entity Details', info_filled)

    /**
     * @param {import('cytoscape').CollectionReturnValue} entity
     */
    this.setEntity = (entity) => { }
  }

  render() {
    let comment = this.entity?.annotations?.comment
    return html`
      ${this.header}
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
            
            ${entityOccurrencesTemplate(this.entity.occurrences, this.handleNodeSelection)}
            ${annotationsTemplate(this.entity)}
            
            ${comment && Object.keys(comment).length > 0 ?
              html`
                <div class="section">
                  <div class="section-header"> Description </div>
                    ${!Object.keys(comment).includes('') 
                      ? html`
                        <select name="language-select" id="language-select" @change=${this._languageChangeHandler}>
                        ${Object.keys(comment).map( language =>
                          html`
                            <option value="${language}" >
                              ${language.toUpperCase()}
                            </option>
                          `
                        )}
                        </select>
                      `
                      : ''
                    }
                    <span class="descr-text"></span>
                </div>
              ` : html``
            }
          `
        : html``
        }
      </div>
    `
  }

  _languageChangeHandler(e) {
    this.languageSelected = e.target.value
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
    let description = this.entity?.annotations?.comment
    // if actual language is not available, select the first available
    if (description && !description[this.languageSelected]) {
      this._languageSelected = Object.keys(description)[0]
    }

    if (this.languageSelect) this.languageSelect.value = this.languageSelected

    if (this.entity && this.entity.annotations?.comment)
      this.renderDescription(this.entity.annotations.comment)

    if (this._onWikiClick) {
      this.shadowRoot.querySelectorAll('.wiki').forEach(el => {
        el.classList.add('clickable')
      })
    }
  }

  renderDescription (description) {
    let text = ''

    description[this.languageSelected].forEach( comment => {
      text += '<span>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</span>'
    })

    if (text.length > 0) 
      this.shadowRoot.querySelector('.descr-text').innerHTML = text
  }

  handleNodeSelection(e) {
    let node_id = e.target.getAttribute('node_id')
    this.onNodeNavigation(node_id)
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.invertIcons()
    this.makeDraggableHeadTitle()
  }

  // override
  blur() {
    this.hide()
  }

  set languageSelected(language) {
    this._languageSelected = language
    this.requestUpdate()
  }

  get languageSelected() {
    return this._languageSelected
  }

  get languageSelect() {
    return this.shadowRoot.querySelector('#language-select')
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)