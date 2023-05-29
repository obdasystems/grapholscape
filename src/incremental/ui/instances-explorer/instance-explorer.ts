import { css, CSSResultGroup, html, LitElement, nothing, PropertyDeclarations } from "lit"
import { GrapholTypesEnum } from "../../../model"
import { BaseMixin, baseStyle, contentSpinnerStyle, EntityViewData, getContentSpinner, GscapeEntityListItem, GscapeSelect, SizeEnum, textSpinnerStyle } from "../../../ui"
import { entityIcons, insertInGraph, search, searchOff } from "../../../ui/assets"
import { ContextualWidgetMixin } from "../../../ui/common/mixins/contextual-widget-mixin"
import getIconSlot from "../../../ui/util/get-icon-slot"
import { ClassInstance } from "../../api/kg-api"
import menuBaseStyle from "../menu-base-style"
import { EntityViewDataUnfolding, ViewObjectPropertyUnfolding } from "../../../ui/view-model"

export type ClassInstanceViewData = ClassInstance & { connectedInstance?: ClassInstance }

export default class GscapeInstanceExplorer extends ContextualWidgetMixin(BaseMixin(LitElement)) {
  popperRef?: HTMLElement

  areInstancesLoading: boolean
  instances: Map<string, ClassInstanceViewData> = new Map()
  propertiesFilterList: EntityViewDataUnfolding[] = []
  classTypeFilterList?: EntityViewDataUnfolding[]
  referenceEntity?: EntityViewData
  referencePropertyEntity?: EntityViewData
  isPropertyDirect: boolean = true
  requestId?:string
  numberOfPagesShown = 1
  numberResultsAvailable: number = 0
  /**
   * Not all received instances are shown, no duplicates allowed.
   * i.e. different results for different labels but same instance.
   */
  numberOfInstancesReceived = 0
  shouldAskForLabels?: boolean

  private searchTimeout:  NodeJS.Timeout

  private explanation = `
  Number of available results: it's the maximum number of results you can see in the list below. \n\
  It can be lower than the total number of possible results due to manual filters or due to
  labels, if labels are available, we will show you results with label.
  You can find instances without a label by manually searching selecting the ID filter option.
  `
  private lastSearchedText = ''

