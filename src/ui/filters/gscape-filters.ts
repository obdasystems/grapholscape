import { html, css, LitElement } from 'lit'
import GscapeButton from '../common/button'
import GscapeWidget from '../common/gscape-widget'
import GscapeToggle from '../common/gscape-toggle'
import { filter as filterIcon } from '../assets/icons'
import { Filter } from '../../model'
import getIconSlot from '../util/get-icon-slot'

export default class GscapeFilters extends LitElement {
  filters: Map<string, Filter>

  static properties = {
    filters : { type: Object, attribute: false }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          order: 3;
          display:inline-block;
          position: initial;
          margin-top:10px;
        }

        gscape-button{
          position: static;
        }

        gscape-toggle {
          padding: 8px;
        }

        gscape-toggle[first]{
          justify-content: center;
          border-bottom: 1px solid var(--theme-gscape-borders, ${colors.borders});
          margin-bottom: 10px;
          padding: 10px;
        }
      `,
    ]
  }

  constructor(filters = {}) {
    super()
    // this.collapsible = true
    // this.filterList = filters

    // this.btn = new GscapeButton(filter, 'Filters')
    // this.highlighted = true
    // this.btn.onClick = this.toggleBody.bind(this)
    // this.btn.active = false

    // this.onFilterOn = () => {}
    // this.onFilterOff = () => {}
  }

  render() {
    return html`
      <gscape-button>
        ${getIconSlot('icon', filterIcon)}
      </gscape-button>


      <!-- <span class="gscape-panel-arrow hide"></span> -->
      <div class="widget-body hide gscape-panel">
        <div class="header">Filters</div>

        <div class="filters-wrapper">
          ${Array.from(this.filters).map(([key, filter]) => {
            // let toggle = {}

            /**
             * filter toggles work in inverse mode
             *  checked => filter not active
             *  unchecked => filter active
             *
             * we invert the visual behaviour of a toggle passing the last flag setted to true
             * the active boolean will represent the filter state, not the visual state.
             */
            // if (key == 'all') {
            //   toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this))
            //   toggle.setAttribute('first', 'true')
            // } else {
            //   toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this), true)
            // }
            // toggle.label_pos = 'right'
            // return html`
            //   ${toggle}
            // `
          })}
        </div>
      </div>
    `
  }

  // toggleFilter(e) {
  //   let toggle = e.target
  //   if (toggle.id == 'all')
  //     toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id)
  //   else
  //     !toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id)
  // }

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



// customElements.define('gscape-filters', GscapeFilters)