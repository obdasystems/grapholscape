import { html, css, LitElement, SVGTemplateResult, PropertyDeclarations, CSSResultGroup } from 'lit'
import GscapeWidget from '../common/gscape-widget'
import GscapeHeader from '../common/gscape-header'
import GscapeButton from '../common/button'
import { tune } from '../assets/icons'
import getIconSlot from '../util/get-icon-slot'
import baseStyle from '../style'
import { RenderStatesEnum } from '../../model'
import { RendererStates, RendererStateViewModel } from './controller'
import { GscapeLayoutSettings } from './floaty-layout-settings'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import { BaseMixin } from '../common/base-widget-mixin'



export default class GscapeRenderSelector extends DropPanelMixin(BaseMixin(LitElement)) {
  rendererStates: RendererStates
  actualRendererStateKey: RenderStatesEnum
  onRendererStateSelection: (rendererState: RenderStatesEnum) => void = () => {}
  layoutSettingsComponent: GscapeLayoutSettings

  static properties: PropertyDeclarations = {
    actualRendererStateKey: { type: String, attribute: false },
    rendererStates: { type: Object, attribute: false }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        order: 6;
        margin-top:10px;
        border-radius: var(--gscape-border-radius-btn);
        border: 1px solid var(--gscape-color-border-subtle);
        background-color: var(--gscape-color-bg-default);
      }

      .gscape-panel-in-tray {
        top:10px;
        bottom: initial;
      }

      :host(:hover) {
        border-color: var(--gscape-color-border-default);
      }
    `
  ]

  // static get styles() {
  //   let super_styles = super.styles
  //   let colors = super_styles[1]

  //   return [
  //     super_styles[0],
  //     css`
  //       :host {
  //         order: 6;
  //         display:inline-block;
  //         position: initial;
  //         margin-top:10px;
  //       }

  //       .renderer-item {
  //         cursor:pointer;
  //         padding: 10px;
  //         display: flex;
  //         align-items: center;
  //       }

  //       .renderer-item:hover {
  //         color: var(--theme-gscape-on-secondary, ${colors.on_secondary});
  //         background-color:var(--theme-gscape-secondary, ${colors.secondary});
  //       }

  //       .renderer-item:first-of-type {
  //         border-top-left-radius: inherit;
  //         border-top-right-radius: inherit;
  //       }

  //       .renderer-item:last-of-type {
  //         border-bottom-left-radius: inherit;
  //         border-bottom-right-radius: inherit;
  //       }

  //       .renderer-item > .label {
  //         white-space: nowrap;
  //         top: 2px;
  //         position: relative;
  //       }

  //       .selected {
  //         background-color: var(--theme-gscape-primary-dark, ${colors.primary_dark});
  //         color: var(--theme-gscape-on-primary-dark, ${colors.on_primary_dark});
  //         font-weight: bold;
  //       }

  //       .gscape-panel {
  //         padding: 0;
  //         bottom:initial;
  //         top:10px;
  //       }

  //       gscape-head {
  //         --header-padding: 5px 8px;
  //       }

  //       svg {
  //         margin-right:8px;
  //       }

  //       #hr {
  //         height:1px;
  //         width:90%;
  //         margin: 0 auto;
  //         background-color: var(--theme-gscape-borders, ${colors.borders})
  //       }
  //     `,
  //   ]
  // }

  constructor() {
    super()

    // this.dict = dict
    // this._actual_mode = null
    // this._onRendererChange = () => {}

    // this.btn = new GscapeButton(null, 'Select Renderer')
    // this.btn.highlighted = true
    // this.btn.onClick = () => this.toggleBody()
    // this.btn.style.position = 'inherit'
    // this.btn.classList.add('flat')
    // this.layoutSettingsComponent = null
    //this.header.title = this.dict[this.actual_mode]?.label
    //this.header.left_icon = this.dict[this.actual_mode]?.icon
  }

  render() {
    return html`
    ${this.actualRendererStateKey === RenderStatesEnum.FLOATY
      ? html`
          ${this.layoutSettingsComponent}
          <div class="hr"></div>
        `
      : null
    }

      <gscape-button 
        @click="${this.togglePanel}" 
        type="subtle"
      >
        <span slot="icon">${this.actualRendererState?.icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray drop-left hide" id="drop-panel">
        ${Object.entries(this.rendererStates).map(([key, rendererState]) => html`
          <gscape-action-list-item
            @click=${this.rendererSelectionHandler}
            label="${rendererState.name}"
            renderer-state="${key}"
            ?selected = "${this.actualRendererState === rendererState}"
          >
            <span slot="icon">${rendererState.icon}</span>
          </gscape-action-list-item>
        `)}
      </div>
    `
  }

  private rendererSelectionHandler(e: Event) {
    this.togglePanel()
    const rendererState = (e.target as HTMLElement).getAttribute('renderer-state') as RenderStatesEnum
    this.onRendererStateSelection(rendererState)
  }

  private get actualRendererState() { return this.rendererStates[this.actualRendererStateKey] }

  // render() {
  //   return html`
  //     ${this.actual_mode === renderers.floatyRenderer.key
  //       ? html`${this.layoutSettingsComponent} <div id="hr"></div>`
  //       : null
  //     }


  //     ${this.btn}
  //     <span class="gscape-panel-arrow hide"></span>
  //     ${Object.keys(this.dict)?.length > 1
  //       ? html`
  //         <div class="widget-body hide gscape-panel border-right">
  //           ${Object.keys(this.dict).map( mode => html`
  //           <div
  //             @click="${this.changeRenderer}"
  //             mode="${mode}"
  //             class="renderer-item ${mode == this.actual_mode ? `selected` : ``}"
  //           >
  //           ${this.dict[mode].icon}
  //           <span class="label">${this.dict[mode].label}</span>
  //           </div>
  //           `)}
  //         </div>
  //       `
  //       : null
  //     }
  //   `
  // }

  // changeRenderer(e) {
  //   if (this.shadowRoot.querySelector('.selected'))
  //     this.shadowRoot.querySelector('.selected').classList.remove('selected')

  //   let target = e.currentTarget
  //   target.classList.add('selected')
  //   let mode = target.getAttribute('mode')
  //   this.actual_mode = mode
  //   this.toggleBody()
  //   this._onRendererChange(mode)
  // }

  // set onRendererChange(f) {
  //   this._onRendererChange = f
  // }

  // show() {
  //   if (this.isEnabled) this.style.display = 'inline-block'
  // }

  // blur() {
  //   super.blur()
  // }

  // set actual_mode(mode) {
  //   this._actual_mode = mode

  //   //this.header.title = this.dict[mode].label
  //   this.btn.icon = this.dict[mode].icon
  //   if (mode === renderers.floatyRenderer.key)
  //     this.btn.classList.add('flat-button')
  //   else 
  //     this.btn.classList.remove('flat-button')
  // }

  // get actual_mode() { return this._actual_mode }
}

customElements.define('gscape-render-selector', GscapeRenderSelector)