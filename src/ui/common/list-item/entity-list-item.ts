import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../../style";
import { GrapholTypesEnum } from "../../../model";
import { arrowDown, arrow_right, entityIcons } from "../../assets";
import { entityListItemStyle } from "../../ontology-explorer";

export default class GscapeEntityListItem extends LitElement {

  type: GrapholTypesEnum.CLASS |
    GrapholTypesEnum.DATA_PROPERTY |
    GrapholTypesEnum.OBJECT_PROPERTY |
    GrapholTypesEnum.CLASS_INSTANCE
    = GrapholTypesEnum.CLASS

  displayedName: string = ''
  iri: string = ''
  actionable: boolean = false
  asAccordion: boolean = false
  private isAccordionOpen = false

  static properties: PropertyDeclarations = {
    type: { type: String, reflect: true },
    displayedName: { type: String, reflect: true },
    actionable: { type: Boolean },
    asAccordion: { type: Boolean },
    isAccordionOpen: { type: Boolean, attribute: false },
    iri: { type: String, reflect: true },
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
        <details class="ellipsed entity-list-item" ?open=${this.isAccordionOpen || false}>
          <summary class="actionable" @click=${this.handleDetailsClick}>
            ${this.iconNameSlotTemplate()}
          </summary>
          <!-- body defined by consumer as slot element -->
          <slot name="accordion-body" class="summary-body"></slot>
        </details>
      `
      : html`
        <div class="ellipsed entity-list-item ${this.actionable ? 'actionable' : null}">
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
      <span class="entity-icon slotted-icon">${entityIcons[this.type]}</span>
      <span class="entity-name">${this.displayedName}</span>
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
}

customElements.define('gscape-entity-list-item', GscapeEntityListItem)