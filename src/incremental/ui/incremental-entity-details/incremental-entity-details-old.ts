import { css, html, LitElement, PropertyDeclarations } from "lit"
import { BaseMixin, baseStyle, contentSpinnerStyle, entityListItemStyle, EntityViewData, getIconSlot, SizeEnum, textSpinner, textSpinnerStyle } from "../../../ui"
import style from "./style"
import { Count } from "../../old-controller"
import { counter } from "../../../ui/assets"
import { GrapholEntity } from "../../../model"

export default class IncrementalEntityDetails extends BaseMixin(LitElement) {
  private _dataProperties: EntityViewData[] = []
  /** @internal */
  dataPropertiesValues?: Map<string, { values: Set<string>, loading?: boolean }>
  /** @internal */
  canShowDataPropertiesValues = false
  /** @internal */
  parentClasses?: EntityViewData[]
  /** @internal */
  onParentClassSelection = (iri: string) => { }
  
  instancesCount?: Count = undefined
  instancesCountLoading: boolean = false
  allowComputeCount: boolean = false
  entity?: GrapholEntity
  onComputeCount = (entity: GrapholEntity) => { }

  static properties: PropertyDeclarations = {
    dataProperties: { type: Object, attribute: false },
    canShowDataPropertiesValues: { type: Boolean, attribute: false },
    parentClasses: { type: Object, attribute: false },
    instancesCount: { type: Object, attribute: false },
    instancesCountLoading: { type: Boolean, attribute: false },
    allowComputeCount: { type: Boolean, attribute: false },
    entity: { type: Object, attribute: false },
  }

  static notAvailableText = 'n/a'

  static styles = [ baseStyle, entityListItemStyle, style, textSpinnerStyle, contentSpinnerStyle,
    css`
      gscape-entity-list-item {
        --custom-wrap: wrap;
      }

      .count-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 8px;
      }
    `
  ]

  render() {
    return html`
    <div id="main-wrapper">
      ${this.allowComputeCount
        ? html`
          <div class="count-wrapper">
            <gscape-button
              size=${SizeEnum.S}
              label=${!this.instancesCountLoading && !this.instancesCount ? `Count Instances` : null}
              title="Count instances"
              @click=${() => this.entity ? this.onComputeCount(this.entity) : null}
            >
              ${getIconSlot('icon', counter)}
            </gscape-button>

            ${this.instancesCountLoading
              ? html`<center><div class="chip neutral-chip">Count: ${textSpinner()}</div></center>`
              : this.instancesCount !== undefined
                ? html`
                  <center>
                    <div
                      class="chip ${this.instancesCount.materialized ? 'neutral-chip' : null}"
                      title=${this.instancesCount.date 
                        ? `Date: ${this.instancesCount.date}`
                        : !this.instancesCount.materialized ? 'Fresh Value' : null
                      } 
                    >
                      Count: ${this.instancesCount.value}
                    </div>
                  </center>`
                : null
            }
          </div>
        `
        : null
      }

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
                    .types=${parentClass.value.types}
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

                const values = this.dataPropertiesValues?.get(dataProperty.value.iri.fullIri)
                return html`
                  <gscape-entity-list-item
                    displayedname=${dataProperty.displayedName}
                    iri=${dataProperty.value.iri.fullIri}
                    .types=${dataProperty.value.types}
                  >
                    ${this.canShowDataPropertiesValues && values
                      ? html`
                        <div slot="trailing-element">
                          ${!values.loading && values.values.size === 0 ? html`<span class="chip neutral-chip">${IncrementalEntityDetails.notAvailableText}</span>` : null}
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
    const numericValue = Number(value)
    this.dataPropertiesValues?.get(dataPropertyIri)?.values.add(
      isNaN(numericValue)
        ? value
        : new Intl.NumberFormat(navigator.language).format(numericValue)
    )
    this.requestUpdate()
  }

  /** @internal */
  setDataPropertyLoading(dataPropertyIri: string, isLoading: boolean) {
    const dataPropertyValues = this.dataPropertiesValues?.get(dataPropertyIri)

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
    this.dataPropertiesValues = new Map(this._dataProperties.map(dp => [dp.value.iri.fullIri, { values: new Set(), loading: true }]))
    this.requestUpdate('dataProperties', oldValue)
  }
}

customElements.define('gscape-class-instance-details', IncrementalEntityDetails)