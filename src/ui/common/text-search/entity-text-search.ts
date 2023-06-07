import { css, CSSResultGroup, html, LitElement, nothing, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../../model";
import { cross, filter, search } from "../../assets";
import baseStyle from "../../style";
import getIconSlot from "../../util/get-icon-slot";
import { IEntityFilters } from "../../view-model";
import { GscapeButtonStyle } from "../button";
import { DropPanelMixin } from "../mixins";

export default class GscapeEntitySearch extends DropPanelMixin(LitElement) implements IEntityFilters {
  areAllFiltersDisabled: boolean = true;
  [GrapholTypesEnum.CLASS]?: number
  [GrapholTypesEnum.DATA_PROPERTY]?: number
  [GrapholTypesEnum.OBJECT_PROPERTY]?: number
  [GrapholTypesEnum.INDIVIDUAL]?: number
  [GrapholTypesEnum.CLASS_INSTANCE]?: number

  private isSearchTextEmpty: boolean = true
  private searchTimeout: NodeJS.Timeout

  static properties: PropertyDeclarations = {
    [GrapholTypesEnum.CLASS]: { type: Number, reflect: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    [GrapholTypesEnum.CLASS_INSTANCE]: { type: Number, reflect: true },
    isSearchTextEmpty: { type: Boolean, state: true },
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    GscapeButtonStyle,
    css`
      :host {
        display: block;
        padding: 8px;
      }

      .search-box {
        display: flex;
        align-items: stretch;
        gap: 8px;
      }

      #input-wrapper > .slotted-icon {
        position: absolute;
        left: 6px;
        top: 6px;
      }

      #input-wrapper {
        position: relative;
        flex-grow: 2;
      }

      input {
        width: 100%;
        height: 100%;
        padding-left: 32px;
      }

      #clear-btn {
        position: absolute;
        top: 3px;
        right: 4px;
      }
    `
  ]

  public render() {
    return html`
      <div class="search-box">
        <div id="input-wrapper" style="position:relative">
          <span class="slotted-icon muted-text">${search}</span>
          <input @keyup=${this.handleKeyPress} type="text" placeholder="Search IRI, labels...">
          ${!this.isSearchTextEmpty
            ? html`
              <gscape-button id="clear-btn" size="s" type="subtle" title="Clear search" @click=${this.clearSearch}>
                ${getIconSlot('icon', cross)}
              </gscape-button>
            `
            : nothing
          }
        </div>
        
        ${this.atLeastTwoFilters
          ? html`
              <gscape-button size="m" title="Show/Hide filters" @click=${this.togglePanel}>
                ${getIconSlot('icon', filter)}
              </gscape-button>
            `
          : null
        }
      </div>
      <div id="drop-panel" class="hide">
        <gscape-entity-type-filter
          class=${this[GrapholTypesEnum.CLASS] ?? nothing}
          object-property=${this[GrapholTypesEnum.OBJECT_PROPERTY] ?? nothing}
          data-property=${this[GrapholTypesEnum.DATA_PROPERTY] ?? nothing}
          individual=${this[GrapholTypesEnum.INDIVIDUAL] ?? nothing}
          class-instance=${this[GrapholTypesEnum.CLASS_INSTANCE] ?? nothing}
        ></gscape-entity-type-filter>
      </div>
      
    `
  }

  private handleKeyPress(e: KeyboardEvent) {

    const inputElement = e.currentTarget as HTMLInputElement
    if (!inputElement) return

    if (e.key === 'Escape') {
      inputElement.blur();
      inputElement.value = ''
      this.handleSearch('')
      return
    }

    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.handleSearch(inputElement.value)
    }, 500)
  }

  private async handleSearch(searchText: string) {
    await this.updateComplete
    
    this.dispatchEvent(new CustomEvent('onsearch', {
      bubbles: true,
      composed: true,
      detail: { searchText: searchText }
    }))

    this.isSearchTextEmpty = searchText.length <= 0
  }

  clearSearch() {
    if (this.input) {
      this.input.value = ''
      this.dispatchEvent(new CustomEvent('onsearch', {
        bubbles: true,
        composed: true,
        detail: { searchText: '' }
      }))

      this.isSearchTextEmpty = true
    }
  }

  private get atLeastTwoFilters() {
    let count = 0

    if (this[GrapholTypesEnum.CLASS] !== undefined)
      count++

    if (this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined)
      count++

    if (this[GrapholTypesEnum.DATA_PROPERTY] !== undefined)
      count++

    if (this[GrapholTypesEnum.INDIVIDUAL] !== undefined)
      count++

    return count >= 2
  }

  private get input() { return this.shadowRoot?.querySelector('input') }
}

export type SearchEvent = CustomEvent<{
  searchText: string
}>

customElements.define('gscape-entity-search', GscapeEntitySearch)