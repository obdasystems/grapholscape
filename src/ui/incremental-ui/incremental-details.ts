
import { html, LitElement, nothing, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import { classIcon, entityIcons, instancesIcon, objectPropertyIcon } from "../assets";
import { BaseMixin } from "../common/base-widget-mixin";
import { contentSpinnerStyle, getContentSpinner, textSpinner, textSpinnerStyle } from "../common/spinners";
import { entityListItemStyle } from "../ontology-explorer";
import baseStyle from "../style";
import { EntityViewData } from "../util/search-entities";
import incrementalDetailsStyle from "./style";

export interface IIncrementalDetails {
  // callbacks
  onObjectPropertySelection: (iri: string, objectPropertyIri: string, direct: boolean) => void
  onGetInstances: () => void
  onInstanceSelection: (iri: string) => void
  onEntitySearch: (searchText: string) => void
  onEntitySearchByDataPropertyValue: (dataPropertyIri: string, searchText: string) => void
  onInstanceObjectPropertySelection: (instanceIri: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) => void

  // populate the menu
  setObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  addObjectProperties: (objectProperties: ViewIncrementalObjectProperty[]) => void
  setDataProperties: (dataProperties: EntityViewData[]) => void
  addDataProperties: (dataProperties: EntityViewData[]) => void

  // data properties values
  setDataPropertiesValues: (dataPropertiesValues: Map<string, { values: string[]; loading?: boolean | undefined; }>) => void
  addDataPropertiesValues: (dataPropertyIri: string, values: string[]) => void
  setDataPropertyLoading: (dataPropertyIri: string, isLoading: boolean) => void

  // Object properties range instances
  setObjectPropertyRanges: (objectPropertyRanges: Map<string, Map<string, { values: EntityViewData[], loading?: boolean }>>) => void
  setObjectPropertyLoading: (objectPropertyIri: string, rangeClassIri: string, isLoading: boolean) => void
  addObjectPropertyRangeInstances: (objectPropertyIri: string, rangeClassIri: string, classInstances: EntityViewData[]) => void
  onGetRangeInstances: (objectPropertyIri: string, rangeClassIri: string) => void

  /** remove current instances and add the new ones */
  setInstances: (instances: EntityViewData[]) => void
  /** append new instances to the existing ones */
  addInstances: (instances: EntityViewData[]) => void

  onLimitChange: (limitValue: number) => void

  reset: () => void

  canShowInstances: boolean
  canShowDataPropertiesValues: boolean
  canShowObjectPropertiesRanges: boolean
  isInstanceCounterLoading: boolean
  areInstancesLoading: boolean
  instanceCount: number
}

export type ViewIncrementalObjectProperty = {
  objectProperty: EntityViewData,
  connectedClasses: EntityViewData[],
  loading?:boolean,
  direct: boolean
}

export default class GscapeIncrementalDetails extends BaseMixin(LitElement) implements IIncrementalDetails {
  dataProperties?: EntityViewData[]
  dataPropertiesValues?: Map<string, { values: string[], loading?: boolean }>
  objectProperties?: ViewIncrementalObjectProperty[]
  objectPropertiesRanges?: Map<string, Map<string, { values: EntityViewData[], loading?: boolean } >>
  private instances?: EntityViewData[]
  private limit: number = 10
  canShowInstances = false
  canShowDataPropertiesValues = false
  canShowObjectPropertiesRanges = false
  isInstanceCounterLoading = true
  areInstancesLoading = true
  instanceCount: number

  onObjectPropertySelection = (iri: string, objectPropertyIri: string, direct: boolean) => { }
  onGetInstances = () => { }
  onInstanceSelection = (iri: string) => { }
  onDataPropertyToggle = (enabled: boolean) => { }
  onEntitySearch = (searchText: string) => { }
  onEntitySearchByDataPropertyValue = (dataPropertyIri: string, searchText: string) => { }
  onGetRangeInstances = (objectPropertyIri: string, rangeClassIri: string) => { }
  onInstanceObjectPropertySelection = (instanceIri: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) => { }
  onLimitChange = (limitValue: number) => { }

  private searchTimeout: NodeJS.Timeout

  static properties: PropertyDeclarations = {
    dataProperties: { type: Object, attribute: false },
    objectProperties: { type: Object, attribute: false },
    instances: { type: Array, attribute: false },
    canShowInstances: { type: Boolean, attribute: false },
    canShowDataPropertiesValues: { type: Boolean, attribute: false },
    isInstanceCounterLoading: { type: Boolean, attribute: false },
    areInstancesLoading: { type: Boolean, attribute: false },
    instanceCount: { type: Number, attribute: false },
    limit: { type: Number, attribute: false },
    // dataPropertiesValues: {type: Object, attribute: false },
    // objectPropertiesRanges: {type: Object, attribute: false },
  }

  static styles = [ baseStyle, entityListItemStyle, incrementalDetailsStyle, textSpinnerStyle, contentSpinnerStyle ]

  render() {
    return html`
    <div class="content-wrapper">      
      ${this.canShowInstances
        ? html`
        <details class="ellipsed entity-list-item" title="Instances" style="position:relative" @click=${this.handleShowInstances}>
          <summary class="actionable">
            <span class="entity-icon slotted-icon">${instancesIcon}</span>
            <span class="entity-name">Instances</span>
            <span class="neutral-chip chip counter">
              ${this.isInstanceCounterLoading || this.instanceCount === undefined
                ? textSpinner()
                : this.instanceCount
              }
            </span>
          </summary>
      
          <div class="summary-body">
            <div class="search-box">
              <select id="data-property-filter">
                <option default>Filter</option>
                ${this.dataProperties?.map(dp => html`<option value=${dp.value.iri.fullIri}>${dp.displayedName}</option>`)}
              </select>
              <input id="instances-search" @keyup=${this.handleSearch} type="text" placeholder="Search instances by IRI, labels ..." />
            </div>

            ${this.instances?.map(instance => this.getEntitySuggestionTemplate(instance))}
            ${this.areInstancesLoading ? getContentSpinner() : null }
          </div>
        </details>
        `
        : null
      }

      ${this.dataProperties && this.dataProperties.length > 0
        ? html`
          <div class="section">
            <div class="section-header bold-text">Data Properties</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.dataProperties?.map(dataProperty => this.getEntitySuggestionTemplate(dataProperty))}
            </div>
          </div>
        `
        : null
      }

      ${this.objectProperties && this.objectProperties.length > 0
        ? html`
            <div class="section">
              <div class="section-header bold-text">Object Properties</div>
              <div class="section-body" style="padding: 0">
                ${this.objectProperties?.map((op) => {
                  return html`
                    <details class="ellipsed entity-list-item" title=${op.objectProperty.displayedName}>
                      <summary class="actionable">
                        <span class="entity-icon slotted-icon">${objectPropertyIcon}</span>
                        <span class="entity-name">${op.objectProperty.displayedName}</span>
                        ${!op.direct
                          ? html`<span class="chip" style="line-height: 1">Inverse</span>`
                          : null
                        }
                      </summary>
                  
                      <div class="summary-body" ?isDirect=${op.direct}>
                        ${op.connectedClasses.map(classEntity => {
                          if (this.canShowObjectPropertiesRanges) {
                            const rangeClassesInstances = this.objectPropertiesRanges
                              ?.get(op.objectProperty.value.iri.fullIri)
                              ?.get(classEntity.value.iri.fullIri)

                            if (rangeClassesInstances) {
                              return html`
                                <details class="ellipsed entity-list-item" title="${classEntity.displayedName}"
                                  objectPropertyIri=${op.objectProperty.value.iri.fullIri}
                                  rangeClassIri=${classEntity.value.iri.fullIri}
                                  @click=${this.handleShowObjectPropertyRanges}
                                >
                                  <summary class="actionable">
                                    <span class="entity-icon slotted-icon">${classIcon}</span>
                                    <span class="entity-name">${classEntity.displayedName}</span>
                                  </summary>

                                  <div class="summary-body">
                                    ${rangeClassesInstances.values.map(instance => this.getEntitySuggestionTemplate(instance, 
                                      op.objectProperty.value.iri.fullIri,
                                      classEntity.value.iri.fullIri,
                                      op.direct
                                    ))}
                                    ${rangeClassesInstances.loading ? getContentSpinner() : null}
                                  </div>
                                </details>
                              `
                            }
                          } else {
                            return this.getEntitySuggestionTemplate(classEntity, op.objectProperty.value.iri.fullIri, undefined, op.direct)
                          }
                        })}
                      </div>
                    </details>
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

  private handleSearch(e: KeyboardEvent) {
    const inputElement = e.target as HTMLInputElement
    clearTimeout(this.searchTimeout)

    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur()
      inputElement.value = ''
    }

    this.searchTimeout = setTimeout(() => {
      const dataPropertyFilterElem = this.dataPropertyFilter
      if (dataPropertyFilterElem && dataPropertyFilterElem.options.selectedIndex !== 0) {
        const dataPropertyIri = dataPropertyFilterElem.options[dataPropertyFilterElem.options.selectedIndex].value
        this.onEntitySearchByDataPropertyValue(dataPropertyIri, inputElement.value)
      } else {
        this.onEntitySearch(inputElement.value)
      }
      
    }, 500)
  }

  private handleShowInstances(evt: MouseEvent) {
    const target = evt.currentTarget as HTMLDetailsElement
    if (!target.open && (!this.instances || this.instances.length === 0)) {
      this.onGetInstances()
    }
  }

  private handleShowObjectPropertyRanges(evt: MouseEvent) {
    const target = evt.currentTarget as HTMLDetailsElement
    const objectPropertyIri = target.getAttribute('objectPropertyIri')
    const rangeClassIri = target.getAttribute('rangeClassIri')


    if (objectPropertyIri && rangeClassIri && !target.open) {
      const actualRangeInstances = this.objectPropertiesRanges?.get(objectPropertyIri)?.get(rangeClassIri)
      if (!actualRangeInstances || actualRangeInstances.values.length === 0)
        this.onGetRangeInstances(objectPropertyIri, rangeClassIri)
    }
  }

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

  private handleEntityClick(e: Event, objectPropertyIri?: string, parentClassIri?: string, direct = true) {
    const target = e.currentTarget as HTMLElement
    const iri = target.getAttribute('iri')
    if (!iri) return

    switch(target.getAttribute('entity-type')) {
      case GrapholTypesEnum.CLASS:
        if (objectPropertyIri) {
          this.onObjectPropertySelection(iri, objectPropertyIri, direct)
        }
        break
      
      case GrapholTypesEnum.CLASS_INSTANCE:
        if (objectPropertyIri) {
          if (parentClassIri) // nested needed
            this.onInstanceObjectPropertySelection(iri, objectPropertyIri, parentClassIri, direct)
        } else {
          this.onInstanceSelection(iri)
        }
    }
  }

  // protected get cxtMenuProps() {
  //   let cxtMenuProps = super.cxtMenuProps
  //   cxtMenuProps.placement = 'right'
  //   return cxtMenuProps
  // }

  setDataProperties(dataProperties: EntityViewData[]) { this.dataProperties = dataProperties }
  addDataProperties(dataProperties: EntityViewData[]) {
    this.dataProperties = (this.dataProperties || []).concat(dataProperties)
  }
  setObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) { this.objectProperties = objectProperties }
  addObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) {
    this.objectProperties = (this.objectProperties || []).concat(objectProperties)
  }
  setInstances(instances: EntityViewData[]) {
    this.instances = instances
  }
  addInstances(instances: EntityViewData[]) {
    // concat avoiding duplicates
    this.instances = [...new Set([...(this.instances || []),...instances])]
  }

  setDataPropertiesValues(dataPropertiesValues: Map<string, { values: string[]; loading?: boolean | undefined; }>) {
    this.dataPropertiesValues = dataPropertiesValues
  }

  addDataPropertiesValues(dataPropertyIri: string, values: string[]) {
    if (!this.dataPropertiesValues)
      return

    const dataPropertyValues = this.dataPropertiesValues.get(dataPropertyIri)
    if (dataPropertyValues) {
      dataPropertyValues.values = values
      this.requestUpdate()
    }
  }

  setDataPropertyLoading(dataPropertyIri: string, isLoading: boolean) {
    const dataPropertiesValues = this.dataPropertiesValues?.get(dataPropertyIri)

    if (dataPropertiesValues) {
      dataPropertiesValues.loading = isLoading
      this.requestUpdate()
    }
  }

  // ---- OBJECT PROPERTIES RANGES ----
  setObjectPropertyRanges(objectPropertyRanges: Map<string, Map<string, { values: EntityViewData[]; loading?: boolean | undefined; }>>) {
    this.objectPropertiesRanges = objectPropertyRanges
  }

  setObjectPropertyLoading(objectPropertyIri: string, rangeClassIri: string, isLoading: boolean) {
    const objectPropertyRanges = this.objectPropertiesRanges?.get(objectPropertyIri)?.get(rangeClassIri)

    if (objectPropertyRanges) {
      objectPropertyRanges.loading = isLoading
      this.requestUpdate()
    }
  }

  addObjectPropertyRangeInstances(objectPropertyIri: string, rangeClassIri: string, classInstances: EntityViewData[]) {
    const objectPropertyRanges = this.objectPropertiesRanges?.get(objectPropertyIri)?.get(rangeClassIri)

    if (objectPropertyRanges) {
      objectPropertyRanges.values = classInstances
      this.requestUpdate()
    }
  }

  show() {
    super.show()
    this.shadowRoot?.querySelectorAll(`details`)?.forEach(detailsElement => detailsElement.open = false )
  }

  reset() {
    this.dataProperties = undefined
    this.objectProperties = undefined
    this.canShowInstances = false
    this.canShowDataPropertiesValues = false
    this.canShowObjectPropertiesRanges = false
    this.dataPropertiesValues = undefined
    this.objectPropertiesRanges = undefined
  }

  private get dataPropertyFilter() { 
    if (this.shadowRoot)
      return this.shadowRoot.querySelector(`select#data-property-filter`) as HTMLSelectElement 
  }
}

customElements.define('gscape-incremental-menu', GscapeIncrementalDetails)