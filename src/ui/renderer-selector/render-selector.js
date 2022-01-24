import { html, css } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import GscapeButton from '../common/gscape-button'

export default class GscapeRenderSelector extends GscapeWidget {

  static get properties() {
    return {
      actual_mode : { type : String }
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          display:inline-block;
          position: initial;
          margin-top:10px;
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

        .renderer-item > .label {
          padding:0 10px;
          white-space: nowrap;
        }

        .selected {
          background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
          color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
          font-weight: bold;
        }

        .widget-body {
          border-radius: inherit;
          border-bottom-right-radius:0;
        }

        .gscape-panel {
          padding: 0;
          bottom:initial;
          top:10px;
        }

        .gscape-panel::after {
          top: 8px;
        }
        gscape-head {
          --header-padding: 5px 8px;
        }

        svg {
          margin-right:8px;
        }
      `,
    ]
  }

  constructor(dict = {}) {
    super()
    this.collapsible = true

    this.dict = dict
    this._actual_mode = null
    this._onRendererChange = () => {}

    this.mainButton = new GscapeButton()
    this.mainButton.onclick = () => this.toggleBody()
    this.mainButton.style.position = 'inherit'
    //this.header.title = this.dict[this.actual_mode]?.label
    //this.header.left_icon = this.dict[this.actual_mode]?.icon
  }

  render() {
    return html`
      <div class="widget-body hide gscape-panel">
        ${Object.keys(this.dict).map( mode => html`
        <div
          @click="${this.changeRenderer}"
          mode="${mode}"
          class="renderer-item ${mode == this.actual_mode ? `selected` : ``}"
        >
        ${this.isCustomIcon(this.dict[mode].icon) ? html`
          <mwc-icon-button>${this.dict[mode].icon}</mwc-icon-button>`
        : html`
          <mwc-icon-button icon="${this.dict[mode].icon}"></mwc-icon-button>
        `}
        <span class="label">${this.dict[mode].label}</span>
        </div>
        `)}
      </div>

     ${this.mainButton}
    `
  }

  changeRenderer(e) {
    if (this.shadowRoot.querySelector('.selected'))
      this.shadowRoot.querySelector('.selected').classList.remove('selected')

    let target = e.currentTarget
    target.classList.add('selected')
    let mode = target.getAttribute('mode')
    this.actual_mode = mode
    this.toggleBody()
    this._onRendererChange(mode)
  }

  set onRendererChange(f) {
    this._onRendererChange = f
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block'
  }

  set actual_mode(mode) {
    this._actual_mode = mode

    //this.header.title = this.dict[mode].label
    this.mainButton.icon = this.dict[mode].icon
  }

  get actual_mode() { return this._actual_mode }
}

customElements.define('gscape-render-selector', GscapeRenderSelector)