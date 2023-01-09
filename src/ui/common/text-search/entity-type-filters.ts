import { css, html, LitElement, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../../model";
import { classIcon, dataPropertyIcon, individualIcon, objectPropertyIcon } from "../../assets";
import baseStyle from "../../style";
import { IEntityFilters } from "../../util/search-entities";
import { GscapeButtonStyle } from "../button";
import { BaseMixin } from "../mixins";

export default class GscapeEntityTypeFilters extends BaseMixin(LitElement) implements IEntityFilters {

  static properties: PropertyDeclarations = {
    [GrapholTypesEnum.CLASS]: { type: Number, reflect: true },
    [GrapholTypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [GrapholTypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    onFilterToggle: { type: Function, reflect: true }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    css`
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
    `
  ];

  _class: number | undefined;
  _dataproperty: number | undefined;
  _objectproperty: number | undefined;
  _individual: number | undefined;

  render() {
    return html`
      <div class="chips-filters">
        ${this[GrapholTypesEnum.CLASS] !== undefined
          ? html`
              <span 
                class="chip actionable ${this[GrapholTypesEnum.CLASS] && !this.areAllFiltersDisabled ? null : 'disabled'}" 
                entity-type="class" 
                @click=${this._handleFilterStateChange}
              >
                ${classIcon} Classes
              </span>
            `
          : null
        }

        ${this[GrapholTypesEnum.DATA_PROPERTY] !== undefined
          ? html`
              <span 
                class="chip actionable ${this[GrapholTypesEnum.DATA_PROPERTY] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="data-property"
                @click=${this._handleFilterStateChange}
              >
                ${dataPropertyIcon} Data Properties
              </span>
            `
          : null
        }

        ${this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined
          ? html`
              <span 
                class="chip actionable ${this[GrapholTypesEnum.OBJECT_PROPERTY] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="object-property"
                @click=${this._handleFilterStateChange}
              >
                ${objectPropertyIcon} Object Properties
              </span>
            `
          : null
        }

        ${this[GrapholTypesEnum.INDIVIDUAL] !== undefined
          ? html`
              <span 
                class="chip actionable ${this[GrapholTypesEnum.INDIVIDUAL] && !this.areAllFiltersDisabled ? null : 'disabled'}"
                entity-type="individual"
                @click=${this._handleFilterStateChange}
              >
                ${individualIcon} Individual
              </span>`
          : null
        }
      </div>
    `
  }

  private async _handleFilterStateChange(e: MouseEvent) {
    const entityType: GrapholTypesEnum = (e.currentTarget as HTMLSpanElement).getAttribute('entity-type') as GrapholTypesEnum

    if (this[entityType] !== undefined) {
      this[entityType] = !this[entityType]
      await this.updateComplete

      this.dispatchEvent(new CustomEvent('onentityfilterchange', { 
        bubbles: true, 
        composed: true, 
        detail: {
          [GrapholTypesEnum.CLASS]: this[GrapholTypesEnum.CLASS],
          [GrapholTypesEnum.DATA_PROPERTY]: this[GrapholTypesEnum.DATA_PROPERTY],
          [GrapholTypesEnum.OBJECT_PROPERTY]: this[GrapholTypesEnum.OBJECT_PROPERTY],
          [GrapholTypesEnum.INDIVIDUAL]: this[GrapholTypesEnum.INDIVIDUAL],
          areAllFiltersDisabled: this.areAllFiltersDisabled
        } as IEntityFilters
      }))
    }
  }

  get areAllFiltersDisabled() {
    let result = true

    if (this[GrapholTypesEnum.CLASS] !== undefined) {
      result = result && !this[GrapholTypesEnum.CLASS]
    }

    if (this[GrapholTypesEnum.OBJECT_PROPERTY] !== undefined) {
      result = result && !this[GrapholTypesEnum.OBJECT_PROPERTY]
    }

    if (this[GrapholTypesEnum.DATA_PROPERTY] !== undefined) {
      result = result && !this[GrapholTypesEnum.DATA_PROPERTY]
    }

    if (this[GrapholTypesEnum.INDIVIDUAL] !== undefined) {
      result = result && !this[GrapholTypesEnum.INDIVIDUAL]
    }

    return result
  }

  set [GrapholTypesEnum.CLASS](v: number | undefined) {
    this._class = v
    this.requestUpdate()
  }
  get [GrapholTypesEnum.CLASS]() { return this._class }

  set [GrapholTypesEnum.DATA_PROPERTY](v: number | undefined) {
    this._dataproperty = v
    this.requestUpdate()
  }
  get [GrapholTypesEnum.DATA_PROPERTY]() { return this._dataproperty }

  set [GrapholTypesEnum.OBJECT_PROPERTY](v: number | undefined) {
    this._objectproperty = v
    this.requestUpdate()
  }
  get [GrapholTypesEnum.OBJECT_PROPERTY]() { return this._objectproperty }

  set [GrapholTypesEnum.INDIVIDUAL](v: number | undefined) {
    this._individual = v
    this.requestUpdate()
  }
  get [GrapholTypesEnum.INDIVIDUAL]() { return this._individual }
}

export type EntityFilterEvent = CustomEvent<IEntityFilters>

customElements.define('gscape-entity-type-filter', GscapeEntityTypeFilters)