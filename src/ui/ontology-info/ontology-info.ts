import { html, css, LitElement, PropertyDeclarations } from 'lit'
import { annotationsStyle, annotationsTemplate, itemWithIriTemplate, itemWithIriTemplateStyle, ViewItemWithIri } from '../common/annotations-template'
import { info_outline } from '../assets/icons'
import { BaseMixin, DropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { Annotation, Namespace, Ontology, TypesEnum } from '../../model'
import { capitalizeFirstChar } from '../../util'
import { GscapeButtonStyle, SizeEnum } from '../common/button'
import GscapeSelect from '../common/gscape-select'
import commentsTemplate from '../common/comments-template'

export type OntologyViewModel = ViewItemWithIri & {
  namespaces: Namespace[],
  annotations: Annotation[],
}

export type EntityCounters = {
  [TypesEnum.CLASS]: number,
  [TypesEnum.DATA_PROPERTY]: number,
  [TypesEnum.OBJECT_PROPERTY]: number,
  [TypesEnum.INDIVIDUAL]: number,
}

export default class GscapeOntologyInfo extends DropPanelMixin(BaseMixin(LitElement)) {
  title = "Ontology Info"
  ontology?: Ontology
  entityCounters: EntityCounters = {
    [TypesEnum.CLASS]: 0,
    [TypesEnum.DATA_PROPERTY]: 0,
    [TypesEnum.OBJECT_PROPERTY]: 0,
    [TypesEnum.INDIVIDUAL]: 0,
  }
  diagramIdFilter?: number
  language?: string

  static properties: PropertyDeclarations = {
    title: { type: String },
    language: { type: String },
    ontology: { type: Object },
    entityCounters: { type: Object },
    diagramIdFilter: { type: Number },
  }

  static styles = [
    baseStyle,
    itemWithIriTemplateStyle,
    annotationsStyle,
    GscapeButtonStyle,
    css`
      :host {
        order: 4;
        display:inline-block;
        position: initial;
        margin-top: 10px;
      }

      .gscape-panel {
        padding:0;
        min-height: 200px;
      }

      .gscape-panel > * {
        padding: 8px 16px;
      }

      .gscape-panel-in-tray > .content-wrapper {
        padding: 8px;
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding: 4px 0;
      }

      .prefix-column {
        flex-shrink: 0;
        width: 50px;
        text-align: right;
      }

      .area:last-of-type {
        margin-bottom: 0;
      }

      .entity-counter {
        display: flex;
        align-items: center;
        padding: 4px;
      }

      .entity-counter > span {
        width: 145px;
        flex-shrink: 0;
      }

      .counter-bar {
        height: 6px;
        border-radius: 6px;
      }

      .counter-bar[type = "class"] {
        background: var(--gscape-color-class);
        border: solid 1px var(--gscape-color-class-contrast);
      }

      .counter-bar[type = "data-property"] {
        background: var(--gscape-color-data-property);
        border: solid 1px var(--gscape-color-data-property-contrast);
      }

      .counter-bar[type = "object-property"] {
        background: var(--gscape-color-object-property);
        border: solid 1px var(--gscape-color-object-property-contrast);
      }

      .counter-bar[type = "individual"] {
        background: var(--gscape-color-individual);
        border: solid 1px var(--gscape-color-individual-contrast);
      }

      .counter-bar[type = "class-instance"] {
        background: var(--gscape-color-class-instance);
        border: solid 1px var(--gscape-color-class-instance-contrast);
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button type="subtle" @click="${this.togglePanel}">
        <span slot="icon">${info_outline}</span>
      </gscape-button>  

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        ${this.ontology && itemWithIriTemplate({
          name: this.ontology.name,
          iri: this.ontology.iri || '',
          typeOrVersion: [this.ontology.version],
        })}
        
        <div class="content-wrapper">
          ${this.ontology && this.ontology.getAnnotations().length > 0 
            ? html`
                <div class="area" style="display: flex; flex-direction: column; gap: 16px">
                  ${annotationsTemplate(this.ontology.getAnnotations())}
                  ${this.ontology && this.ontology.getComments().length > 0
                    ? commentsTemplate(this.ontology, this.language, (e) => { this.language = (e.target as HTMLSelectElement | null)?.value})
                    : null
                  }
                </div>
              `
            : null
          }

          <div class="area">
            <div class="bold-text">Entity Counters</div>
            <div class="area-content">
              ${this.ontology && this.ontology.diagrams.length > 1
                ? html`
                  <gscape-select
                    size=${SizeEnum.S}
                    .options=${this.ontology.diagrams.map(diagram => {
                      return {
                        id: diagram.id.toString(),
                        text: diagram.name,
                      }
                    })}
                    .placeholder=${ {text: 'Filter by Diagram'} }
                    ?clearable=${true}
                    .selected-options=${this.diagramIdFilter ? new Set([this.diagramIdFilter]) : undefined }
                    @change=${this.handleDiagramFilterChange}
                    style="margin-bottom: 4px;"
                  >
                  </gscape-select>
                `
                : null
              }

              ${Object.entries(this.entityCounters).map(([entityType, number]) => {
                return html`
                  <div class="entity-counter actionable" title=${number}>
                    <span>${capitalizeFirstChar(entityType.replace('-', ' '))} - <span class="muted-text" style="font-size: 90%">${number}</span></span>
                    <div 
                      class="counter-bar"
                      type=${entityType}
                      style="width: ${Math.round((number / this.totalEntityNumber) * 100)}%"
                    >
                    </div>
                  </div>
                `
              })}
            </div>
          </div>

          ${this.iriPrefixesTemplate()}
        </div>
      </div>
    `
  }

  private iriPrefixesTemplate() {
    return html`
      <div class="area">
        <div class="bold-text">Namespace prefixes</div>
        <div class="area-content">
          ${this.ontology?.namespaces.map(namespace => {
            return html`${namespace.prefixes.map((prefix, i) => {
              return html`
                <div class="row">
                  <div class="prefix-column bold-text">${prefix}</div>
                  <span class="vr"></span>
                  <div class="namespace-value-column">${namespace.toString()}</div>
              </div>
              `
            })}`
          })}
        </div>
      </div>
    `
  }

  private async handleDiagramFilterChange(e) {
    const selectInput = e.target as GscapeSelect
    let selectedDiagramId: number | undefined
    try {
      selectedDiagramId = parseInt(Array.from(selectInput.selectedOptionsId)[0])
    } catch(e) {
      selectInput.clear()
    }

    await this.updateComplete
    if (selectedDiagramId !== undefined && !isNaN(selectedDiagramId)) {
      this.diagramIdFilter = selectedDiagramId
      this.dispatchEvent(new CustomEvent('counters-filter', {
        bubbles: true,
        composed: true,
        detail: { diagramId: selectedDiagramId },
      }))
    } else {
      this.diagramIdFilter = undefined
      this.dispatchEvent(new CustomEvent('counters-update', {
        bubbles: true,
        composed: true,
        detail: { diagramId: undefined },
      }))
    }
  }

  private get totalEntityNumber() {
    return Object.values(this.entityCounters).reduce((result, currentNum) => result + currentNum)
  }
}

customElements.define('gscape-ontology-info', GscapeOntologyInfo)