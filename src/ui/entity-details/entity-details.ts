import { css, html, LitElement } from 'lit'
import { EntityNameType, GrapholElement, GrapholEntity, TypesEnum } from '../../model'
import { blankSlateDiagrams, commentIcon, domain, infoFilled, minus, plus, range, shieldCheck, swapHorizontal } from '../assets/icons'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { GscapeButtonStyle } from '../common/button'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle from '../style'
import { DiagramViewData, getEntityOccurrencesTemplate, OccurrenceIdViewData } from '../util/get-entity-view-occurrences'
import commentsTemplate from '../common/comments-template'
import { SHACLShapeTypeEnum } from '../../model/rdf-graph/swagger'
import { SHACLShapeViewData } from '../view-model'

export default class GscapeEntityDetails extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Entity Details'
  grapholEntity: GrapholEntity
  currentOccurrence?: GrapholElement
  occurrences: Map<DiagramViewData, OccurrenceIdViewData[]>
  showOccurrences: boolean = true
  language: string = 'en'
  entityNameType: EntityNameType = EntityNameType.LABEL
  inverseObjectPropertyEntities?: GrapholEntity[]
  onNodeNavigation: (elmentId: string, diagramId: number) => void = () => { }
  onEntityNavigation: (iri: string) => void = () => { }
  onWikiLinkClick: (iri: string) => void

  incrementalSection?: HTMLElement
  constraints: SHACLShapeViewData[] = []
  domainConstraints: SHACLShapeViewData[] = []
  rangeConstraints: SHACLShapeViewData[] = []

  protected isDefaultClosed: boolean = false
  private lastHeight: string = 'unset'
  private lastWidth: string = 'unset'

  static get properties() {
    return {
      grapholEntity: { type: Object, attribute: false },
      occurrences: { type: Object, attribute: false },
      showOccurrences: { type: Boolean },
      language: { type: String, attribute: false },
      _isPanelClosed: { type: Boolean, attribute: false },
      incrementalSection: {type: Object, attribute: false },
      constraints: { type: Array },
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
        max-height: calc(100% - 20px);
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

      .constraint {
        display: flex;
        align-items: center;
        gap: 8px;
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
                  ${(this.currentOccurrence.domainTyped !== undefined && this.currentOccurrence.domainMandatory !== undefined) || this.domainConstraints.length > 0
                    ? html`
                      <span class="slotted-icon">${domain}</span>
                      <span class="bold-text">Domain</span>
                      ${this.currentOccurrence.domainTyped ? html`<span class="chip-neutral">Typed</span>` : undefined }
                      ${this.currentOccurrence.domainMandatory ? html`<span class="chip-neutral">Mandatory</span>` : undefined }
                      ${this.domainConstraints.map(constraint => this.constraintTemplate(constraint))}
                    `
                    : undefined
                  }
                </div>
                <div class="section-header">
                  ${(this.currentOccurrence.rangeTyped !== undefined && this.currentOccurrence.rangeMandatory !== undefined) || this.rangeConstraints.length > 0
                    ? html`
                      <span class="slotted-icon">${range}</span>
                      <span class="bold-text">Range</span>
                      ${this.currentOccurrence.rangeTyped ? html`<span class="chip-neutral">Typed</span>` : undefined }
                      ${this.currentOccurrence.rangeMandatory ? html`<span class="chip-neutral">Mandatory</span>` : undefined }
                      ${this.rangeConstraints.map(constraint => this.constraintTemplate(constraint))}
                    `
                    : undefined
                  }
                  
                </div>
              </div>
            `
            : null
          }

          ${this.inverseObjectPropertyEntities
            ? html`
              <div class="section">
                <div class="section-header">
                  <span class="slotted-icon">${swapHorizontal}</span>
                  <span class="bold-text">
                    Inverse Of
                  </span>
                </div>
                <div>
                  ${this.inverseObjectPropertyEntities?.map(inverseOPentity => {
                    return html`
                      <gscape-entity-list-item
                        displayedName=${inverseOPentity.getDisplayedName(this.entityNameType, this.language)}
                        .types=${inverseOPentity.types}
                        iri=${inverseOPentity.iri.fullIri}
                        ?actionable=${true}
                        @click=${() => this.onEntityNavigation(inverseOPentity.iri.fullIri)}
                      >
                      </gscape-entity-list-item>
                    `
                  })}
                </div>
              </div>
            `
            : null
          }

          ${this.constraints.length > 0
            ? html`
            <div class="section">
              <div class="bold-text section-header">
                <span class="slotted-icon">${shieldCheck}</span>  
                <span>Constraints</span>
              </div>
              <div class="section-body">
                ${this.constraints.map(constraint => this.constraintTemplate(constraint))}
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

  private constraintTemplate(constraint: SHACLShapeViewData) {
    const viewInfo = viewSHACLShapeInfo[constraint.type]
    return html`<div class="constraint">
      <span>
        ${viewInfo.label}
      </span>
      ${viewInfo.operator ? html`<span style="display: inline" class="chip chip-neutral">${viewInfo.operator}</span>` : null}
      ${constraint.constraintValue
        ? html`
          <div>
            ${constraint.constraintValue.map(c => html`<span class="chip">${c}</span>`)}
          </div>
        `
        : null
      }
      ${constraint.property
        ? html`
          <gscape-entity-list-item
            displayedName=${constraint.property.getDisplayedName(this.entityNameType, this.language)}
            .types=${constraint.property.types}
            iri=${constraint.property.iri.fullIri}
            ?actionable=${true}
            @click=${() => this.onEntityNavigation(constraint.property!.iri.fullIri)}
          >
          </gscape-entity-list-item>
        `
        : null
      }
    </div>`
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
      this.language = allComments[0].language || 'en'
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
    this.lastHeight = this.style.height
    this.lastWidth = this.style.width
    this.style.height = '0'
    this.style.width = '0'
  }

  openPanel(): void {
    super.openPanel()
    this.style.overflow = 'auto'
    this.style.height = this.lastHeight
    this.style.width = this.lastWidth
  }
}

const viewSHACLShapeInfo: {[x in SHACLShapeTypeEnum]: { label: string, operator?: string }} = {
  [SHACLShapeTypeEnum.MIN_COUNT]: { label: 'Min. Cardinality:' },
  [SHACLShapeTypeEnum.MAX_COUNT]: { label: 'Max. Cardinality:'},
  [SHACLShapeTypeEnum.MIN_EXCLUSIVE]: { label:'Values must be', operator: '>=' },
  [SHACLShapeTypeEnum.MIN_INCLUSIVE]: { label:'Values must be', operator: '>' },
  [SHACLShapeTypeEnum.MAX_EXCLUSIVE]: { label:'Values must be', operator: '<=' },
  [SHACLShapeTypeEnum.MAX_INCLUSIVE]: { label:'Values must be', operator: '<' },
  [SHACLShapeTypeEnum.MIN_LENGTH]: { label:'Min. Length:' },
  [SHACLShapeTypeEnum.MAX_LENGTH]: { label:'Max. Length:' },
  [SHACLShapeTypeEnum.PATTERN]: { label:'Regular Expression:' },
  [SHACLShapeTypeEnum.IN]: { label:'Admitted Values:' },
  [SHACLShapeTypeEnum.EQUALS]: { label:'Values must be', operator: '=' },
  [SHACLShapeTypeEnum.DISJOINT]: { label:'Values must be', operator: '!=' },
  [SHACLShapeTypeEnum.LESS_THAN]: { label:'Values must be', operator: '<' },
  [SHACLShapeTypeEnum.LESS_THAN_OR_EQUALS]: { label:'Values must be', operator: '<=' },
  [SHACLShapeTypeEnum.GREATER_THAN]: { label:'Values must be', operator: '>' },
  [SHACLShapeTypeEnum.GREATER_THAN_OR_EQUALS]: { label:'Values must be', operator: '>=' },
}

customElements.define('gscape-entity-details', GscapeEntityDetails)