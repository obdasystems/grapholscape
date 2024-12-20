import { css, html, LitElement } from 'lit'
import { GrapholElement, GrapholEntity, TypesEnum } from '../../model'
import { blankSlateDiagrams, commentIcon, domain, infoFilled, minus, plus, range } from '../assets/icons'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { GscapeButtonStyle } from '../common/button'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle from '../style'
import { DiagramViewData, getEntityOccurrencesTemplate, OccurrenceIdViewData } from '../util/get-entity-view-occurrences'
import commentsTemplate from '../common/comments-template'

export default class GscapeEntityDetails extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Entity Details'
  grapholEntity: GrapholEntity
  currentOccurrence?: GrapholElement
  occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>
  showOccurrences: boolean = true
  language?: string
  onNodeNavigation: (elmentId: string, diagramId: number) => void = () => { }
  onWikiLinkClick: (iri: string) => void

  incrementalSection?: HTMLElement

  protected isDefaultClosed: boolean = false

  static get properties() {
    return {
      grapholEntity: { type: Object, attribute: false },
      occurrences: { type: Object, attribute: false },
      showOccurrences: { type: Boolean },
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
        height: fit-content;
        max-height: calc(100vh - 40px);
        width: 30%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        resize: both;
        direction: rtl;
      }

      #drop-panel {
        direction: ltr;
      }

      .gscape-panel {
        padding: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        max-height: unset;
        max-width: unset;
        box-sizing: border-box;
      }

      .gscape-panel > * {
        padding: 8px;
      }

      [diagram-id] > gscape-button {
        color: var(--gscape-color-accent);
      }

      #language-select: {
        margin: 10px auto;
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

      .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
      }

      .content-wrapper > * {
        flex-shrink: 0;
      }

      .chips-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
      }

      .chips-wrapper > .chip {
        flex-shrink: 0;
      }
    `
  ]

  render() {
    if (!this.grapholEntity) return
    return html`
      <div class="gscape-panel ellipsed" id="drop-panel">
        ${itemWithIriTemplate(this.entityForTemplate, this.onWikiLinkClick, this.currentOccurrence?.is(TypesEnum.IRI))}

        <div class="content-wrapper">
          ${this.currentOccurrenceType === TypesEnum.DATA_PROPERTY && this.grapholEntity.datatype
            ? html`
              <div style="text-align: center" class="chips-wrapper section">
                <span class="chip-neutral">${this.grapholEntity.datatype}</span>
              </div>
            `
            : null
          }

          ${(this.currentOccurrenceType === TypesEnum.DATA_PROPERTY ||
            this.currentOccurrenceType === TypesEnum.OBJECT_PROPERTY) &&
            (this.grapholEntity.functionProperties.length > 0 || this.grapholEntity.isDataPropertyFunctional)
            ? html`
                <div class="chips-wrapper section">
                ${this.grapholEntity.isDataPropertyFunctional
                  ? html`<span class="chip">&#10003; functional</span>`
                  : null
                }
                ${this.grapholEntity.functionProperties.map(functionality => {
                  if (this.grapholEntity.isDataPropertyFunctional)
                    return null
                  else
                    return html`<span class="chip">&#10003; ${functionality.toString()}</span>`
                })}
                </div>
              `
            : null
          }

          ${this.currentOccurrence?.isEdge() && !this.currentOccurrence.is(TypesEnum.ANNOTATION_PROPERTY)
            ? html`
              <div class="section">
                <div class="section-header">
                  ${this.currentOccurrence.domainTyped !== undefined && this.currentOccurrence.domainMandatory !== undefined
                    ? html`
                      <span class="slotted-icon">${domain}</span>
                      <span class="bold-text">Domain</span>
                      ${this.currentOccurrence.domainTyped ? html`<span class="chip-neutral">Typed</span>` : undefined }
                      ${this.currentOccurrence.domainMandatory ? html`<span class="chip-neutral">Mandatory</span>` : undefined }
                    `
                    : undefined
                  }
                  
                </div>
                <div class="section-header">
                  ${this.currentOccurrence.rangeTyped !== undefined && this.currentOccurrence.rangeMandatory !== undefined
                    ? html`
                      <span class="slotted-icon">${range}</span>
                      <span class="bold-text">Range</span>
                      ${this.currentOccurrence.rangeTyped ? html`<span class="chip-neutral">Typed</span>` : undefined }
                      ${this.currentOccurrence.rangeMandatory ? html`<span class="chip-neutral">Mandatory</span>` : undefined }
                    `
                    : undefined
                  }
                  
                </div>
              </div>
            `
            : null
          }

          ${this.incrementalSection}

          ${annotationsTemplate(this.grapholEntity.getAnnotations())}
          
          ${this.showOccurrences && this.occurrences.size > 0 ? this.occurrencesTemplate() : null }

          ${this.grapholEntity.getComments().length > 0
            ? commentsTemplate(this.grapholEntity, this.language, this.languageSelectionHandler)
            : null
          }

          ${this.currentOccurrence && !this.currentOccurrence.isEntity()
            ? html`
              <div class="blank-slate">
                ${blankSlateDiagrams}
                <div class="header">No details available</div>
                <div class="description">It seems like this entity has no definition in the current ontology.</div>
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

  setGrapholEntity(entity: GrapholEntity, instance?: GrapholElement) { }

  private languageSelectionHandler(e) {
    this.language = e.target.value
  }

  private get entityForTemplate() {
    const result: ViewItemWithIri = {
      name: this.grapholEntity.iri.remainder,
      typeOrVersion: this.currentOccurrenceType ? [this.currentOccurrenceType] : this.grapholEntity.types,
      iri: this.grapholEntity.iri.fullIri,
    }
    return result
  }

  private get commentsLanguages() {
    return Array.from(new Set(this.grapholEntity.getComments().map(comment => comment.language)))
  }

  private get currentOccurrenceType() {
    return this.currentOccurrence?.type
  }

  updated() {
    // let description = this.entity?.annotations?.comment
    const allComments = this.grapholEntity?.getComments()
    if (!allComments || allComments.length === 0) return
    const commentsInCurrentLanguage = this.grapholEntity.getComments(this.language)
    // if current language is not available, select the first available
    if (commentsInCurrentLanguage.length === 0) {
      this.language = allComments[0].language
    }
  }

  /**
   * When panel is closed remove the overflow from
   * the host elem, otherwise the button to open up
   * again the panel won't be visible.
   * Restore overflow when panel is visible so it is
   * resizable.
   */
  closePanel(): void {
    super.closePanel()
    this.style.overflow = 'unset'
  }

  openPanel(): void {
    super.openPanel()
    this.style.overflow = 'auto'
  }
}

customElements.define('gscape-entity-details', GscapeEntityDetails)