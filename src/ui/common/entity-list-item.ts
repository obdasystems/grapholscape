import { html, LitElement, PropertyDeclarations } from "lit";
import { GrapholTypesEnum } from "../../model";
import { entityIcons } from "../assets";

export default class GscapeEntityListItem extends LitElement {

  type: GrapholTypesEnum.CLASS | 
        GrapholTypesEnum.DATA_PROPERTY | 
        GrapholTypesEnum.OBJECT_PROPERTY | 
        GrapholTypesEnum.CLASS_INSTANCE 
    = GrapholTypesEnum.CLASS

  displayedName: string = ''
  iri: string = ''
  actionable: boolean = true
  asAccordion: boolean = false

  static properties: PropertyDeclarations = {
    type: { type: String, reflect: true },
    label: { type: String, reflect: true },
    actionable: { type: Boolean },
    asAccordion: { type: Boolean, attribute: 'asaccordion' },
  }

  render() {
    return html`
      ${this.asAccordion
        ? html`
          <details class="ellipsed entity-list-item">
            <summary class="actionable">
              ${this.iconNameSlotTemplate}
              <!--
              ${!op.direct
                ? html`<span class="chip" style="line-height: 1">Inverse</span>`
                : null
              }
              -->
            </summary>
            <!-- body defined by consumer as slot element -->
            <slot name="accordion-body"></slot>
          </details>
        `
        : html`
          <div class="ellipsed entity-list-item ${this.actionable ? 'actionable' : null }">
            ${this.iconNameSlotTemplate}
          </div>
        `
      }
    `
  }

  private get iconNameSlotTemplate() {
    return html`
      <div @click=${this.onclick}>
        <span class="entity-icon slotted-icon">${entityIcons[this.type]}</span>
        <span class="entity-name">${this.displayedName}</span>
        <slot name="trailing-element"></slot>
      </div>
    `
  }

  private handleEntityClick() {
    throw new Error("Method not implemented.");
  }

}

customElements.define('gscape-entity-list-item', GscapeEntityListItem)