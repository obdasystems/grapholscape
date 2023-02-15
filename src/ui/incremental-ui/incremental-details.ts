
import { css, html, LitElement, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import { classIcon, entityIcons, instancesIcon, objectPropertyIcon, searchOff } from "../assets";
import { BaseMixin } from "../common/mixins";
import { contentSpinnerStyle, getContentSpinner, textSpinner, textSpinnerStyle } from "../common/spinners";
import { entityListItemStyle } from "../ontology-explorer";
import baseStyle from "../style";
import { EntityViewData } from "../util/search-entities";
import incrementalDetailsStyle from "./style";
import { IIncrementalDetails, ViewIncrementalObjectProperty } from "./view-model";

export default class GscapeIncrementalDetails extends BaseMixin(LitElement) implements IIncrementalDetails {
  dataProperties?: EntityViewData[]
  /** @internal */
  dataPropertiesValues?: Map<string, { values: string[], loading?: boolean }>
  objectProperties?: ViewIncrementalObjectProperty[]
  /** @internal */
  objectPropertiesRanges?: Map<string, Map<string, { values: EntityViewData[], loading?: boolean } >>
  /** @internal */
  private instances?: EntityViewData[]
  /** @internal */
  canShowInstances = false
  /** @internal */
  canShowDataPropertiesValues = false
  /** @internal */
  canShowObjectPropertiesRanges = false
  /** @internal */
  isInstanceCounterLoading = true
  /** @internal */
  areInstancesLoading = true
  /** @internal */
  instanceCount: number
  /** @internal */
  parentClasses?: EntityViewData[]

  /** @internal */
  onObjectPropertySelection = (iri: string, objectPropertyIri: string, direct: boolean) => { }
  /** @internal */
  onGetInstances = () => { }
  /** @internal */
  onInstanceSelection = (iri: string) => { }
  /** @internal */
  onEntitySearch = (searchText: string) => { }
  /** @internal */
  onEntitySearchByDataPropertyValue = (dataPropertyIri: string, searchText: string) => { }
  /** @internal */
  onGetRangeInstances = (objectPropertyIri: string, rangeClassIri: string) => { }
  /** @internal */
  onInstanceObjectPropertySelection = (instanceIri: string, objectPropertyIri: string, parentClassIri: string, direct: boolean) => { }
  /** @internal */
  onLimitChange = (limitValue: number) => { }
  /** @internal */
  onParentClassSelection = (iri: string) => { }

  /** @internal */
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
    parentClasses: { type: Object, attribute: false },
    // dataPropertiesValues: {type: Object, attribute: false },
    // objectPropertiesRanges: {type: Object, attribute: false },
  }

  static notAvailableText = 'n/a'

  static styles = [ baseStyle, entityListItemStyle, incrementalDetailsStyle, textSpinnerStyle, contentSpinnerStyle,
    css`
      div.entity-list-item[entity-type = "data-property"] { 
        flex-wrap: wrap;
      }
    `
  ]

  render() {
    return html`
    <div class="content-wrapper">      
      ${this.canShowInstances
        ? html`
        <details class="ellipsed entity-list-item" title="Instances" style="position:relative" @click=${this.handleShowInstances}>
          <summary class="actionable">
            <span class="entity-icon slotted-icon">${instancesIcon}</span>
            <span class="entity-name">Instances</span>
              ${this.isInstanceCounterLoading
                ? html`<span class="neutral-chip chip counter">${textSpinner()}</span>`
                : html`<span class="neutral-chip chip counter">${this.instanceCount ?? GscapeIncrementalDetails.notAvailableText}</span>`
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
            ${this.areInstancesLoading 
              ? getContentSpinner() 
              : html`${!this.instances || this.instances.length === 0 ? this.emptyInstancesBlankSlate : null }`
            }
          </div>
        </details>
        `
        : null
      }

      ${this.parentClasses && this.parentClasses.length > 0 
        ? html`
          <div class="section">
            <div class="section-header"><span class="bold-text">Parent Classes</span> - rdf:type</div>
            <div class="section-body" style="padding-left: 0px; padding-right: 0px">
              ${this.parentClasses?.map(parentClass => this.getEntitySuggestionTemplate(parentClass))}
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
                                    ${rangeClassesInstances.loading 
                                      ? getContentSpinner() 
                                      : html`${rangeClassesInstances.values.length === 0 ? this.emptyInstancesBlankSlate : null}`}
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

  /** @internal */
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

  /** @internal */
  private handleShowInstances(evt: MouseEvent) {
    const target = evt.currentTarget as HTMLDetailsElement
    if (!target.open && (!this.instances || this.instances.length === 0)) {
      this.onGetInstances()
    }
  }

  /** @internal */
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
            ${!values.loading && values.values.length === 0 ? html`<span class="chip neutral-chip">${GscapeIncrementalDetails.notAvailableText}</span>` : null}
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
        } else {
          this.onParentClassSelection(iri)
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

  setDataProperties(dataProperties: EntityViewData[]) { 
    this.dataProperties = dataProperties.sort((a,b) => a.displayedName.localeCompare(b.displayedName))
  }
  addDataProperties(dataProperties: EntityViewData[]) {
    this.dataProperties = (this.dataProperties || []).concat(dataProperties)
  }
  setObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) { 
    objectProperties.forEach(op => op.connectedClasses.sort((a,b) => a.displayedName.localeCompare(b.displayedName)))
    this.objectProperties = objectProperties.sort((a,b) => a.objectProperty.displayedName.localeCompare(b.objectProperty.displayedName))
  }
  addObjectProperties(objectProperties: ViewIncrementalObjectProperty[]) {
    this.objectProperties = (this.objectProperties || []).concat(objectProperties)
  }

  /** @internal */
  setInstances(instances: EntityViewData[]) {
    this.instances = instances
  }
  /** @internal */
  addInstances(instances: EntityViewData[]) {
    // concat avoiding duplicates
    this.instances = [...new Set([...(this.instances || []),...instances])]
  }

  /** @internal */
  setDataPropertiesValues(dataPropertiesValues: Map<string, { values: string[]; loading?: boolean | undefined; }>) {
    this.dataPropertiesValues = dataPropertiesValues
  }

  /** @internal */
  addDataPropertiesValues(dataPropertyIri: string, values: string[]) {
    if (!this.dataPropertiesValues)
      return

    const dataPropertyValues = this.dataPropertiesValues.get(dataPropertyIri)
    if (dataPropertyValues) {
      dataPropertyValues.values = values
      this.requestUpdate()
    }
  }

  /** @internal */
  setDataPropertyLoading(dataPropertyIri: string, isLoading: boolean) {
    const dataPropertiesValues = this.dataPropertiesValues?.get(dataPropertyIri)

    if (dataPropertiesValues) {
      dataPropertiesValues.loading = isLoading
      this.requestUpdate()
    }
  }

  // ---- OBJECT PROPERTIES RANGES ----
  /** @internal */
  setObjectPropertyRanges(objectPropertyRanges: Map<string, Map<string, { values: EntityViewData[]; loading?: boolean | undefined; }>>) {
    this.objectPropertiesRanges = objectPropertyRanges
  }

  /** @internal */
  setObjectPropertyLoading(objectPropertyIri: string, rangeClassIri: string, isLoading: boolean) {
    const objectPropertyRanges = this.objectPropertiesRanges?.get(objectPropertyIri)?.get(rangeClassIri)

    if (objectPropertyRanges) {
      objectPropertyRanges.loading = isLoading
      this.requestUpdate()
    }
  }

  /** @internal */
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

  /** @internal */
  private get dataPropertyFilter() { 
    if (this.shadowRoot)
      return this.shadowRoot.querySelector(`select#data-property-filter`) as HTMLSelectElement 
  }

  private get emptyInstancesBlankSlate() {
    return html`
      <div class="blank-slate">
        ${searchOff}
        <div class="header">No Instances Available</div>
      </div>
    `
  }
}

customElements.define('gscape-incremental-menu', GscapeIncrementalDetails)