  static properties: PropertyDeclarations = {
    areInstancesLoading: { type: Boolean },
    instances: { type: Object },
    referenceEntity: { type: Object },
    searchFilterList: { type: Object },
    referencePropertyEntity: { type: Object },
    classTypeFilterList: { type: Object },
    canShowMore: { type: Boolean },
    lastSearchedText: { type: String, state: true }
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

      .search-match {
        background: var(--gscape-color-bg-inset);
        border-radius: var(--gscape-border-radius);
        padding: 4px 8px;
        font-size: 90%;
        width: fit-content;
      }

      .search-match > .highlight {
        background: var(--gscape-color-accent-muted);
        padding: 0 1px;
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
                      id: entity.entityViewData.value.iri.fullIri,
                      text: entity.entityViewData.displayedName,
                      leadingIcon: entityIcons[entity.entityViewData.value.type],
                      disabled: !entity.hasUnfolding
                    }
                  })}
                  .placeholder=${ {text: 'Filter by type'} }
                  ?multiple-selection=${true}
                  ?clearable=${true}
                  @change=${this.handleClassTypeFilterChange}
                >
              `
              : html`
                <gscape-entity-list-item
                  displayedname=${this.classTypeFilterList[0].entityViewData.displayedName}
                  iri=${this.classTypeFilterList[0].entityViewData.value.iri.fullIri}
                  type=${this.classTypeFilterList[0].entityViewData.value.type}
                ></gscape-entity-list-item>
              `
            : null
          }

          ${this.propertiesFilterList
            ? html`
              <gscape-select
                id="property-filter-select"
                size=${SizeEnum.S}
                .options=${[
                  {
                    id: 'label',
                    text: 'Label',
                    disabled: this.shouldAskForLabels === false, // if undefined then allow for it
                    leadingIcon: undefined,
                  },
                  {
                    id: 'id',
                    text: 'ID',
                    disabled: false,
                    leadingIcon: undefined,
                  },
                ].concat(this.propertiesFilterList.map(entity => {
                  return {
                    id: entity.entityViewData.value.iri.fullIri,
                    text: entity.entityViewData.displayedName,
                    leadingIcon: entityIcons[entity.entityViewData.value.type],
                    disabled: !entity.hasUnfolding
                  }
                }))}
                default-option=${this.shouldAskForLabels !== false ? 'label' : 'id'}
                ?clearable=${false}
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

        ${this.numberResultsAvailable
          ? html`
            <div style="align-self: center; display: flex; align-items: center; gap: 8px">
              <span class="chip-neutral">
                ${this.numberOfInstancesReceived}/${this.numberResultsAvailable}
              </span>
              <span class="tip" style="width: 12px; text-align: center" title=${this.explanation}>?</span>
            </div>
          `
          : null
        }

        <div class="entity-list">
        ${this.instances.size > 0
          ? html`
            ${Array.from(this.instances).map(([_, instance]) => {
              let displayedName = instance.label?.value || instance.shortIri || instance.iri
              let searchMatch: { preString: string; highlightString: string | undefined; postString: string | undefined } | undefined
              if (instance.searchMatch && instance.searchMatch.toLowerCase() !== displayedName.toLowerCase()) {
                searchMatch = this.getHighlightInSearchMatch(instance.searchMatch)
              }
              
              return html`
                <gscape-entity-list-item
                  displayedname=${displayedName}
                  iri=${instance.connectedInstance ? `${instance.iri}-${instance.connectedInstance.iri}` : instance.iri}
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
                  ${searchMatch
                    ? html`
                      <div slot="subrow-item" class="search-match muted-text">${searchMatch.preString ?  html`<span>${searchMatch.preString}</span>` : nothing}${searchMatch.highlightString ? html`<span class="highlight">${searchMatch.highlightString}</span>` : nothing}${searchMatch.postString ?  html`<span>${searchMatch.postString}</span>` : nothing}</div>
                    `
                    : null
                  }
                </gscape-entity-list-item>
              `}
            )}
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
        filterText: inputElement.value.length > 0 ? inputElement.value : undefined,
        filterByProperty: undefined,
        filterByType: undefined,
      }
    }) as InstanceFilterEvent

    if (this.propertyFilterSelect) {
      const selectedOption = Array.from(this.propertyFilterSelect.selectedOptionsId)[0]

      if (selectedOption && selectedOption !== 'id' && selectedOption !== 'label' && event.detail.filterText) {
        event.detail.filterByProperty = selectedOption
        const property = this.propertiesFilterList.find(p => {
          return this.propertyFilterSelect?.selectedOptionsId &&
            p.entityViewData.value.iri.equals(selectedOption)
        })
  
        if (property) {
          event.detail.propertyType = property.entityViewData.value.type as GrapholTypesEnum.DATA_PROPERTY | GrapholTypesEnum.OBJECT_PROPERTY
  
          if (property.entityViewData.value.type === GrapholTypesEnum.OBJECT_PROPERTY) {
            event.detail.direct = (property as ViewObjectPropertyUnfolding).direct
          }
        }
      }
    }

    // if only one class type, then use it, there is not select element
    if (this.classTypeFilterList?.length === 1) {
      event.detail.filterByType = [this.classTypeFilterList[0].entityViewData.value.iri.fullIri]
    } else if (this.classTypeFilterSelect && this.classTypeFilterSelect.selectedOptionsId.size > 0) { // otherwise check selected option
      event.detail.filterByType = Array.from(this.classTypeFilterSelect.selectedOptionsId)
    }

    if (this.shouldAskForLabels !== undefined)
      event.detail.shouldAskForLabels = this.shouldAskForLabels && this.propertyFilterSelect?.selectedOptionsId[0] !== 'id'

    if (this.propertyFilterSelect?.selectedOptionsId[0] === 'id') {
      event.detail.shouldAskForLabels = false
    }

    this.lastSearchedText = event.detail.filterText || ''

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
    if (!this.classTypeFilterSelect?.selectedOptionsId) {
      this.propertiesFilterList = []
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
            parentClassIris = this.classTypeFilterList[0].entityViewData.value.iri.fullIri // if only one type, take it as parent class
          } else if (this.classTypeFilterSelect?.selectedOptionsId) {
            parentClassIris = Array.from(this.classTypeFilterSelect.selectedOptionsId) // otherwise take the selected one
          } else if (this.classTypeFilterList) {
            parentClassIris = this.classTypeFilterList.map(e => e.entityViewData.value.iri.fullIri) // if no option is selected, take them all, instance checking will decide
          } else
            return
        } else {
          return
        }

        let filterByPropertyIri: string | undefined

        if (this.propertyFilterSelect) {
          const selectedOption = Array.from(this.propertyFilterSelect.selectedOptionsId)[0]
    
          if (selectedOption && selectedOption !== 'id' && selectedOption !== 'label' && this.instancesSearchInput?.value)
            filterByPropertyIri = selectedOption
        }

        this.requestUpdate()
        await this.updateComplete

        this.dispatchEvent(new CustomEvent('instanceselection', { 
          bubbles: true, 
          composed: true, 
          detail: {
            parentClassIris: parentClassIris,
            instance: instance,
            filterByProperty: filterByPropertyIri,
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

  addInstances(newInstances: ClassInstanceViewData[]) {
    this.numberOfInstancesReceived += newInstances.length
    newInstances.forEach(i => {
      const instanceKey = i.connectedInstance ? `${i.iri}-${i.connectedInstance.iri}` : i.iri
      if (!this.instances.has(instanceKey)) {
        this.instances.set(instanceKey, i)
      }
    })
    this.requestUpdate()
  }

  clear() {
    this.instances = new Map()
    this.numberOfPagesShown = 1
    this.numberOfInstancesReceived = 0
    this.areInstancesLoading = false
    this.propertiesFilterList = []
    this.propertyFilterSelect?.clear()
    this.classTypeFilterList = []
    this.classTypeFilterSelect?.clear()
    this.referenceEntity = undefined
    this.referencePropertyEntity = undefined
    this.popperRef = undefined
    this.shouldAskForLabels = undefined
    this.numberResultsAvailable = 0
    this.lastSearchedText = ''

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

  getHighlightInSearchMatch(searchMatch: string) {
    if (this.lastSearchedText.length > 0 && this.lastSearchedText !== ' ') {
      const startMatchIndex = searchMatch.toLowerCase().search(this.lastSearchedText.toLowerCase())
      if (startMatchIndex >= 0) {
        const endMatchIndex = startMatchIndex + this.lastSearchedText.length - 1
        return {
          preString: searchMatch.substring(0, startMatchIndex),
          highlightString: searchMatch.substring(startMatchIndex, endMatchIndex + 1),
          postString: searchMatch.substring(endMatchIndex + 1, searchMatch.length),
        }
      }
    }

    return {
      preString: searchMatch,
      highlightString: undefined,
      postString: undefined,
    }
  }

  private get canShowMore() {
    if (!this.numberResultsAvailable)
      return this.numberOfInstancesReceived > 0

    return this.numberOfInstancesReceived < this.numberResultsAvailable
  }

  private get propertyFilterSelect() { return this.shadowRoot?.querySelector('#property-filter-select') as GscapeSelect | undefined }
  private get classTypeFilterSelect() { return this.shadowRoot?.querySelector('#classtype-filter-select') as GscapeSelect | undefined }
  private get instancesSearchInput() { return this.shadowRoot?.querySelector('#instances-search') as HTMLInputElement | undefined }

  hide(): void {
    this.style.display = 'none'
  }

}

export type InstanceSelectionEvent = CustomEvent<{
  parentClassIris: string[] | string,
  instance: ClassInstanceViewData,
  filterByProperty: string | undefined
}>

export type InstanceFilterEvent = CustomEvent<{
  filterText: string,
  filterByProperty: string | undefined,
  propertyType: GrapholTypesEnum.DATA_PROPERTY | GrapholTypesEnum.OBJECT_PROPERTY,
  direct: boolean,
  filterByType: string[] | undefined,
  shouldAskForLabels: boolean,
}>

customElements.define('gscape-instances-explorer', GscapeInstanceExplorer)