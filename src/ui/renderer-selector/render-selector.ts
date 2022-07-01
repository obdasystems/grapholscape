import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import { RenderStatesEnum } from '../../model'
import { BaseMixin } from '../common/base-widget-mixin'
import { DropPanelMixin } from '../common/drop-panel-mixin'
import baseStyle from '../style'
import { RendererStates } from './controller'
import { GscapeLayoutSettings } from './floaty-layout-settings'

export default class GscapeRenderSelector extends DropPanelMixin(BaseMixin(LitElement)) {
  title = 'Renderer Selector'
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
        <div class="header">${this.title}</div>
        <div class="content-wrapper">
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
      </div>
    `
  }

  private rendererSelectionHandler(e: Event) {
    this.togglePanel()
    const rendererState = (e.target as HTMLElement).getAttribute('renderer-state') as RenderStatesEnum
    this.onRendererStateSelection(rendererState)
  }

  private get actualRendererState() { return this.rendererStates[this.actualRendererStateKey] }
}

customElements.define('gscape-render-selector', GscapeRenderSelector)