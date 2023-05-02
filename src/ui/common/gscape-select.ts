import { css, html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit"
import { blankSlateDiagrams, cross, triangle_down } from "../assets/icons"
import baseStyle from '../style'
import a11yClick from "../util/a11y-click"
import getIconSlot from "../util/get-icon-slot"
import { GscapeButtonStyle, SizeEnum } from "./button"
import { GscapeActionListItem } from "./list-item"
import { BaseMixin, DropPanelMixin } from "./mixins"

export type SelectOption = {
  id: string,
  text: string,
  trailingIcon?: SVGTemplateResult,
  leadingIcon?: SVGTemplateResult,
  disabled?: boolean,
}

export default class GscapeSelect extends DropPanelMixin(BaseMixin(LitElement)) {
  private readonly PLACEHOLDER_ID = '!PLACEHOLDER!'
  defaultIcon: SVGTemplateResult
  selectedOptionId?: string
  options: SelectOption[] = []
  size: SizeEnum = SizeEnum.S

  private _placeholder: SelectOption = {
    id: this.PLACEHOLDER_ID,
    text: 'Select'
  }
  onSelection: (optionId: string) => void = () => { }
  

  static properties: PropertyDeclarations = {
    options: { type: Object },
    selectedOptionId: { type: String, attribute: 'selected-option', reflect: true },
    placeHolder: { type: Object, attribute: 'placeholder' },
    onSelection: { type: Object, attribute: 'onselection' },
    size: { type: String },
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    css`
      :host {
        position: relative;
      }

      gscape-button {
        max-width: inherit;
      }

      .option-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .option-wrapper > gscape-action-list-item {
        flex-grow: 1;
      }
    `
  ]

  render() {
    return html`
      ${this.getButton()}

      <div class="gscape-panel hide drop-down" id="drop-panel">

        <slot name="custom-element"></slot>

        ${this.options.length > 0
          ? this.options.map(option => {
            return html`
              <div class="option-wrapper">
                <gscape-action-list-item
                  @click=${this.handleSelection}
                  @keypress=${this.handleSelection}
                  label="${option.text}"
                  title="${option.text}"
                  id="${option.id}"
                  ?selected=${this.selectedOption && this.selectedOption.id === option.id}
                  ?disabled=${option.disabled !== undefined && option.disabled}
                >
                  ${option.leadingIcon ? getIconSlot('icon', option.leadingIcon) : null}
                </gscape-action-list-item>
                
                ${this.selectedOption && this.selectedOption.id === option.id
                  ? html`
                    <gscape-button title="clear" size="s" type="subtle" slot="trailing-icon" @click=${this.clear}>
                      ${getIconSlot('icon', cross)}
                    </gscape-button>
                  `
                  : null
                }
              </div>
            `})
          : html`
            <div class="blank-slate">
              ${blankSlateDiagrams}
              <div class="description">No Options</div>
            </div>
          `
        }
      </div>
    `

  }

  private handleSelection(e: Event) {
    if (a11yClick(e)) {
      const targetItem = e.currentTarget as GscapeActionListItem
      if (targetItem && !targetItem.disabled) {
        this.selectedOptionId = targetItem.id
        this.closePanel()
        this.updateComplete.then(() => this.dispatchEvent(new Event('change')))
      }
    }
  }

  private getButton() {
    const option = this.selectedOption || this.placeholder

    return html`
      <gscape-button @click="${this.togglePanel}" label="${option.text}" size="${this.size}">
        ${option.leadingIcon ? getIconSlot('icon', option.leadingIcon) : null}
        ${getIconSlot('trailing-icon', triangle_down)}
      </gscape-button>
    `
  }

  clear() {
    this.selectedOptionId = undefined
    this.closePanel()

    this.updateComplete.then(() => this.dispatchEvent(new Event('change')))
  }

  get selectedOption() {
    if (this.selectedOptionId) {
      return this.options.find(o => o.id === this.selectedOptionId)
    }
  }

  get placeholder() { return this._placeholder }

  set placeholder(placeHolder) {
    this._placeholder = placeHolder
    this._placeholder.id = this.PLACEHOLDER_ID
  }
}

customElements.define('gscape-select', GscapeSelect)