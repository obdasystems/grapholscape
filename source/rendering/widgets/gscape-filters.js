import { html, css } from 'lit-element'
import GscapeButton from './gscape-button'
import GscapeWidget from './gscape-widget'

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

        .panel-title{
          font-weight: bold;
          text-align: center;
          margin-bottom: 10px;
        }

        .filter-entry {
          white-space: nowrap;
          padding: 6px;
          display: flex;
          align-items: center;
        }

        .filter-entry:first-child{
          justify-content: center;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          padding: 10px;
        }

        .filter-toggle-wrap {
          width: 33px;
          height: 19px;
          display: inline-block;
          position: relative;
        }

        .filter-toggle {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: 0.2s;
          border-radius: 19px;
        }

        .filter-toggle::before {
          position: absolute;
          content: "";
          height: 11px;
          width: 11px;
          left: 4px;
          bottom: 4px;
          background-color: var(--theme-gscape-primary, ${colors.primary});
          -webkit-transition: .1s;
          transition: .1s;
          border-radius: 20px;
        }

        .filter-toggle-wrap input {
          display:none;
        }

        .filter-toggle-wrap input:checked + .filter-toggle {
          background-color: var(--theme-gscape-secondary, ${colors.secondary});
        }

        .filter-toggle-wrap input:checked + .filter-toggle::before {
          -webkit-transform: translateX(14px);
          -ms-transform: translateX(14px);
          transform: translateX(14px);      
        }

        .filter-toggle-wrap input:disabled + .filter-toggle {
          opacity:0.25;
        }

        .filter-label {
          margin-left: 10px;
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
        <div class="panel-title">Filters</div>

        <div class="filters-wrapper">
          ${Object.keys(this.filters).map(key => {

            if (key == 'all') {
              return html`
                <div class="filter-entry">
                  <label class="filter-toggle-wrap">
                    <input id="${key}" type="checkbox" 
                      ?checked="${this.filters[key].active}"
                      ?disabled="${this.filters[key].disabled}"
                      @click="${this.toggleFilter}"
                    />
                    <span class="filter-toggle"></span>
                  </label>
                  <span class="filter-label">${this.filters[key].label}</span>
                </div>
              `
            }
            else return html`
              <div class="filter-entry">
                <label class="filter-toggle-wrap">
                  <input id="${key}" type="checkbox" 
                    ?checked="${!this.filters[key].active}"
                    ?disabled="${this.filters[key].disabled}"
                    @click="${this.toggleFilter}"
                  />
                  <span class="filter-toggle"></span>
                </label>
                <span class="filter-label">${this.filters[key].label}</span>
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  toggleFilter(e) {
    this.filters[e.target.id].active = !this.filters[e.target.id].active   

    if (e.target.id == 'attributes') {
      if (!e.target.checked)
        this.filters.value_domain.disabled = true
      else
        this.filters.value_domain.disabled = false
    }

    // if 'all' is toggled, it affect all other filters
    if (e.target.id == 'all') {
      Object.keys(this.filters).map(key => {
        if ( key != 'all') { 
          let toggle = this.shadowRoot.querySelector(`#${key}`)

          this.filters[key].active = this.filters.all.active

          /**
           * 'value_domain' filter must be disabled when we apply all filters together
           * because we don't want the user to be able to activate it when 'attributes_filter' 
           * is still off
           */
          if (key == 'value_domain')
            this.filters[key].disabled = this.filters.all.active

          // force toggle to change its visual state
          toggle.checked = !this.filters[key].active

          this.filters[key].active ? this.onFilterOn(key) : this.onFilterOff(key)
        }
      })
    } else {
      // if one filter get deactivated while the 'all' filter is active
      // then make the 'all' toggle deactivated
      if (!this.filters[e.target.id].active && this.filters.all.active) {
        this.filters.all.active = false

        // force toggle to change its visual state
        let toggle = this.shadowRoot.querySelector('#all')
        toggle.checked = false
      }

      this.filters[e.target.id].active ? this.onFilterOn(e.target.id) : this.onFilterOff(e.target.id)
    }
    

    this.requestUpdate()
  }

  updated() {
    //console.log(this.shadowRoot.querySelector('#all').checked)
    //onsole.log(this.filters['all'].active) 
  }
}



customElements.define('gscape-filters', GscapeFilters)