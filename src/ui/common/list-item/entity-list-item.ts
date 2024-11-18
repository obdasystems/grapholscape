import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../../style";
import { arrowDown, arrow_right, entityIcons } from "../../assets";
import entityListItemStyle from "./entity-list-item-style";
import GscapeIconList from "../imgs-horizontal-list";
import { TypesEnum } from "../../../model";

GscapeIconList

export default class GscapeEntityListItem extends LitElement {

  private _types: TypesEnum[] = []
  private _color?: string

  displayedName: string = ''
  iri: string = ''
  actionable: boolean = false
  asAccordion: boolean = false
  disabled: boolean = false
  isAccordionOpen = false

  static properties: PropertyDeclarations = {
    types: { type: Array, reflect: true },
    displayedName: { type: String, reflect: true },
    actionable: { type: Boolean },
    asAccordion: { type: Boolean },
    disabled: { type: Boolean },
    isAccordionOpen: { type: Boolean },
    iri: { type: String, reflect: true },
    color: { type: String, reflect: true },
  }

  static styles: CSSResultGroup = [
    entityListItemStyle,
    baseStyle,
    css`
      :host {
        display: block;
      }
    `
  ]

  render() {
    return this.asAccordion
      ? html`
        <details title=${this.displayedName} class="ellipsed entity-list-item" style="overflow: inherit" ?open=${this.isAccordionOpen || false} ?disabled=${this.disabled}>
          <summary class="actionable" @click=${this.handleDetailsClick}>
            ${this.iconNameSlotTemplate()}
          </summary>
          <!-- body defined by consumer as slot element -->
          <slot name="accordion-body" class="summary-body"></slot>
        </details>
      `
      : html`
        <div title=${this.displayedName} class="ellipsed background-propagation entity-list-item ${this.actionable ? 'actionable' : null}" ?disabled=${this.disabled}>
          ${this.iconNameSlotTemplate()}
        </div>
      `
  }

  private iconNameSlotTemplate() {
    return html`
      ${this.asAccordion
        ? html`
          <span class="slotted-icon">
            ${this.isAccordionOpen
              ? html`${arrowDown}`
              : html`${arrow_right}`
            }
          </span>
        `
        : null
      }

      ${this._types.length > 0
        ? html`
          <span class="entity-icon slotted-icon">
            <gscape-icon-list .icons=${this._types.map(t => entityIcons[t])}></gscape-icon-list>
          </span>
        `
        : null
      }

      ${this.color
        ? html`
          <span class="color-dot"></span>
        `
        : null
      }
      
      <div style="display: flex; flex-direction: column; flex-grow: 2; gap: 4px">
        <span class="entity-name rtl"><bdo dir="ltr">${this.displayedName}</bdo></span>
        <slot name="subrow-item"></slot>
      </div>
      <slot name="trailing-element"></slot>
    `
  }

  private handleDetailsClick(e: MouseEvent) {
    e.preventDefault()
    this.isAccordionOpen = !this.isAccordionOpen
    this.requestUpdate()
  }

  openAccordion() {
    if (this.asAccordion)
      this.isAccordionOpen = true
  }

  closeAccordion() {
    if (this.asAccordion)
      this.isAccordionOpen = false
  }

  set types(newTypes: TypesEnum[] | undefined) {
    this._types = newTypes || []
  }

  get types() {
    return this._types
  }

  set color(newColor: string | undefined) {
    this._color = newColor

    this.style.setProperty('--entity-color', newColor || null)

    this.requestUpdate()
  }

  get color() { return this._color }
}

customElements.define('gscape-entity-list-item', GscapeEntityListItem)