import { css, html, LitElement, PropertyDeclarations, SVGTemplateResult } from "lit"
import { blankSlateDiagrams, triangle_down } from "../assets/icons"
import baseStyle from '../style'
import a11yClick from "../util/a11y-click"
import getIconSlot from "../util/get-icon-slot"
import { GscapeButtonStyle, SizeEnum } from "./button"
import { GscapeActionListItem } from "./list-item"
import { BaseMixin, TippyDropPanelMixin } from "./mixins"

export type SelectOption = {
  id: string,
  text: string,
  trailingIcon?: SVGTemplateResult,
  leadingIcon?: SVGTemplateResult,
  disabled?: boolean,
}

export default class GscapeSelect extends TippyDropPanelMixin(BaseMixin(LitElement), 'bottom') {
  private readonly PLACEHOLDER_ID = '!PLACEHOLDER!'
  defaultIcon: SVGTemplateResult
  defaultOptionId?: string
  private _options: SelectOption[] = []
  size: SizeEnum = SizeEnum.S
  clearable: boolean = false
  multipleSelection: boolean = false
  searchable: boolean | 'auto' = 'auto'

  private shownOptionsIds: string[] = []
  private _placeholder: SelectOption = {
    id: this.PLACEHOLDER_ID,
    text: 'Select'
  }
  private _selectedOptionsId: Set<string> = new Set()
  onSelection: (optionId: string) => void = () => { }
  
  static properties: PropertyDeclarations = {
    options: { type: Object },
    selectedOptionsId: { type: Array, reflect: true },
    defaultOptionId: { type: String, attribute: 'default-option' },
    placeholder: { type: String },
    onSelection: { type: Object, attribute: 'onselection' },
    size: { type: String },
    clearable: { type: Boolean },
    multipleSelection: { type: Boolean, attribute: 'multiple-selection' },
    shownOptionsIds: { type: Array },
    searchable: { type: Boolean }
  }

  static styles = [
    baseStyle,
    GscapeButtonStyle,
    css`
      :host {
        width: 100%;
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
    const optionsToShow = this.options.filter(o => this.shownOptionsIds.includes(o.id))
    return html`
      ${this.getButton()}

      <div class="gscape-panel hide drop-down" id="drop-panel">

        <slot name="custom-element"></slot>

        ${this.shouldAddSearchBar
          ? html`
            <gscape-entity-search
              placeholder='Search...'
              @onsearch=${(e: CustomEvent<{ searchText: string }>) => this.handleOptionSearch(e)}
            ></gscape-entity-search>
          `
          : null
        }

        ${optionsToShow.length > 0
          ? optionsToShow.map(option => {
            const selected = this.isIdSelected(option.id)
            return html`
              <div class="option-wrapper">
                <gscape-action-list-item
                  @click=${this.handleSelection}
                  @keypress=${this.handleSelection}
                  label="${option.text}"
                  title="${option.text}"
                  id="${option.id}"
                  ?selected=${selected || (this.isSelectionEmpty() && this.defaultOptionId === option.id)}
                  ?disabled=${option.disabled !== undefined && option.disabled}
                >
                  ${option.leadingIcon ? getIconSlot('icon', option.leadingIcon) : null}
                </gscape-action-list-item>
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
        if (targetItem.selected) {
          // UNSELECT
          if (this.clearable) {
            this._selectedOptionsId.delete(targetItem.id)
            this.requestUpdate()
            this.updateComplete.then(() => this.dispatchEvent(new Event('change')))
          }
        } else {
          // SELECT
          if (!this.multipleSelection) {
            this.closePanel()
            this._selectedOptionsId.clear()
          }
          this._selectedOptionsId.add(targetItem.id)
          this.requestUpdate()
          this.updateComplete.then(() => this.dispatchEvent(new Event('change')))
        }
      }
    }
  }

  private handleOptionSearch(e: CustomEvent<{ searchText: string }>)  {
    if (e.detail.searchText.length > 2) {
      this.shownOptionsIds = this.options.filter(c => {
        return c.text.toLowerCase().includes(e.detail.searchText.toLowerCase())
      }).map(o => o.id)
    } else {
      this.shownOptionsIds = this.options.map(o => o.id)
    }
  }

  private getButton() {
    const options = this.selectedOptions.length > 0 ? this.selectedOptions : [this.defaultOption]
    const icon = options.find(o => o.leadingIcon !== undefined)?.leadingIcon!
    const label = options.map(o => o.text).join(' - ')

    return html`
      <gscape-button id="select-btn" @click="${this.togglePanel}" label=${label} title=${label} size="${this.size}">
        <!-- Only set icons if selected options have all the same icon -->
        ${icon && options.every(o => !o.leadingIcon || o.leadingIcon === icon) ? getIconSlot('icon', icon) : null}
        ${getIconSlot('trailing-icon', triangle_down)}
      </gscape-button>
    `
  }

  clear() {
    this._selectedOptionsId.clear()
    this.closePanel()
    this.requestUpdate()
    this.updateComplete.then(() => this.dispatchEvent(new Event('change')))
  }

  private isSelectionEmpty() {
    return this._selectedOptionsId.size === 0
  }

  private isIdSelected(id: string) {
    return this._selectedOptionsId.has(id)
  }

  set options(newOptions: SelectOption[]) {
    this._options = newOptions
    this.shownOptionsIds = newOptions.map(o => o.id)
  }

  get options() { return this._options }

  get selectedOptions() {
    const result = this.options.filter(o => this.isIdSelected(o.id))
    if (result.length === 0 && this.defaultOption) {
      result.push(this.defaultOption)
    }

    return result
  }

  get selectedOptionsId() {
    return this.selectedOptions.map(o => o.id)
  }

  set selectedOptionsId(newSelectedOptionsId) {
    this._selectedOptionsId = new Set(newSelectedOptionsId)
  }

  get defaultOption() {
    return this.options.find(o => o.id === this.defaultOptionId) || this._placeholder
  }

  get placeholder() { return this._placeholder.text }

  set placeholder(placeHolder) {
    this._placeholder.text = placeHolder
    this.requestUpdate()
    // this._placeholder.id = this.PLACEHOLDER_ID
  }

  private get shouldAddSearchBar() { return this.searchable === true || (this.searchable === 'auto' && this.options.length > 5) }
}

customElements.define('gscape-select', GscapeSelect)