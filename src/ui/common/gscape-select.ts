import { html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit"
import { DropPanelMixin } from "./drop-panel-mixin"
import baseStyle from '../style'
import { GscapeButtonStyle } from "./button"
import { check } from "../assets/icons"
import { BaseMixin } from "./base-widget-mixin"

export type SelectOption = {
  id: string,
  text: string,
  trailingIcon?: SVGTemplateResult,
  leadingIcon?: SVGTemplateResult,
}

export default class GscapeSelect extends DropPanelMixin(BaseMixin(LitElement)) {
  defaultIcon: SVGTemplateResult
  selectedOptionId: number
  options: SelectOption[] = []
  onSelection: (optionId: string) => void = () => { }
  

  static properties: PropertyDeclarations = {
    options: { type: Object },
    selectedOptionId: { type: Number, attribute: 'selected-option', reflect: true },
    placeHolder: { type: String, attribute: 'placeholder' },
    onSelection: { type: Object, attribute: 'onselection' }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
  ]

  render() {
    return html`
      <gscape-button @click="${this.togglePanel}" label="${this.selectedOption.text}">
        ${this.selectedOption.leadingIcon}
      </gscape-button>

      <div class="gscape-panel hide" id="drop-panel">

        <slot name="custom-option-list"></slot>

        ${this.options.map(option => {
          return html`
            <gscape-action-list-item
              @click = ${this.onSelection}
              subtle
              label="${option.text}"
              id="${option.id}"
              ?selected = "${this.selectedOption.id === option.id}"
            >
              ${this.selectedOption.id === option.id
                ? html`
                  <span slot="icon">${check}</span>
                `
                : null
              }
            </gscape-action-list-item>
          `
        })}
      </div>
    `

  }


  get selectedOption() {
    if (this.selectedOptionId) {
      return this.options[this.selectedOptionId]
    } else {
      return this.options[-1] || this.options[0]
    }
  }

  set placeHolder(text: string) {
    this.options[-1] = {
      id: '!PLACEHOLDER!',
      text: text,
      leadingIcon: this.defaultIcon,
    }
  }
}

customElements.define('gscape-select', GscapeSelect)