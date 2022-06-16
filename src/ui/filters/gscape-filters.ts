import { html, css, LitElement } from 'lit'
import GscapeButton from '../common/button'
import GscapeWidget from '../common/gscape-widget'
import '../common/toggle/gscape-toggle'
import { filter as filterIcon } from '../assets/icons'
import { DefaultFilterKeyEnum, Filter } from '../../model'
import getIconSlot from '../util/get-icon-slot'
import baseStyle from '../style'
import GscapeToggle from '../common/toggle/gscape-toggle'
import { DropPanelMixin } from '../common/drop-panel-mixin'

export default class GscapeFilters extends DropPanelMixin(LitElement) {
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

      gscape-toggle[first]{
        justify-content: center;
        border-bottom: 1px solid var(--gscape-color-border-subtle);
        margin-bottom: 10px;
        padding: 10px;
      }

      .filters-wrapper {
        display: flex;
        flex-direction: column;
      }

      .hr {
        margin-top: 4px;
        margin-bottom: 4px;
      }
    `,
  ]

  render() {
    return html`
      <gscape-button @click=${this.togglePanel}>
        ${getIconSlot('icon', filterIcon)}
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide">
        <div class="header">Filters</div>

        <div class="filters-wrapper">
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

  // updateTogglesState() {
  //   let toggles = this.shadowRoot.querySelectorAll(`gscape-toggle`)
  //   let is_activated = false

  //   toggles.forEach(toggle => {
  //     toggle.state = this.filterList[toggle.key].active
  //     toggle.disabled = this.filterList[toggle.key].disabled
  //     if (toggle.state)
  //       is_activated = true
  //   })

  //   this.btn.highlighted = is_activated
  //   this.btn.requestUpdate()
  // }

  // show() {
  //   if (this.isEnabled) this.style.display = 'inline-block'
  // }
}



customElements.define('gscape-filters', GscapeFilters)