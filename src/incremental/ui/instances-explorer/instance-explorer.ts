import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit"
import { GrapholTypesEnum } from "../../../model"
import { BaseMixin, baseStyle, contentSpinnerStyle, EntityViewData, getContentSpinner, GscapeEntityListItem, GscapeSelect, SizeEnum, textSpinner, textSpinnerStyle } from "../../../ui"
import { entityIcons, insertInGraph, search, searchOff } from "../../../ui/assets"
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin"
import getIconSlot from "../../../ui/util/get-icon-slot"
import { ClassInstance } from "../../api/kg-api"
import menuBaseStyle from "../menu-base-style"


export default class GscapeInstanceExplorer extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef?: HTMLElement

  areInstancesLoading: boolean
  instances: Map<string, ClassInstance> = new Map()
  searchFilterList: EntityViewData[] = []
  classTypeFilterList?: EntityViewData[]
  referenceEntity?: EntityViewData
  referencePropertyEntity?: EntityViewData
  isPropertyDirect: boolean = true
  instancesInProcess: Map<string, boolean> = new Map()
  requestId?:string
  numberOfPagesShown = 1
  canShowMore: boolean = false

  private searchTimeout:  NodeJS.Timeout

  static properties: PropertyDeclarations = {
    areInstancesLoading: { type: Boolean },
    instances: { type: Object },
    referenceEntity: { type: Object },
    searchFilterList: { type: Object },
    referencePropertyEntity: { type: Object },
    classTypeFilterList: { type: Object },
    canShowMore: { type: Boolean },
  }

  static styles: CSSResultGroup = [
    baseStyle,
    menuBaseStyle,
    contentSpinnerStyle,
    textSpinnerStyle,
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

      #show-more-btn, #loading-content-spinner {
        align-self: center;
        margin: 8px;
      }

      #loading-content-spinner {
        position: relative;
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
              >
                ${!this.isPropertyDirect
                  ? html`
                    <span slot="trailing-element" class="chip" style="line-height: 1">Inverse</span>
                  `
                  : null
                }
              </gscape-entity-list-item>
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
        
        <div class="entity-list">
        ${this.instances.size > 0
          ? html`
            ${Array.from(this.instances).map(([_, instance]) => html`
              <gscape-entity-list-item
                displayedname=${instance.label || instance.shortIri || instance.iri}
                iri=${instance.iri}
                type=${GrapholTypesEnum.CLASS_INSTANCE}
              >
                ${this.instancesInProcess.get(instance.iri)
                  ? html`<div slot="trailing-element">${textSpinner()}</div>`
                  : html `
                    <div slot="trailing-element" class="hover-btn">
                      <gscape-button
                        size="s"
                        type="subtle"
                        @click=${this.handleInsertInGraph}
                      >
                        ${getIconSlot('icon', insertInGraph)}
                      </gscape-button>
                    </div>
                  `
                }
                </div>
              </gscape-entity-list-item>
            `)}
          `
          : !this.areInstancesLoading ? html`
              <div class="blank-slate">
                ${searchOff}
                <div class="header">No Instances Available</div>
              </div>
            `
            : null
        }

        ${this.areInstancesLoading 
          ? html`<div id="loading-content-spinner">${getContentSpinner()}</div>` 
          : this.canShowMore
            ? html`
              <gscape-button id="show-more-btn" size="s" label="Show More" type="subtle" @click=${this.handleShowMore}></gscape-button>
            `
            : this.numberOfPagesShown > 1 ? html`<span style="align-self: center; margin: 8px 8px 16px" class="bold-text muted-text">No more data</span>` : null
        }
        </div>
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

    this.numberOfPagesShown = 1
    this.dispatchEvent(event)
  }

  private handleInputKeypress(e: KeyboardEvent) {
    const inputElement = e.target as HTMLInputElement
    // on ESC key press
    if (e.key === 'Escape') {
      inputElement.blur()
      inputElement.value = ''
    }

    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.handleFilter()
    }, 500)
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

  private async handleInsertInGraph(e: MouseEvent) {
    const targetListItem = (e.currentTarget as HTMLElement).parentElement?.parentElement as GscapeEntityListItem | null

    if (targetListItem) {
      const instance = this.instances.get(targetListItem.iri)

      if (instance) {
        let parentClassIris: string[] | string
  
        if (this.referenceEntity?.value.type === GrapholTypesEnum.CLASS) { // if class, take class iri as parent
          parentClassIris = this.referenceEntity?.value.iri.fullIri
        } else if (this.referenceEntity?.value.type === GrapholTypesEnum.CLASS_INSTANCE) { // otherwise check selected filter type

          if (this.classTypeFilterList?.length === 1) { 
            parentClassIris = this.classTypeFilterList[0].value.iri.fullIri // if only one type, take it as parent class
          } else if (this.classTypeFilterSelect?.selectedOptionId) {
            parentClassIris = this.classTypeFilterSelect.selectedOptionId // otherwise take the selected one
          } else if (this.classTypeFilterList) {
            parentClassIris = this.classTypeFilterList.map(e => e.value.iri.fullIri) // if no option is selected, take them all, instance checking will decide
          } else
            return
        } else {
          return
        }

        this.instancesInProcess.set(instance?.iri, true)
        this.requestUpdate()
        await this.updateComplete

        this.dispatchEvent(new CustomEvent('instanceselection', { 
          bubbles: true, 
          composed: true, 
          detail: {
            parentClassIris: parentClassIris,
            instance: instance
          }
        }) as InstanceSelectionEvent)
      }
    }
  }

  private handleShowMore(e: Event) {
    this.dispatchEvent(new CustomEvent('showmoreinstances', {
      bubbles: true,
      composed: true
    }))
    this.numberOfPagesShown += 1
  }

  addInstances(newInstances: ClassInstance[]) {
    newInstances.forEach(i => {
      if (!this.instances.has(i.iri)) {
        this.instances.set(i.iri, i)
      }
    })
    this.requestUpdate()
  }

  setInstanceAsProcessed(instanceIri: string) {
    this.instancesInProcess.delete(instanceIri)
    this.requestUpdate()
  }

  clear() {
    this.instances = new Map()
    this.numberOfPagesShown = 1
    this.areInstancesLoading = false
    this.searchFilterList = []
    this.classTypeFilterList = []
    this.referenceEntity = undefined
    this.referencePropertyEntity = undefined
    this.popperRef = undefined
    this.instancesInProcess.clear()

    if (this.instancesSearchInput)
      this.instancesSearchInput.value = ''
  }

  updated() {
    if (this.popperRef)
      this.attachTo(this.popperRef)
  }

  attachTo(element: HTMLElement): void {
    this.popperRef = element
    super.attachTo(element)
  }

  private get propertyFilterSelect() { return this.shadowRoot?.querySelector('#property-filter-select') as GscapeSelect | undefined }
  private get classTypeFilterSelect() { return this.shadowRoot?.querySelector('#classtype-filter-select') as GscapeSelect | undefined }
  private get instancesSearchInput() { return this.shadowRoot?.querySelector('#instances-search') as HTMLInputElement | undefined }
}

export type InstanceSelectionEvent = CustomEvent<{
  parentClassIris: string[] | string,
  instance: ClassInstance
}>

export type InstanceFilterEvent = CustomEvent<{
  filterText: string,
  filterByProperty: string | undefined,
  filterByType: string | undefined,
}>

customElements.define('gscape-instances-explorer', GscapeInstanceExplorer)