import { CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from '../../style'
import actionItemStyle from './style'

export default class GscapeActionListItem extends LitElement {
  label: string
  selected: boolean
  private expanded = false
  subtle: boolean // do not add left selected mark
  

  static properties: PropertyDeclarations = {
    label: { type: String, reflect: true },
    subtle: { type: Boolean },
    selected: { type: Boolean },
    expanded: { state: true }
  }

  static styles?: CSSResultGroup = [baseStyle, actionItemStyle]

  constructor() {
    super()

    this.tabIndex = 0
  }

  render() {
    return html`
      <li class="list-item ${this.selected && !this.subtle ? 'selected-item' : null} ellipsed" @click=${this.clickHandler}>
        <div class="list-item actionable" @click=${this.clickHandler}>
          <slot name="icon" class="slotted-icon" ></slot>
          <span class="list-item-label" title=${this.label}>${this.label}</span>
          <slot name="trailing-icon" class="slotted-icon" ></slot>

          ${this.expanded
            ? html`<slot name="hidden-content" class="slotted-icon" ></slot>`
            : null
          }
        </div>
      </li>
    `
  }

  private clickHandler() {
    if (this.hiddenContent) {
      this.expanded = !this.expanded
    }
  }

  private get hiddenContent() { return this.querySelector('[slot = "hidden-content"]') }
}

customElements.define('gscape-action-list-item', GscapeActionListItem)