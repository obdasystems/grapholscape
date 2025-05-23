import { css, html, LitElement, PropertyDeclarations } from "lit";
import { TypesEnum } from "../../../model";
import capitalizeFirstChar from "../../../util/capitalize-first-char";
import { entityIcons } from "../../assets";
import baseStyle from "../../style";
import { IEntityFilters } from "../../view-model";
import { GscapeButtonStyle } from "../button";
import { BaseMixin } from "../mixins";

export default class GscapeEntityTypeFilters extends BaseMixin(LitElement) implements IEntityFilters {

  static properties: PropertyDeclarations = {
    [TypesEnum.CLASS]: { type: Number, reflect: true },
    [TypesEnum.DATA_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.OBJECT_PROPERTY]: { type: Number, reflect: true },
    [TypesEnum.INDIVIDUAL]: { type: Number, reflect: true },
    onFilterToggle: { type: Function, reflect: true }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    css`
      .chips-filters {
        white-space: normal;
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

      .chip[entity-type = "class-instance"] {
        color: var(--gscape-color-class-instance-contrast);
        border-color: var(--gscape-color-class-instance-contrast);
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

  _class?: number
  _dataproperty?: number
  _objectproperty?: number
  _individual?: number
  _classInstance?: number

  render() {
    return html`
      <div class="chips-filters">
        ${this[TypesEnum.CLASS] !== undefined
          ? this.getChipTemplate(TypesEnum.CLASS)
          : null
        }

        ${this[TypesEnum.DATA_PROPERTY] !== undefined
          ? this.getChipTemplate(TypesEnum.DATA_PROPERTY)
          : null
        }

        ${this[TypesEnum.OBJECT_PROPERTY] !== undefined
          ? this.getChipTemplate(TypesEnum.OBJECT_PROPERTY)
          : null
        }

        ${this[TypesEnum.INDIVIDUAL] !== undefined
          ? this.getChipTemplate(TypesEnum.INDIVIDUAL)
          : null
        }
      </div>
    `
  }

  private getChipTemplate(type: TypesEnum) {
    const labels = type.split('-')
    labels.forEach(l => capitalizeFirstChar(l))
    const label = labels.join(' ')
    const enabled = this[type] && !this.areAllFiltersDisabled
    return html`
      <span
        title="${enabled ? 'Disable' : 'Enable'} Filter"
        class="chip actionable ${enabled ? null : 'disabled'}"
        entity-type=${type}
        @click=${this._handleFilterStateChange}
      >
        ${entityIcons[type]} ${label}
      </span>
    `
  }

  private async _handleFilterStateChange(e: MouseEvent) {
    const entityType: TypesEnum = (e.currentTarget as HTMLSpanElement).getAttribute('entity-type') as TypesEnum

    if (this[entityType] !== undefined) {
      this[entityType] = !this[entityType]
      await this.updateComplete

      this.dispatchEvent(new CustomEvent('onentityfilterchange', { 
        bubbles: true, 
        composed: true, 
        detail: {
          [TypesEnum.CLASS]: this[TypesEnum.CLASS],
          [TypesEnum.DATA_PROPERTY]: this[TypesEnum.DATA_PROPERTY],
          [TypesEnum.OBJECT_PROPERTY]: this[TypesEnum.OBJECT_PROPERTY],
          [TypesEnum.INDIVIDUAL]: this[TypesEnum.INDIVIDUAL],
          areAllFiltersDisabled: this.areAllFiltersDisabled
        } as IEntityFilters
      }))
    }
  }

  get areAllFiltersDisabled() {
    let result = true

    if (this[TypesEnum.CLASS] !== undefined) {
      result = result && !this[TypesEnum.CLASS]
    }

    if (this[TypesEnum.OBJECT_PROPERTY] !== undefined) {
      result = result && !this[TypesEnum.OBJECT_PROPERTY]
    }

    if (this[TypesEnum.DATA_PROPERTY] !== undefined) {
      result = result && !this[TypesEnum.DATA_PROPERTY]
    }

    if (this[TypesEnum.INDIVIDUAL] !== undefined) {
      result = result && !this[TypesEnum.INDIVIDUAL]
    }

    return result
  }

  set [TypesEnum.CLASS](v: number | undefined) {
    this._class = v
    this.requestUpdate()
  }
  get [TypesEnum.CLASS]() { return this._class }

  set [TypesEnum.DATA_PROPERTY](v: number | undefined) {
    this._dataproperty = v
    this.requestUpdate()
  }
  get [TypesEnum.DATA_PROPERTY]() { return this._dataproperty }

  set [TypesEnum.OBJECT_PROPERTY](v: number | undefined) {
    this._objectproperty = v
    this.requestUpdate()
  }
  get [TypesEnum.OBJECT_PROPERTY]() { return this._objectproperty }

  set [TypesEnum.INDIVIDUAL](v: number | undefined) {
    this._individual = v
    this.requestUpdate()
  }
  get [TypesEnum.INDIVIDUAL]() { return this._individual }

}

export type EntityFilterEvent = CustomEvent<IEntityFilters>

customElements.define('gscape-entity-type-filter', GscapeEntityTypeFilters)