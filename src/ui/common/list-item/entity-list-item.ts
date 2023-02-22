import { CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from "../../style";
import { GrapholTypesEnum } from "../../../model";
import { entityIcons } from "../../assets";
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

  static properties: PropertyDeclarations = {
    type: { type: String, reflect: true },
    displayedName: { type: String, reflect: true },
    actionable: { type: Boolean },
    asAccordion: { type: Boolean },
  }

  static styles: CSSResultGroup = [
    entityListItemStyle,
    baseStyle    
  ]

  render() {
    return this.asAccordion
      ? html`
          <details class="ellipsed entity-list-item">
            <summary class="actionable">
              ${this.iconNameSlotTemplate}
            </summary>
            <!-- body defined by consumer as slot element -->
            <slot name="accordion-body"></slot>
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
      <span class="entity-icon slotted-icon">${entityIcons[this.type]}</span>
      <span class="entity-name">${this.displayedName}</span>
      <slot name="trailing-element"></slot>
    `
  }

  private handleEntityClick() {
    throw new Error("Method not implemented.");
  }

}

customElements.define('gscape-entity-list-item', GscapeEntityListItem)