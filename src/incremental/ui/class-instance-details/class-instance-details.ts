import { css, html, LitElement, PropertyDeclarations } from "lit"
import { BaseMixin, baseStyle, contentSpinnerStyle, entityListItemStyle, EntityViewData, textSpinner, textSpinnerStyle } from "../../../ui"
import style from "./style"

export default class GscapeClassInstanceDetails extends BaseMixin(LitElement) {
  private _dataProperties: EntityViewData[] = []
  /** @internal */
  private _dataPropertiesValues?: Map<string, { values: Set<string>, loading?: boolean }>
  /** @internal */
  canShowDataPropertiesValues = false
  /** @internal */
  parentClasses?: EntityViewData[]
  /** @internal */
  onParentClassSelection = (iri: string) => { }

  static properties: PropertyDeclarations = {
    dataProperties: { type: Object, attribute: false },
    canShowDataPropertiesValues: { type: Boolean, attribute: false },
    parentClasses: { type: Object, attribute: false },
  }

  static notAvailableText = 'n/a'

  static styles = [ baseStyle, entityListItemStyle, style, textSpinnerStyle, contentSpinnerStyle,
    css`
      div.entity-list-item[entity-type = "data-property"] { 
        flex-wrap: wrap;
      }

      gscape-entity-list-item {
        width: fit-content;
      }
    `
  ]

  render() {
    return html`
    <div class="content-wrapper">
      ${this.parentClasses && this.parentClasses.length > 0 
        ? html`
          <div class="section">
            <div class="section-header"><span class="bold-text">Parent Classes</span> - rdf:type</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.parentClasses?.map(parentClass => {
                return html`
                  <gscape-entity-list-item
                    displayedname=${parentClass.displayedName}
                    iri=${parentClass.value.iri.fullIri}
                    type=${parentClass.value.type}
                    @click=${this.handleEntityClick}
                  >
                  </gscape-entity-list-item>
                `
              })}
            </div>
          </div>
        `
        : null
      }

      ${this.dataProperties && this.dataProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.dataProperties.map(dataProperty => {

                const values = this._dataPropertiesValues?.get(dataProperty.value.iri.fullIri)
                console.log(values)
                return html`
                  <gscape-entity-list-item
                    displayedname=${dataProperty.displayedName}
                    iri=${dataProperty.value.iri.fullIri}
                    type=${dataProperty.value.type}
                  >
                    ${this.canShowDataPropertiesValues && values
                      ? html`
                        <div slot="trailing-element">
                          ${!values.loading && values.values.size === 0 ? html`<span class="chip neutral-chip">${GscapeClassInstanceDetails.notAvailableText}</span>` : null}
                          ${Array.from(values.values).map(v => html`<span class="chip data-property-value">${v}</span>`)}
                          ${values.loading
                            ? html`<span class="chip neutral-chip">${textSpinner()}</span>`
                            : null
                          }
                        </div>
                      `
                      : null
                    }
                  </gscape-entity-list-item>
                `
              })}
            </div>
          </div>
        `
        : null
      } 
    </div>
    `
  }
  /**
  private getEntitySuggestionTemplate(entity: EntityViewData, objectPropertyIri?: string, parentClassIri?: string, direct?: boolean) {
    const values = this.dataPropertiesValues?.get(entity.value.iri.fullIri)

    return html`
      <div 
        title=${entity.displayedName}
        iri=${entity.value.iri.fullIri}
        entity-type="${entity.value.type}"
        class="ellipsed entity-list-item ${entity.value.type !== GrapholTypesEnum.DATA_PROPERTY ? 'actionable' : null }"
        @click=${(e: Event)=> this.handleEntityClick(e, objectPropertyIri, parentClassIri, direct)}
      >
        <span class="entity-icon slotted-icon">${entityIcons[entity.value.type]}</span>
        <span class="entity-name">${entity.displayedName}</span>
        ${this.canShowDataPropertiesValues && values
          ? html`
            ${!values.loading && values.values.length === 0 ? html`<span class="chip neutral-chip">${GscapeClassInstanceDetails.notAvailableText}</span>` : null}
            ${values.values.map(v => html`<span class="chip data-property-value">${v}</span>`)}
            ${values.loading
              ? html`<span class="chip neutral-chip">${textSpinner()}</span>`
              : null
            }
          `
          : null
        }
      </div>
    `
  }
  */

  private handleEntityClick(e: Event) {
    const target = e.currentTarget as HTMLElement
    const iri = target.getAttribute('iri')
    if (!iri) return
    this.onParentClassSelection(iri)
  }

  show() {
    super.show()
    this.shadowRoot?.querySelectorAll(`details`)?.forEach(detailsElement => detailsElement.open = false )
  }

  reset() {
    this.dataProperties = []
    this.canShowDataPropertiesValues = false
  }

  addDataPropertyValue(dataPropertyIri: string, value: string) {
    this._dataPropertiesValues?.get(dataPropertyIri)?.values.add(value)
    this.requestUpdate()
  }

  /** @internal */
  setDataPropertyLoading(dataPropertyIri: string, isLoading: boolean) {
    const dataPropertyValues = this._dataPropertiesValues?.get(dataPropertyIri)

    if (dataPropertyValues) {
      dataPropertyValues.loading = isLoading
      this.requestUpdate()
    }
  }

  get dataProperties() {
    return this._dataProperties
  }

  set dataProperties(newDataProperties) {
    const oldValue = this._dataProperties
    this._dataProperties = newDataProperties.sort((a,b) => a.displayedName.localeCompare(b.displayedName))
    this._dataPropertiesValues = new Map(this._dataProperties.map(dp => [dp.value.iri.fullIri, { values: new Set(), loading: true }]))
    this.requestUpdate('dataProperties', oldValue)
  }
}

customElements.define('gscape-class-instance-details', GscapeClassInstanceDetails)