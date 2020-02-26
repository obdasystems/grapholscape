import { html, css } from 'lit-element'
import GscapeWidget from './common/gscape-widget'
import GscapeHeader from './common/gscape-header'
import { Icon } from '@material/mwc-icon'

export default class GscapeRenderSelector extends GscapeWidget {

  static get properties() {
    return {
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

        .renderer-item {
          cursor:pointer;
          padding:5px 10px;
          display: flex;
          align-items: center;
        }

        .renderer-item:hover {
          color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
          background-color:var(--theme-gscape-secondary, ${colors.secondary});
        }

        .renderer-item:first-of-type {
          border-top-left-radius: inherit;
          border-top-right-radius: inherit;
        }

        .selected {
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
          font-weight: bold;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        .head-btn {
          padding: 4px 2px;
        }

        gscape-head {
          --title-padding: 5px 40px 5px 10px;
          --btn-padding: 4px 2px;
        }

        mwc-icon {
          padding-right:8px;
        }
      `,
    ]
  }

  constructor(renderers) {
    super(false, true) 

    this.renderers = renderers
    this.dict = {
      default : {
        name : "Graphol",
        icon : "",
      },
      lite :{
        name: "Graphol-Lite",
        icon: 'flash_on',
      },
      float : {
        name: "Floaty",
        icon: "bubble_chart",
      }
    }
    
    this.actual_mode = 'default'
    this.header = new GscapeHeader()
    this.header.title = this.dict["default"].name
    this._onRendererChange = {}
  }

  render() {
    return html`
      <div class="widget-body hide">
        ${Object.keys(this.renderers).map( mode => html`
        <div 
          @click="${this.changeRenderer}" 
          mode="${mode}"
          class="renderer-item ${mode == 'default' ? `selected` : ``}"
        >
          <mwc-icon>${this.dict[mode].icon}</mwc-icon>
          ${this.dict[mode].name}
        </div>
        `)}
      </div>

      ${this.header}
    `
  }

  changeRenderer(e) {
    if (this.shadowRoot.querySelector('.selected'))
      this.shadowRoot.querySelector('.selected').classList.remove('selected')

    e.target.classList.add('selected')
    let mode = e.target.getAttribute('mode')
    this.header.title = this.dict[mode].name
    this.toggleBody()
    this._onRendererChange(mode)
    this.actual_mode = mode
  }

  firstUpdated() {
    super.firstUpdated()
    // invert header's dropdown icon behaviour
    this.header.collapsed = false
  }

  set onRendererChange(f) {
    this._onRendererChange = f
  }
}



customElements.define('gscape-render-selection', GscapeRenderSelector)