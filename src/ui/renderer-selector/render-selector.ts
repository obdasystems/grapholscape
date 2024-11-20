import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { RendererStatesEnum } from '../../model'
import { refresh } from '../assets'
import { BaseMixin, TippyDropPanelMixin } from '../common/mixins'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { UiOption } from './view-model'

export default class GscapeRenderSelector extends TippyDropPanelMixin(BaseMixin(LitElement), 'left') {
  title = 'Renderer Selector'
  rendererStates: (UiOption | undefined)[]
  currentRendererStateKey: RendererStatesEnum
  onRendererStateSelection: (rendererState: RendererStatesEnum) => void = () => { }
  onIncrementalReset?: () => void

  static properties: PropertyDeclarations = {
    currentRendererStateKey: { type: String, attribute: false },
    rendererStates: { type: Object, attribute: false },
    onIncrementalRefresh: { type: Object, attribute: false }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        order: 7;
        margin-top:10px;
      }
    `
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
      ${this.currentRendererStateKey === RendererStatesEnum.INCREMENTAL && this.onIncrementalReset
        ? html`
          <gscape-button @click=${this.onIncrementalReset} type="subtle" title="Restart Incremental Exploration">
            <span slot="icon">${refresh}</span>
          </gscape-button>
          <div class="hr"></div>
        `
        : null
      }

      <gscape-button @click="${this.togglePanel}" type="subtle">
        <span slot="icon">${this.currentRendererState?.icon || html`<div style="padding: 1.5px 6.5px;" class="bold-text">?</div>`}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hide" id="drop-panel">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
          ${this.rendererStates.map(rendererState => {
            if (rendererState) {
              return html`
                  <gscape-action-list-item
                    @click=${this.rendererSelectionHandler}
                    label="${rendererState.name}"
                    renderer-state="${rendererState.id}"
                    ?selected = "${this.currentRendererState === rendererState}"
                  >
                    <span slot="icon">${rendererState.icon}</span>
                  </gscape-action-list-item>
                `
            }
          })}
        </div>
      </div>
    `
  }

  private rendererSelectionHandler(e: Event) {
    this.togglePanel()
    const rendererState = (e.target as HTMLElement).getAttribute('renderer-state') as RendererStatesEnum
    this.onRendererStateSelection(rendererState)
  }

  private get currentRendererState() { return this.rendererStates.find(r => r?.id === this.currentRendererStateKey) }
}

customElements.define('gscape-render-selector', GscapeRenderSelector)