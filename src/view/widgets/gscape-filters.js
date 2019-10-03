import { html, css } from 'lit-element'
import GscapeButton from './common/gscape-button'
import GscapeWidget from './common/gscape-widget'
import GscapeToggle from './common/gscape-toggle'

export default class GscapeFilters extends GscapeWidget {

  static get properties() {
    return {
      filters : {
        type: Object,
        hasChanged(newVal, oldVal) {
          if(!oldVal) return true

          Object.keys(newVal).map(key => {
            if ( (newVal[key].active != oldVal[key].active) || 
              (newVal[key].disabled != oldVal[key].disabled) )
              return true
          })

          return false
        }
      }
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          bottom:10px;
          left:10px;
        }

        gscape-button{
          position: static;
        }

        gscape-toggle[first]{
          justify-content: center;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding: 10px;
        }
      `,
    ]
  }

  constructor(filters) {
    super(false, true) 

    this.filters = filters

    this.btn = new GscapeButton('filter_list')
    this.btn.onClick = this.toggleBody.bind(this)

    this.onFilterOn = null
    this.onFilterOff = null
  }


  render() {
    return html`
      ${this.btn}
      
      <div class="widget-body hide gscape-panel">
        <div class="gscape-panel-title">Filters</div>

        <div class="filters-wrapper">
          ${Object.keys(this.filters).map(key => {
            let filter = this.filters[key]
            let toggle = {}
            
            /**
             * filter toggles work in inverse mode
             *  checked => filter not active
             *  unchecked => filter active
             * 
             * we invert the visual behaviour of a toggle passing the last flag setted to true
             * the active boolean will represent the filter state, not the visual state.
             */
            if (key == 'all') { 
              toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this))
              toggle.setAttribute('first', 'true')
            } else {
              toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, this.toggleFilter.bind(this), true)
            }

            return html`
              ${toggle}
            `
          })}
        </div>
      </div>
    `
  }

  toggleFilter(e) {
    let toggle = e.target
    this.filters[toggle.id].active = !this.filters[toggle.id].active   

    if (toggle.id == 'attributes') {
      this.filters.value_domain.disabled = this.filters.attributes.active
    }

    // if 'all' is toggled, it affect all other filters
    if (toggle.id == 'all') {
      Object.keys(this.filters).map(key => {
        if ( key != 'all' && !this.filters[key].disbaled) { 
          this.filters[key].active = this.filters.all.active
          
          /** 
           * if the actual filter is value-domain it means it's not disabled (see previous if condition)
           * but when filter all is active filter value-domain must be disabled, let's disable it
           */
          if (key == 'value_domain')
            this.filters[key].disabled = this.filters.all.active

          this.filters[key].active ? this.onFilterOn(this.filters[key]) : this.onFilterOff(this.filters[key])
        }
      })
    } else {
      // if one filter get deactivated while the 'all' filter is active
      // then make the 'all' toggle deactivated
      if (!this.filters[toggle.id].active && this.filters.all.active) {
        this.filters.all.active = false
      }

      this.filters[toggle.id].active ? this.onFilterOn(this.filters[toggle.id]) : this.onFilterOff(this.filters[toggle.id])
    }
    this.updateTogglesState()
  }

  updateTogglesState() {
    let toggles = this.shadowRoot.querySelectorAll(`gscape-toggle`)
    
    toggles.forEach(toggle => {
      toggle.state = this.filters[toggle.key].active
      toggle.disabled = this.filters[toggle.key].disabled
    })
  }
}



customElements.define('gscape-filters', GscapeFilters)