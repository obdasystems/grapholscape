import { css, html, LitElement } from 'lit'
import { DefaultFilterKeyEnum, Filter } from '../../model'
import { filter as filterIcon } from '../assets/icons'
import { BaseMixin, DropPanelMixin, TippyDropPanelMixin } from '../common/mixins'
import '../common/toggle/gscape-toggle'
import GscapeToggle from '../common/toggle/gscape-toggle'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import getIconSlot from '../util/get-icon-slot'

export default class GscapeFilters extends TippyDropPanelMixin(BaseMixin(LitElement), 'left') {
  title = "Filters"
  filters: Map<string, Filter>
  filterAll: Filter = new Filter('all', () => false)
  onFilterOn: (filter: Filter) => void = () => { }
  onFilterOff: (filter: Filter) => void = () => { }
  onFilterAll: () => void = () => { }
  onUnfilterAll: () => void = () => { }

  static properties = {
    filters: { type: Object, attribute: false }
  }

  static styles = [
    baseStyle,
    css`
      :host {
        order: 3;
        display:inline-block;
        position: initial;
        margin-top:10px;
      }

      gscape-toggle {
        padding: 8px;
      }

      gscape-toggle[key ="all"] {
        margin: 0 auto;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
      }

      .hr {
        margin-top: 4px;
        margin-bottom: 4px;
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      <gscape-button type="subtle" @click=${this.togglePanel}>
        ${getIconSlot('icon', filterIcon)}
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>

        <div class="content-wrapper">
          ${this.filterToggleTemplate(this.filterAll, false)}
          <div class="hr"></div>
          ${Array.from(this.filters).map(([_, filter]) => this.filterToggleTemplate(filter))}
        </div>
      </div>
    `
  }

  private filterToggleTemplate(filter: Filter, reverseState = true) {
    return html`
      <gscape-toggle
        class="${!filter.locked ? 'actionable' : null}"
        @click = ${!filter.locked ? this.toggleFilter : null}
        key = ${filter.key}
        label = ${this.getFilterLabel(filter.key)}
        ?disabled = ${filter.locked}
        ?checked = ${reverseState ? !filter.active : filter.active}
      ></gscape-toggle>
    `
  }

  private getFilterLabel(filterKey: string) {
    let result = Object.keys(DefaultFilterKeyEnum)
      .find(key => DefaultFilterKeyEnum[key] === filterKey)
      ?.toLowerCase()
      .replace('_', ' ')

    if (!result) return ''

    result = result?.charAt(0).toUpperCase() + result?.substring(1)
    return result
  }

  private toggleFilter(e) {
    e.preventDefault()
    const toggle: GscapeToggle = e.target
    const filter = this.filters.get(toggle.key)

    if (!filter) {
      if (toggle.key === this.filterAll.key) {
        this.filterAll.active ? this.onUnfilterAll() : this.onFilterAll()
      }
      return
    }
    this.filters.get(toggle.key)?.active ? this.onFilterOff(filter) : this.onFilterOn(filter)
  }
}

customElements.define('gscape-filters', GscapeFilters)