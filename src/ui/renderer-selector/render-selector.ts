import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { RendererStatesEnum } from '../../model'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle, { BOTTOM_RIGHT_WIDGET } from '../style'
import { RendererStateViewModel } from './controller'
import { GscapeLayoutSettings } from './floaty-layout-settings'

export default class GscapeRenderSelector extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Renderer Selector'
  rendererStates: (RendererStateViewModel | undefined)[]
  actualRendererStateKey: RendererStatesEnum
  onRendererStateSelection: (rendererState: RendererStatesEnum) => void = () => {}
  layoutSettingsComponent: GscapeLayoutSettings

  static properties: PropertyDeclarations = {
    actualRendererStateKey: { type: String, attribute: false },
    rendererStates: { type: Object, attribute: false }
  }

  static styles?: CSSResultGroup = [
    baseStyle,
    css`
      :host {
        order: 7;
        margin-top:10px;
      }

      .gscape-panel-in-tray {
        top:10px;
        bottom: initial;
      }
    `
  ]

  constructor() {
    super()
    this.classList.add(BOTTOM_RIGHT_WIDGET.toString())
  }

  render() {
    return html`
    ${this.actualRendererStateKey === RendererStatesEnum.FLOATY
      ? html`
          ${this.layoutSettingsComponent}
          <div class="hr"></div>
        `
      : null
    }

      <gscape-button @click="${this.togglePanel}" type="subtle">
        <span slot="icon">${this.actualRendererState?.icon}</span>
      </gscape-button>

      <div class="gscape-panel gscape-panel-in-tray drop-left hide" id="drop-panel">
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