import { css, html, LitElement } from 'lit'
import { GrapholEntity, GrapholTypesEnum } from '../../model'
import { EntityOccurrence } from '../../model/graphol-elems/entity'
import { infoFilled, minus, plus } from '../assets/icons'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import { GscapeButtonStyle } from '../common/button'
import { GscapeIncrementalMenu } from '../incremental-ui'
import baseStyle from '../style'
import { DiagramViewData, getEntityOccurrencesTemplate, OccurrenceIdViewData } from '../util/get-entity-view-occurrences'

export default class GscapeEntityDetails extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Entity Details'
  grapholEntity: GrapholEntity
  occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>
  language: string
  onNodeNavigation: (occurrence: EntityOccurrence) => void = () => { }
  onWikiLinkClick: (iri: string) => void

  incrementalSection?: HTMLElement

  static get properties() {
    return {
      grapholEntity: { type: Object, attribute: false },
      occurrences: { type: Object, attribute: false },
      language: { type: String, attribute: false },
      _isPanelClosed: { type: Boolean, attribute: false },
      incrementalSection: {type: Object, attribute: false }
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
        max-height: 50%;
        min-height: 200px;
        min-width: 300px;
        max-width: 20%;
        display: flex;
        flex-direction: column;
        pointer-events: none;
      }

      .gscape-panel {
        padding:0;
        max-height: inherit;
        display: flex;
        flex-direction: column;
        width: inherit;
        max-width: unset;
        min-width: unset;
      }

      .gscape-panel > * {
        padding: 8px;
      }

      .datatype-chip {
        color: inherit;
        background-color: var(--gscape-color-neutral-muted);
        border-color: var(--gscape-color-border-subtle);
        padding-top: 1px;
      }

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
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
        flex-shrink: 0;
      }

      .content-wrapper > * {
        margin: 8px 0;
      }
    `
  ]

  render() {
    if (!this.grapholEntity) return
    return html`
      <div class="gscape-panel ellipsed" id="drop-panel">
        ${!this.grapholEntity.is(GrapholTypesEnum.CLASS_INSTANCE)
            ? itemWithIriTemplate(this.entityForTemplate, this.onWikiLinkClick)
            : itemWithIriTemplate(this.entityForTemplate)
        }

        <div class="content-wrapper">
          ${this.grapholEntity.datatype
            ? html`
              <div style="text-align: center" class="chips-wrapper section">
                <span class="chip datatype-chip">${this.grapholEntity.datatype}</span>
              </div>
            `
            : null
          }

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

          ${this.incrementalSection}

          ${annotationsTemplate(this.grapholEntity.getAnnotations())}
          
          ${!this.incrementalSection && this.occurrences.size > 0 ? this.occurrencesTemplate() : null }

          ${this.grapholEntity.getComments().length > 0
            ? html`
                <div class="section">
                  <div>
                    <span id="description-header" class="bold-text section-header">Description</span>
                    <select id="language-select" class="btn btn-s" @change=${this.languageSelectionHandler}>
                      ${this.commentsLanguages.map(language => {
                        return html`
                          <option value="${language}" ?selected=${this.language === language}>
                            @${language}
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
      </div>

      <div class="top-bar">
        <gscape-button style="z-index: 1"
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
    return html`
      <div class="section">
        <div class="bold-text section-header">Occurrences</div>
        <div class="section-body">
          ${getEntityOccurrencesTemplate(this.occurrences, this.onNodeNavigation)}
        </div>
      </div>
    `
  }

  // override blur to avoid collapsing when clicking on cytoscape's canvas
  blur() { }

  setGrapholEntity(entity: GrapholEntity) { }

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

  updated() {
    // let description = this.entity?.annotations?.comment
    const allComments = this.grapholEntity?.getComments()
    if (!allComments || allComments.length === 0) return
    const commentsInActualLanguage = this.grapholEntity.getComments(this.language)
    // if actual language is not available, select the first available
    if (commentsInActualLanguage.length === 0) {
      this.language = allComments[0].language
    }
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)