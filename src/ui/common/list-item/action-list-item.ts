import { CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";
import baseStyle from '../../style'
import actionItemStyle from './style'

export default class GscapeActionListItem extends LitElement {
  label: string
  selected: boolean
  private expanded = false
  

  static properties: PropertyDeclarations = {
    label: { type: String, reflect: true },
    selectable: { type: Boolean },
    selected: { type: Boolean },
    expanded: { state: true }
  }

  static styles?: CSSResultGroup = [baseStyle, actionItemStyle]

  render() {
    return html`
      <li class="list-item ${this.selected ? 'selected-item' : null}" @click=${this.clickHandler}>
        <div class="list-item actionable" @click=${this.clickHandler}>
          <slot name="icon"></slot>
          <span>${this.label}</span>
          <slot name="trailing-icon"></slot>

          ${this.expanded
            ? html`<slot name="hidden-content"></slot>`
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