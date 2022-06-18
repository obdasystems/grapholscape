import { css, html, LitElement } from 'lit'
import { GrapholEntity } from '../../model'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'
import { GscapeButtonStyle } from '../common/button'
import GscapeSelect from '../common/gscape-select'
import { infoFilled, minus, plus } from '../assets/icons'
import { EntityOccurrence } from '../../model/graphol-elems/entity'

type DiagramViewData = { id: number, name: string }

export default class GscapeEntityDetails extends DropPanelMixin(LitElement) {  
  grapholEntity: GrapholEntity
  diagramNames: DiagramViewData[] = []
  language: string
  onNodeNavigation: (occurrence: EntityOccurrence) => void = () => { }

  static get properties() {
    return {
      grapholEntity: { type: Object, attribute: false },
      language: { type: String, attribute: false },
      _isPanelClosed: { type : Boolean, attribute: false}
    }
  }

  static styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    GscapeButtonStyle,
    css`
      :host {
        position: absolute;
        top:10px;
        right:62px;
      }

      .gscape-panel {
        padding:0;
        min-width: 200px;
      }

      .gscape-panel > * {
        padding: 8px;
      }

      .chip {
        display: inline-block;
        border: 1px solid var(--gscape-color-accent-emphasis);
        color: var(--gscape-color-accent-fg);
        border-radius: 16px;
        padding: 0px 6px;
        background: var(--gscape-color-accent-subtle);
        margin: 1px 2px;
      }

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent-fg);
      }

      #language-select: {
        margin: 10px auto;
        display: block;
      }

      #description-header {
        margin-right: 8px;
      }

      .comment {
        margin: 8px 0;
        display: block;
      }

      .section-body {
        padding: 0px 8px;
      }

      .section-header {
        margin-bottom: 4px;
      }

      .top-bar {
        display: flex;
        flex-direction: row-reverse;
        line-height: 1;
        position: absolute;
        top: 0;
        right: 0;
      }

      .item-with-iri-info {
        padding-top: 12px;
      }
    `
  ]

  render() {
    if (!this.grapholEntity) return
    return html`
      <div class="gscape-panel ellipsed" id="drop-panel">
        ${itemWithIriTemplate(this.entityForTemplate)}

        ${this.grapholEntity.functionalities.length > 0
          ? html`
              <div class="chips-wrapper section">
                ${this.grapholEntity.functionalities.map(functionality => {
                  return html`<span class="chip">&#10003; ${functionality.toString()}</span>`
                })}
              </div>
            `
          : null
        }

        ${annotationsTemplate(this.grapholEntity.getAnnotations())}
        
        ${this.occurrencesTemplate()}

        ${this.grapholEntity.getComments().length > 0
          ? html`
            <div class="section">
              <div>
                <span id="description-header" class="bold-text section-header">Description</span>
                <select id="language-select" class="btn btn-s" @change=${this.languageSelectionHandler}>
                  ${this.commentsLanguages.map(language => {
                    return html`
                      <option value="${language}" selected="${this.language === language ? true : false}">
                        <span class="muted-text">@</span>${language}
                      </option>
                    `
                  })}
                </select>
              </div>
              <div class="section-body">
                ${this.grapholEntity.getComments(this.language).map(comment => 
                  html`<span class="comment">${comment.lexicalForm}</span>`
                )}
              </div>
            </div>
          `
          : null
        }
      </div>
      <div class="top-bar">
        <gscape-button 
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? 'Entity Details' : ''}"
        > 
          ${this.isPanelClosed()
            ? html`
              <span slot="icon">${infoFilled}</span>
              <span slot="trailing-icon">${plus}</span>
            `
            : html`<span slot="icon">${minus}</span>`
          }
        </gscape-button>
      </div>
    `
  }

  private occurrencesTemplate() {
    const occurrencesForDiagram = new Map<DiagramViewData, string[]>()
    this.grapholEntity.occurrences.forEach(occurrencesInDiagramRepresentation => {
      occurrencesInDiagramRepresentation.forEach(occurrence => {
        let diagram = this.diagramNames.find(d => d.id === occurrence.diagramId)
        if (!diagram) return
        if (!occurrencesForDiagram.get(diagram)) {
          occurrencesForDiagram.set(diagram, [])
        }
        occurrencesForDiagram.get(diagram)?.push(occurrence.elementId)
      })
    })

    return html`
      <div class="section">
        <div class="bold-text section-header">Occurrences</div>
        <div class="section-body">
          ${Array.from(occurrencesForDiagram).map(([diagram, occurrencesIds]) => {
            return html`
              <div diagram-id="${diagram.id}">
                <span class="diagram-name">${diagram.name}</span>
                ${occurrencesIds.map(occurrenceId => html`
                  <gscape-button
                    label="${occurrenceId}"
                    type="subtle"
                    size="s"
                    @click=${this.nodeNavigationHandler}
                  ></gscape-button>
                `)}
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  show() {
    this.style.display = 'initial'
  }

  hide() {
    this.style.display = 'none'
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  private nodeNavigationHandler(e) {
    const target = e.target as HTMLElement
    const diagramId = target.parentElement?.getAttribute('diagram-id')
    const elementId = target.getAttribute('label')

    if (!diagramId || ! elementId) return

    this.onNodeNavigation({
      diagramId: parseInt(diagramId),
      elementId: elementId
    })
  }

  protected togglePanel = () => {
    super.togglePanel()
    this.requestUpdate()
  }
  private languageSelectionHandler(e) {
    this.language = e.target.value
  }

  private get entityForTemplate() {
    const result: ViewItemWithIri = {
      name: this.grapholEntity.iri.remainder,
      typeOrVersion: this.grapholEntity.type.toString(),
      iri: this.grapholEntity.iri.fullIri,
    }
    return result
  }

  private get commentsLanguages() {
    return Array.from(new Set(this.grapholEntity.getComments().map(comment => comment.language)))
  }

  private get _isPanelClosed() {
    return this.isPanelClosed()
  }

  // constructor() {
  //   super()
  //   this.draggable = true
  //   this.collapsible = true

  //   this.hiddenDefault = true
  //   this._entity = null
  //   this.properties = {
  //     functional : 'Functional',
  //     inverseFunctional : 'Inverse Functional',
  //     symmetric : 'Symmetric',
  //     asymmetric: 'Asymmetric',
  //     reflexive : 'Reflexive',
  //     irreflexive : 'Irreflexive',
  //     transitive : 'Transitive',
  //   }
  //   this._languageSelected = ''

  //   this.onNodeNavigation = {}
  //   this.header = new GscapeHeader('Entity Details', info_filled)

  //   /**
  //    * @param {import('cytoscape').CollectionReturnValue} entity
  //    */
  //   this.setEntity = (entity) => { }
  // }

  // render() {
  //   let comment = this.entity?.annotations?.comment
  //   return html`

  //     <div class="widget-body">
  //       ${this.entity
  //         ? html`
  //           <div class="section">
  //             <table class="details_table">
  //               <tr>
  //                 <th>Name</th>
  //                 <td class="wiki" @click="${this.wikiClickHandler}">${this.entity.iri.remainingChars}</td>
  //               </tr>
  //               <tr>
  //                 <th>Type</th>
  //                 <td>${this.entity.type}</td>
  //               </tr>
  //               ${this.entity.type != 'individual'
  //                 ? html`
  //                   <tr>
  //                     <th>IRI</th>
  //                     <td>${this.entity.iri.fullIri}</td>
  //                   </tr>
  //                 `
  //                 : html``
  //               }
  //               ${this.entity.datatype
  //                 ? html`
  //                 <tr>
  //                   <th>Datatype</th>
  //                   <td>${this.entity.datatype.prefixed}</td>
  //                 </tr>
  //                 `
  //                 : html``
  //               }
  //             </table>
  //           </div>

  //           <div class="chips-wrapper">
  //             ${Object.keys(this.properties).map(property => {
  //               return this.entity[property]?
  //                 html`<span class="chip">&#10003; ${this.properties[property]}</span>`
  //               : html``
  //             })}
  //           </div>

  //           ${entityOccurrencesTemplate(this.entity.occurrences, this.handleNodeSelection)}
  //           ${annotationsTemplate(this.entity)}

  //           ${comment && Object.keys(comment).length > 0 
  //             ? html`
  //               <div class="section">
  //                 <div class="section-header"> Description </div>
  //                   ${!Object.keys(comment).includes('') 
  //                     ? html`
  //                       <select name="language-select" id="language-select" @change=${this._languageChangeHandler}>
  //                       ${Object.keys(comment).map( language =>
  //                         html`
  //                           <option value="${language}" >
  //                             ${language.toUpperCase()}
  //                           </option>
  //                         `
  //                       )}
  //                       </select>
  //                     `
  //                     : ''
  //                   }
  //                   <span class="descr-text"></span>
  //               </div>
  //             `
  //             : html``
  //           }
  //         `
  //         : html``
  //       }
  //     </div>
  //   `
  // }

  // _languageChangeHandler(e) {
  //   this.languageSelected = e.target.value
  // }

  // wikiClickHandler(e) {
  //   if (this._onWikiClick)
  //     this._onWikiClick(this.entity.iri.fullIri)
  // }

  // set onWikiClick(foo) {
  //   this._onWikiClick = foo
  // }

  // set entity(entity) {
  //   let oldval = this.entity
  //   this._entity = entity
  //   switch (this._entity.type) {
  //     case 'concept' :
  //       this._entity.type = 'Class'
  //       break;

  //     case 'role' :
  //       this._entity.type = 'Object Property'
  //       break;

  //     case 'attribute':
  //       this._entity.type = 'Data Property'
  //       break;
  //   }
  //   this.requestUpdate('entity', oldval)
  // }

  // get entity() {
  //   return this._entity
  // }

  updated() {
    // let description = this.entity?.annotations?.comment
    const allComments = this.grapholEntity?.getComments()
    if (!allComments || allComments.length === 0) return
    const commentsInActualLanguage = this.grapholEntity.getComments(this.language)
    // if actual language is not available, select the first available
    if (commentsInActualLanguage.length === 0) {
      this.language = allComments[0].language
    }


    // if (this.entity && this.entity.annotations?.comment)
    //   this.renderDescription(this.entity.annotations.comment)

    // if (this._onWikiClick) {
    //   this.shadowRoot.querySelectorAll('.wiki').forEach(el => {
    //     el.classList.add('clickable')
    //   })
    // }
  }


  // renderDescription (description) {
  //   let text = ''

  //   description[this.languageSelected].forEach( comment => {
  //     text += '<span>'+comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/')+'</span>'
  //   })

  //   if (text.length > 0) 
  //     this.shadowRoot.querySelector('.descr-text').innerHTML = text
  // }

  // handleNodeSelection(e) {
  //   let node_id = e.target.getAttribute('node_id')
  //   this.onNodeNavigation(node_id)
  // }

  // firstUpdated() {
  //   super.firstUpdated()
  //   this.header.invertIcons()
  //   this.makeDraggableHeadTitle()
  // }

  // // override
  // blur() {
  //   this.hide()
  // }

  // set languageSelected(language) {
  //   this._languageSelected = language
  //   this.requestUpdate()
  // }

  // get languageSelected() {
  //   return this._languageSelected
  // }

  // get languageSelect() {
  //   return this.shadowRoot.querySelector('#language-select')
  // }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)