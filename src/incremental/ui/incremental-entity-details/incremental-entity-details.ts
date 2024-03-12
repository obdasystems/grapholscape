import { css, html, LitElement, PropertyDeclarations } from "lit"
import { GrapholEntity } from "../../../model"
import { BaseMixin, baseStyle, contentSpinnerStyle, entityListItemStyle, EntityViewData, textSpinnerStyle } from "../../../ui"
import style from "./style"

export default class IncrementalEntityDetails extends BaseMixin(LitElement) {
  private _dataProperties: EntityViewData[] = []

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
      ${this.dataProperties && this.dataProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.dataProperties.map(dataProperty => {
                return html`
                  <gscape-entity-list-item
                    displayedname=${dataProperty.displayedName}
                    iri=${dataProperty.value.iri.fullIri}
                    .types=${dataProperty.value.types}
                  >
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

  // private handleEntityClick(e: Event) {
  //   const target = e.currentTarget as HTMLElement
  //   const iri = target.getAttribute('iri')
  //   if (!iri) return
  //   this.onParentClassSelection(iri)
  // }

  show() {
    super.show()
    this.shadowRoot?.querySelectorAll(`details`)?.forEach(detailsElement => detailsElement.open = false )
  }

  reset() {
    this.dataProperties = []
  }

  addDataPropertyValue(dataPropertyIri: string, value: string) {
    const numericValue = Number(value)
    this.requestUpdate()
  }


  get dataProperties() {
    return this._dataProperties
  }

  set dataProperties(newDataProperties) {
    const oldValue = this._dataProperties
    this._dataProperties = newDataProperties.sort((a,b) => a.displayedName.localeCompare(b.displayedName))
    this.requestUpdate('dataProperties', oldValue)
  }
}

customElements.define('gscape-class-instance-details', IncrementalEntityDetails)