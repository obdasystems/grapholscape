import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import { classIcon, dataPropertyIcon, filter, individualIcon, objectPropertyIcon } from "../assets";
import baseStyle from "../style";
import getIconSlot from "../util/get-icon-slot";
import { IEntityFilters } from "../util/search-entities";

export default class GscapeEntitySearch extends LitElement implements IEntityFilters {
  [GrapholTypesEnum.CLASS]?: boolean = false;
  [GrapholTypesEnum.DATA_PROPERTY]?: boolean = false;
  [GrapholTypesEnum.OBJECT_PROPERTY]?: boolean = false;
  [GrapholTypesEnum.INDIVIDUAL]?: boolean = false;

  private _onSearchCallback: (e: KeyboardEvent) => void = () => { }
  private _onEntityFilterToggleCallback: () => void = () => { }

  static properties: PropertyDeclarations = {
    [GrapholTypesEnum.CLASS]: { type: Boolean, state: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Boolean, state: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Boolean, state: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Boolean, state: true }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
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
        <input @keyup=${this._onSearchCallback} type="text" placeholder="Search IRI, labels...">
        ${this.atLeastTwoFilters
        ? html`
            <gscape-button size="s" title="Show/Hide filters" @click=${this.toggleChipsFilters}>
              ${getIconSlot('icon', filter)}
            </gscape-button>
          `
        : null
      }
      </div>

      ${this.atLeastTwoFilters
        ? html`
          <div class="chips-filters hide">
            ${this.classes !== undefined
            ? html`
                <span class="chip actionable ${this.classes && !this.areAllFiltersDisabled ? null : 'disabled'}" entity-type="class" @click=${this.handleFilterStateChange} >${classIcon} Classes</span>
              `
            : null
          }

            ${this.dataProperties !== undefined
            ? html`
                <span class="chip actionable ${this.dataProperties && !this.areAllFiltersDisabled ? null : 'disabled'}" entity-type="data-property" @click=${this.handleFilterStateChange} >${dataPropertyIcon} Data Properties</span>
              `
            : null
          }

            ${this.objectProperties !== undefined
            ? html`
                <span class="chip actionable ${this.objectProperties && !this.areAllFiltersDisabled ? null : 'disabled'}" entity-type="object-property" @click=${this.handleFilterStateChange} >${objectPropertyIcon} Object Properties</span>
              `
            : null
          }

            ${this.individuals !== undefined
            ? html`
                <span class="chip actionable ${this.individuals && !this.areAllFiltersDisabled ? null : 'disabled'}" entity-type="individual" @click=${this.handleFilterStateChange} >${individualIcon} Individual</span>`
            : null
          }
          </div>
        `
        : null
      }
    `
  }

  private handleFilterStateChange(e: MouseEvent) {
    const entityType: GrapholTypesEnum = (e.target as HTMLSpanElement).getAttribute('entity-type') as GrapholTypesEnum

    if (this[entityType] !== undefined) {
      this[entityType] = !this[entityType]
      this._onEntityFilterToggleCallback()
    }
  }

  private toggleChipsFilters() {
    this.shadowRoot?.querySelector('.chips-filters')?.classList.toggle('hide')
  }

  public onSearch(callback: (e: KeyboardEvent) => void) {
    this._onSearchCallback = callback
  }

  public onEntityFilterToggle(callback: () => void) {
    this._onEntityFilterToggleCallback = callback
  }

  get areAllFiltersDisabled() {
    let result = true

    if (this.classes !== undefined) {
      result = result && !this.classes
    }

    if (this.objectProperties !== undefined) {
      result = result && !this.objectProperties
    }

    if (this.dataProperties !== undefined) {
      result = result && !this.dataProperties
    }

    if (this.individuals !== undefined) {
      result = result && !this.individuals
    }

    return result
  }

  private get classes() {
    return this[GrapholTypesEnum.CLASS]
  }

  private get objectProperties() {
    return this[GrapholTypesEnum.OBJECT_PROPERTY]
  }

  private get dataProperties() {
    return this[GrapholTypesEnum.DATA_PROPERTY]
  }

  private get individuals() {
    return this[GrapholTypesEnum.INDIVIDUAL]
  }

  private get atLeastTwoFilters() {
    let count = 0

    if (this.classes !== undefined)
      count++

    if (this.objectProperties !== undefined)
      count++

    if (this.dataProperties !== undefined)
      count++

    if (this.individuals !== undefined)
      count++

    return count >= 2
  }
}

customElements.define('gscape-entity-search', GscapeEntitySearch)