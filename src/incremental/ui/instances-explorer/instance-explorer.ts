import { css, CSSResultGroup, html, LitElement, nothing, PropertyDeclarations } from "lit"
import { GrapholTypesEnum } from "../../../model"
import { BaseMixin, baseStyle, contentSpinnerStyle, EntityViewData, getContentSpinner, GscapeEntityListItem, GscapeSelect, SizeEnum } from "../../../ui"
import { entityIcons, insertInGraph, searchOff, search } from "../../../ui/assets"
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin"
import a11yClick from "../../../ui/util/a11y-click"
import getIconSlot from "../../../ui/util/get-icon-slot"
import { ClassInstance } from "../../api/kg-api"
import menuBaseStyle from "../menu-base-style"


export default class GscapeInstanceExplorer extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef?: HTMLElement

  areInstancesLoading: boolean
  instances: ClassInstance[] = []
  searchFilterList: EntityViewData[] = []
  classTypeFilterList?: EntityViewData[]
  referenceEntity?: EntityViewData
  referencePropertyEntity?: EntityViewData
  isPropertyDirect: boolean = true

  private searchTimeout:  NodeJS.Timeout

  static properties: PropertyDeclarations = {
    areInstancesLoading: { type: Boolean },
    instances: { type: Object },
    referenceEntity: { type: Object },
    searchFilterList: { type: Object },
    referencePropertyEntity: { type: Object },
    classTypeFilterList: { type: Object },
  }

  static styles: CSSResultGroup = [
    baseStyle,
    menuBaseStyle,
    contentSpinnerStyle,
    css`
      :host {
        min-height: 450px;
      }

      .search-box, .header {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    
      .search-box > select {
        max-width: 30%;
        padding: 8px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        border-right: none;
        min-width: 100px;
      }
    
      .search-box > input {
        flex-shrink: 0;
        min-width: 0px;
        flex-grow: 2;
      }

      gscape-select {
        max-width: 180px;
      }
    `
  ]

  constructor() {
    super()

    this.cxtWidgetProps.placement = 'right'
    this.tippyWidget.setProps({ maxWidth: '' })
  }

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">
          
          <gscape-entity-list-item
            displayedname=${this.referenceEntity?.displayedName}
            iri=${this.referenceEntity?.value.iri.fullIri}
            type=${this.referenceEntity?.value.type}
          ></gscape-entity-list-item>

          ${this.referencePropertyEntity
            ? html`
              <gscape-entity-list-item
                displayedname=${this.referencePropertyEntity?.displayedName}
                iri=${this.referencePropertyEntity?.value.iri.fullIri}
                type=${this.referencePropertyEntity?.value.type}
              ></gscape-entity-list-item>
            `
            : null
          }
        </div>
        <div class="search-box">
          ${this.classTypeFilterList && this.classTypeFilterList.length > 0
            ? this.classTypeFilterList.length > 1
              ? html`
                <gscape-select
                  style="align-self: center"
                  id="classtype-filter-select"
                  size=${SizeEnum.S}
                  .options=${this.classTypeFilterList.map(entity => {
                    return {
                      id: entity.value.iri.fullIri,
                      text: entity.displayedName,
                      leadingIcon: entityIcons[entity.value.type]
                    }
                  })}
                  .placeholder=${ {text: 'Filter by type'} }
                  @change=${this.handleClassTypeFilterChange}
                >
              `
              : html`
                <gscape-entity-list-item
                  displayedname=${this.classTypeFilterList[0].displayedName}
                  iri=${this.classTypeFilterList[0].value.iri.fullIri}
                  type=${this.classTypeFilterList[0].value.type}
                ></gscape-entity-list-item>
              `
            : null
          }

          ${this.searchFilterList
            ? html`
              <!-- <select id="data-property-filter">
                <option default>Filter</option>
                ${this.searchFilterList?.map(dp => html`<option value=${dp.value.iri.fullIri}>${dp.displayedName}</option>`)}
              </select> -->

              <gscape-select
                id="property-filter-select"
                size=${SizeEnum.S}
                .options=${this.searchFilterList.map(entity => {
                  return {
                    id: entity.value.iri.fullIri,
                    text: entity.displayedName,
                    leadingIcon: entityIcons[entity.value.type]
                  }
                })}
                .placeholder=${ {text: 'ID or Label'} }
                @change=${this.handleFilterChange}
              >
            `
            : null
          }
          <input id="instances-search" @keyup=${this.handleInputKeypress} type="text" placeholder="Filter instances" />
          <gscape-button
            title="Search"
            @click=${this.handleFilter}
          >
            ${getIconSlot('icon', search)}
          </gscape-button>
        </div>

        ${this.instances.length > 0
          ? html`
            <div class="entity-list">
            ${this.instances.map(instance => html`
              <gscape-entity-list-item
                displayedname=${instance.label || instance.shortIri || instance.iri}
                iri=${instance.iri}
                type=${GrapholTypesEnum.CLASS_INSTANCE}
              >
                <div slot="trailing-element" class="hover-btn">
                  <gscape-button
                    size="s"
                    type="subtle"
                    @click=${this.handleInsertInGraph}
                  >
                    ${getIconSlot('icon', insertInGraph)}
                  </gscape-button>
                </div>
              </gscape-entity-list-item>
            `)}
            </div>
          `
          : !this.areInstancesLoading ? html`
              <div class="blank-slate">
                ${searchOff}
                <div class="header">No Instances Available</div>
              </div>
            `
            : null
        }

        ${this.areInstancesLoading ? html`<div style="margin: 16px auto 12px;">${getContentSpinner()}</div>` : null}
      </div>
    `
  }

  private handleFilter(e?: Event) {
    const inputElement = this.instancesSearchInput
    if (!inputElement) return

    const event = new CustomEvent('instances-filter', {
      bubbles: true,
      composed: true,
      detail: {
        filterText: inputElement.value,
        filterByProperty: undefined,
        filterByType: undefined,
      }
    }) as InstanceFilterEvent

    if (this.propertyFilterSelect?.selectedOptionId) {
      event.detail.filterByProperty = this.propertyFilterSelect.selectedOptionId
    }

    // if only one class type, then use it, there is not select element
    if (this.classTypeFilterList?.length === 1) {
      event.detail.filterByType = this.classTypeFilterList[0].value.iri.fullIri
    } else if (this.classTypeFilterSelect) { // otherwise check selected option
      event.detail.filterByType = this.classTypeFilterSelect.selectedOptionId
    }

    this.dispatchEvent(event)
  }

  private handleInputKeypress(e: KeyboardEvent) {
    const inputElement = e.target as HTMLInputElement
    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur()
      inputElement.value = ''
    }

    if (a11yClick(e)) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.handleFilter()
      }, 500)
    }
  }

  private handleFilterChange() {
    (this.shadowRoot?.querySelector('#instances-search') as HTMLInputElement)?.focus()
  }

  private handleClassTypeFilterChange(e: Event) {
    if (!this.classTypeFilterSelect?.selectedOptionId) {
      this.searchFilterList = []
    }

    this.handleFilter(e)
  }

  private handleInsertInGraph(e: MouseEvent) {
    const targetListItem = (e.currentTarget as HTMLElement).parentElement?.parentElement as GscapeEntityListItem | null

    if (targetListItem) {
      let parentClassIris: string[] = []
      if (this.referenceEntity?.value.type === GrapholTypesEnum.CLASS) {
        parentClassIris.push(this.referenceEntity?.value.iri.fullIri)
      }

      else if (this.referenceEntity?.value.type === GrapholTypesEnum.CLASS_INSTANCE) {
        if (this.classTypeFilterList?.length === 1) {
          parentClassIris.push(this.classTypeFilterList[0].value.iri.fullIri)
        } else if (this.classTypeFilterSelect?.selectedOptionId) {
          parentClassIris.push(this.classTypeFilterSelect.selectedOptionId)
        }
      }

      this.dispatchEvent(new CustomEvent('instanceselection', { 
        bubbles: true, 
        composed: true, 
        detail: {
          parentClassIris: parentClassIris,
          instance: this.instances.find(i => i.iri === targetListItem.iri)
        }
      }) as InstanceSelectionEvent)

      
    }
  }

  clear() {
    this.instances = []
    this.areInstancesLoading = false
    this.searchFilterList = []
    this.classTypeFilterList = []
    this.referenceEntity = undefined
    this.referencePropertyEntity = undefined
    this.popperRef = undefined

    if (this.instancesSearchInput)
      this.instancesSearchInput.value = ''
  }

  updated() {
    if (this.popperRef)
      this.attachTo(this.popperRef)
  }

  private get propertyFilterSelect() { return this.shadowRoot?.querySelector('#property-filter-select') as GscapeSelect | undefined }
  private get classTypeFilterSelect() { return this.shadowRoot?.querySelector('#classtype-filter-select') as GscapeSelect | undefined }
  private get instancesSearchInput() { return this.shadowRoot?.querySelector('#instances-search') as HTMLInputElement | undefined }
}

export type InstanceSelectionEvent = CustomEvent<{
  parentClassIris: string[],
  instance: ClassInstance
}>

export type InstanceFilterEvent = CustomEvent<{
  filterText: string,
  filterByProperty: string | undefined,
  filterByType: string | undefined,
}>

customElements.define('gscape-instances-explorer', GscapeInstanceExplorer)