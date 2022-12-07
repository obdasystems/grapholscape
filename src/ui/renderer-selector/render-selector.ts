import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { RendererStatesEnum } from '../../model'
import { refresh } from '../assets'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { GscapeLayoutSettings } from './floaty-layout-settings'
import { UiOption } from './view-model'

export default class GscapeRenderSelector extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Renderer Selector'
  rendererStates: (UiOption | undefined)[]
  actualRendererStateKey: RendererStatesEnum
  onRendererStateSelection: (rendererState: RendererStatesEnum) => void = () => { }
  onIncrementalReset?: () => void
  layoutSettingsComponent: GscapeLayoutSettings

  static properties: PropertyDeclarations = {
    actualRendererStateKey: { type: String, attribute: false },
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
      ${this.actualRendererStateKey === RendererStatesEnum.FLOATY ||
        this.actualRendererStateKey === RendererStatesEnum.INCREMENTAL
        ? html`
          ${this.actualRendererStateKey === RendererStatesEnum.INCREMENTAL && this.onIncrementalReset
            ? html`
              <gscape-button @click=${this.onIncrementalReset} type="subtle" title="Restart Incremental Exploration">
                <span slot="icon">${refresh}</span>
              </gscape-button>
              <div class="hr"></div>
            `
            : null
          }
          ${this.layoutSettingsComponent}
          <div class="hr"></div>
        `
        : null
      }

      <gscape-button @click="${this.togglePanel}" type="subtle">
        <span slot="icon">${this.actualRendererState?.icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray hanging hide" id="drop-panel">
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
      ${this.rendererStates.map(rendererState => {
        if (rendererState) {
          return html`
                <gscape-action-list-item
                  @click=${this.rendererSelectionHandler}
                  label="${rendererState.name}"
                  renderer-state="${rendererState.id}"
                  ?selected = "${this.actualRendererState === rendererState}"
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

  private get actualRendererState() { return this.rendererStates.find(r => r?.id === this.actualRendererStateKey) }
}

customElements.define('gscape-render-selector', GscapeRenderSelector)