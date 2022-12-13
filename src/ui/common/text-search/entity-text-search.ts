import { css, CSSResultGroup, html, LitElement, nothing, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../../model";
import { filter } from "../../assets";
import baseStyle from "../../style";
import getIconSlot from "../../util/get-icon-slot";
import { IEntityFilters } from "../../util/search-entities";
import { GscapeButtonStyle } from "../button";
import { DropPanelMixin } from "../drop-panel-mixin";
import GscapeEntityTypeFilters from "./entity-type-filters";

export default class GscapeEntitySearch extends DropPanelMixin(LitElement) implements IEntityFilters {
  areAllFiltersDisabled: boolean = true;
  [GrapholTypesEnum.CLASS]?: number | undefined = 0;
  [GrapholTypesEnum.DATA_PROPERTY]?: number | undefined = 0;
  [GrapholTypesEnum.OBJECT_PROPERTY]?: number | undefined = 0;
  [GrapholTypesEnum.INDIVIDUAL]?: number | undefined = 0;

  public onSearch: (e: KeyboardEvent) => void = (e) => console.log(e)
  public onEntityFilterToggle: () => void = ( ) => console.log('filter-toggled')

  static properties: PropertyDeclarations = {
    [GrapholTypesEnum.CLASS]: { type: Number, reflect: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Number, reflect: true }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    GscapeButtonStyle,
    css`
      :host {
        display: block;
        padding: 8px;
      }

      .chips-filters {
        margin-top: 4px;
        white-space: normal;
        min-width: 295px;
      }

      .chip[entity-type = "class"] {
        color: var(--gscape-color-class-contrast);
        border-color: var(--gscape-color-class-contrast);
      }

      .chip[entity-type = "data-property"] {
        color: var(--gscape-color-data-property-contrast);
        border-color: var(--gscape-color-data-property-contrast);
      }

      .chip[entity-type = "object-property"] {
        color: var(--gscape-color-object-property-contrast);
        border-color: var(--gscape-color-object-property-contrast);
      }

      .chip[entity-type = "individual"] {
        color: var(--gscape-color-individual-contrast);
        border-color: var(--gscape-color-individual-contrast);
      }

      .chip {
        line-height: 0;
        gap: 4px;
        align-items: center;
        background: inherit;
      }

      .chip.disabled {
        opacity: 0.4;
      }

      .chip:hover {
        opacity: 1;
      }

      .chip.disabled:hover {
        opacity: 0.4;
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      input {
        width: unset;
        flex-grow: 2;
      }
    `
  ]

  public render() {
    return html`
      <div class="search-box">
        <input @keyup=${this.handleSearch} type="text" placeholder="Search IRI, labels...">
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
        ></gscape-entity-type-filter>
      </div>
      
    `
  }

  private async handleSearch(e: KeyboardEvent) {
    const inputElement = e.currentTarget as HTMLInputElement
    if (!inputElement) return

    if (e.key === 'Escape') {
      inputElement.blur();
      inputElement.value = ''
    }

    await this.updateComplete
    
    this.dispatchEvent(new CustomEvent('onsearch', {
      bubbles: true,
      composed: true,
      detail: { searchText: inputElement.value }
    }))
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
}

export type SearchEvent = CustomEvent<{
  searchText: string
}>

customElements.define('gscape-entity-search', GscapeEntitySearch)